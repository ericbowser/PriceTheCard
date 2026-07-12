import axios from 'axios';


async function searchCards(cardName, exact = false) {
  try {
    const headers = {
      'Accept': 'application/json;q=0.9,*/*;q=0.8'
    };
    const encodedName = encodeURIComponent(cardName);
    // Use exact match syntax if exact=true, otherwise use fuzzy search
    const query = exact ? `!"${cardName}"` : cardName;
    const encodedQuery = encodeURIComponent(query);
    
    let allCards = [];
    let nextPage = `https://api.scryfall.com/cards/search?q=${encodedQuery}&unique=prints`;
    
    // Handle pagination to get all results
    while (nextPage) {
      const response = await axios.get(nextPage, { headers });
      allCards = allCards.concat(response.data.data);
      
      if (response.data.has_more) {
        nextPage = response.data.next_page;
        // Add delay to respect rate limits (50-100ms between requests)
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        nextPage = null;
      }
    }
    
    return allCards;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getCardImage(cardName) {
  try {
    const headers = {
      'Accept': 'application/json;q=0.9,*/*;q=0.8'
    };
    const response = await axios.get(`https://api.scryfall.com/cards/image/${cardName}`, {headers});
    return response.data.image_uris.normal;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Batch-fetch full card objects by Scryfall ID (up to 75 per request, per Scryfall's limit).
// Returns a map of { [scryfall_id]: cardObject } for every id that was found.
async function getCardsByIds(scryfallIds) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const uniqueIds = [...new Set(scryfallIds)].filter(Boolean);
  const results = {};

  for (let i = 0; i < uniqueIds.length; i += 75) {
    const batch = uniqueIds.slice(i, i + 75);
    try {
      const response = await axios.post(
          'https://api.scryfall.com/cards/collection',
          { identifiers: batch.map(id => ({ id })) },
          { headers }
      );
      for (const card of response.data.data) {
        results[card.id] = card;
      }
    } catch (err) {
      console.error('Batch image fetch failed for a chunk:', err);
    }
    // Respect Scryfall's rate limit guidance between requests
    if (i + 75 < uniqueIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

export { searchCards, getCardImage, getCardsByIds };