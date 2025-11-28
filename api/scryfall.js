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

export { searchCards, getCardImage };