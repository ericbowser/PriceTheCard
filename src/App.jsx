import React, { useState, useEffect } from "react";
import { searchCards } from "../api/scryfall.js";

const App = () => {
  const [cardName, setCardName] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [library, setLibrary] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showLibrary, setShowLibrary] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [isFoil, setIsFoil] = useState(false);

  // Load library from localStorage on mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem('mtgLibrary');
    if (savedLibrary) {
      const parsed = JSON.parse(savedLibrary);
      // Add dateAdded to existing cards that don't have it (for sorting)
      const libraryWithDates = parsed.map(item => ({
        ...item,
        dateAdded: item.dateAdded || new Date(0).toISOString() // Very old date for existing cards
      }));
      setLibrary(libraryWithDates);
    }
  }, []);

  // Save library to localStorage whenever it changes
  useEffect(() => {
    if (library.length > 0) {
      localStorage.setItem('mtgLibrary', JSON.stringify(library));
    }
  }, [library]);

  // Helper function to parse CSV line handling quoted values
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Helper function to find card index in library by matching criteria
  const findCardIndex = (library, card) => {
    // First try to match by scryfall_id + isFoil (foil and non-foil are different)
    if (card.scryfall_id) {
      const byId = library.findIndex(item => 
        item.scryfall_id === card.scryfall_id && 
        (item.isFoil || false) === (card.isFoil || false)
      );
      if (byId >= 0) return byId;
    }
    
    // Then try to match by name + set + collector_number + isFoil
    return library.findIndex(item => 
      item.name === card.name &&
      item.set_name === card.set_name &&
      item.collector_number === card.collector_number &&
      (item.isFoil || false) === (card.isFoil || false)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    setLoading(true);
    setError(null);
    setCards([]);
    setSelectedCard(null);

    try {
      const data = await searchCards(cardName.trim());
      if (data.length === 0) {
        setError("No cards found matching your search.");
      } else {
        // Sort by release date (most recent first)
        const sortedData = [...data].sort((a, b) => {
          const dateA = a.released_at ? new Date(a.released_at) : new Date(0);
          const dateB = b.released_at ? new Date(b.released_at) : new Date(0);
          return dateB - dateA; // Most recent first
        });
        setCards(sortedData);
        setFilterQuery(""); // Reset filter when new search is performed
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message || "Failed to fetch card data");
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = (card = null) => {
    const cardToAdd = card || selectedCard;
    if (!cardToAdd) {
      console.error('No card to add');
      return;
    }
    
    // Validate that we have essential card data
    if (!cardToAdd.name && !cardToAdd.id) {
      console.error('Invalid card data - missing name and id:', cardToAdd);
      setError('Unable to add card: missing card information. Please try selecting the card first.');
      return;
    }
    
    console.log('Adding card to library:', cardToAdd);
    console.log('Card properties:', {
      id: cardToAdd.id,
      name: cardToAdd.name,
      set_name: cardToAdd.set_name,
      collector_number: cardToAdd.collector_number,
      prices: cardToAdd.prices,
      image_uris: cardToAdd.image_uris
    });
    
    // Use foil price if isFoil is true, otherwise use regular price
    const price = isFoil 
      ? parseFloat(cardToAdd.prices?.usd_foil || cardToAdd.prices?.usd || 0)
      : parseFloat(cardToAdd.prices?.usd || 0);
    
    // Try to find existing card using same matching logic as import
    // Include isFoil in matching so foil and non-foil are separate entries
    const cardToMatch = {
      name: cardToAdd.name,
      set_name: cardToAdd.set_name,
      collector_number: cardToAdd.collector_number,
      scryfall_id: cardToAdd.id,
      isFoil: isFoil
    };
    
    const existingIndex = findCardIndex(library, cardToMatch);
    
    if (existingIndex >= 0) {
      // Update quantity if card already exists
      const updatedLibrary = [...library];
      updatedLibrary[existingIndex].quantity += quantity;
      // Update price if current price is 0 or if new price is available
      if (price > 0 && (updatedLibrary[existingIndex].price === 0 || !updatedLibrary[existingIndex].price)) {
        updatedLibrary[existingIndex].price = price;
      }
      // Update foil status if not set
      if (isFoil && !updatedLibrary[existingIndex].isFoil) {
        updatedLibrary[existingIndex].isFoil = true;
      }
      updatedLibrary[existingIndex].totalValue = updatedLibrary[existingIndex].quantity * updatedLibrary[existingIndex].price;
      // Update timestamp to reflect most recent addition
      updatedLibrary[existingIndex].dateAdded = new Date().toISOString();
      // Update image if not already present
      if (cardToAdd.image_uris && (!updatedLibrary[existingIndex].image_uris || Object.keys(updatedLibrary[existingIndex].image_uris).length === 0)) {
        updatedLibrary[existingIndex].image_uris = cardToAdd.image_uris;
      }
      // Update scryfall_id if not present
      if (cardToAdd.id && !updatedLibrary[existingIndex].scryfall_id) {
        updatedLibrary[existingIndex].scryfall_id = cardToAdd.id;
        updatedLibrary[existingIndex].id = cardToAdd.id;
      }
      // Update set_name and collector_number if missing
      if (!updatedLibrary[existingIndex].set_name && cardToAdd.set_name) {
        updatedLibrary[existingIndex].set_name = cardToAdd.set_name;
      }
      if (!updatedLibrary[existingIndex].collector_number && cardToAdd.collector_number) {
        updatedLibrary[existingIndex].collector_number = cardToAdd.collector_number;
      }
      console.log('Updated existing card:', updatedLibrary[existingIndex]);
      setLibrary(updatedLibrary);
    } else {
      // Add new card to library - ensure we have valid data
      if (!cardToAdd.name) {
        console.error('Cannot add card: missing name property', cardToAdd);
        setError(`Unable to add card: missing card name. Please try selecting the card first or search again.`);
        return;
      }
      
      const newItem = {
        id: cardToAdd.id || `card-${Date.now()}-${Math.random()}`,
        name: cardToAdd.name,
        set_name: cardToAdd.set_name || cardToAdd.set || '',
        collector_number: cardToAdd.collector_number || '',
        image_uris: cardToAdd.image_uris || cardToAdd.card_faces?.[0]?.image_uris || {},
        price: price,
        quantity: quantity,
        totalValue: quantity * price,
        scryfall_id: cardToAdd.id || '',
        isFoil: isFoil,
        dateAdded: new Date().toISOString()
      };
      console.log('Adding new card:', newItem);
      setLibrary([...library, newItem]);
    }
    
    setQuantity(1);
    setIsFoil(false); // Reset foil flag after adding
    setShowLibrary(true);
  };

  const removeFromLibrary = (id) => {
    setLibrary(library.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromLibrary(id);
      return;
    }
    
    const updatedLibrary = library.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          totalValue: newQuantity * item.price,
          dateAdded: new Date().toISOString() // Update timestamp when quantity changes
        };
      }
      return item;
    });
    setLibrary(updatedLibrary);
  };

  const calculateTotalValue = () => {
    return library.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2);
  };

  // Fuzzy search function to filter cards by name and set
  const fuzzyMatch = (text, query) => {
    if (!query) return true;
    const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
    
    // All query words must be found in the text
    return queryWords.every(word => normalizedText.includes(word));
  };

  const filteredCards = cards.filter(card => {
    if (!filterQuery.trim()) return true;
    const cardNameMatch = fuzzyMatch(card.name || "", filterQuery);
    const setNameMatch = fuzzyMatch(card.set_name || "", filterQuery);
    const setCodeMatch = fuzzyMatch(card.set || "", filterQuery);
    return cardNameMatch || setNameMatch || setCodeMatch;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Set', 'Collector Number', 'Price', 'Quantity', 'Total Value', 'Foil', 'Scryfall ID'];
    const rows = library.map(item => [
      `"${item.name}"`,
      `"${item.set_name || ''}"`,
      item.collector_number || '',
      item.price.toFixed(2),
      item.quantity,
      item.totalValue.toFixed(2),
      item.isFoil ? 'Yes' : 'No',
      item.scryfall_id
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mtg-library-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setError("CSV file appears to be empty or invalid.");
          return;
        }
        
        // Parse headers
        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/"/g, '').trim());
        
        // Find column indices (case-insensitive, flexible matching)
        const findColumn = (possibleNames) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(h => h.includes(name.toLowerCase()));
            if (index >= 0) return index;
          }
          return -1;
        };
        
        const nameIndex = findColumn(['name', 'card', 'card name']);
        const setNameIndex = findColumn(['set', 'set name', 'set_name', 'edition']);
        const collectorIndex = findColumn(['collector', 'number', 'collector_number', 'collector number', 'collector #']);
        const priceIndex = findColumn(['price', 'usd', 'value', 'cost', '$', 'price usd', 'usd price']);
        const quantityIndex = findColumn(['quantity', 'qty', 'count', 'copies']);
        const totalValueIndex = findColumn(['total', 'total value', 'totalvalue', 'total_value', 'total $']);
        const foilIndex = findColumn(['foil', 'isFoil', 'is_foil', 'foil?']);
        const scryfallIdIndex = findColumn(['scryfall', 'scryfall_id', 'scryfall id', 'id']);
        
        if (nameIndex === -1) {
          setError("Could not find 'Name' column in CSV. Please check the file format.");
          return;
        }
        
        // Helper to clean and parse price value
        const parsePrice = (value) => {
          if (!value || value === '' || value === null || value === undefined) return 0;
          // Convert to string, remove quotes, $, commas, and whitespace, then parse
          let cleaned = String(value).trim();
          cleaned = cleaned.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
          cleaned = cleaned.replace(/[$,\s]/g, ''); // Remove $, commas, and whitespace
          const parsed = parseFloat(cleaned);
          if (isNaN(parsed) || parsed < 0) return 0;
          return parsed;
        };
        
        // Log found columns for debugging
        console.log('CSV Import - Found columns:', {
          name: nameIndex >= 0 ? headers[nameIndex] : 'NOT FOUND',
          set: setNameIndex >= 0 ? headers[setNameIndex] : 'NOT FOUND',
          collector: collectorIndex >= 0 ? headers[collectorIndex] : 'NOT FOUND',
          price: priceIndex >= 0 ? headers[priceIndex] : 'NOT FOUND',
          quantity: quantityIndex >= 0 ? headers[quantityIndex] : 'NOT FOUND',
          total: totalValueIndex >= 0 ? headers[totalValueIndex] : 'NOT FOUND',
          scryfall: scryfallIdIndex >= 0 ? headers[scryfallIdIndex] : 'NOT FOUND'
        });
        
        const importedLibrary = [...library]; // Start with existing library
        
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          
          if (values.length === 0 || !values[nameIndex]) continue; // Skip empty rows
          
          const name = values[nameIndex] || '';
          const set_name = setNameIndex >= 0 ? (values[setNameIndex] || '') : '';
          const collector_number = collectorIndex >= 0 ? (values[collectorIndex] || '') : '';
          const quantity = quantityIndex >= 0 ? parseInt(values[quantityIndex]) || 1 : 1;
          const scryfall_id = scryfallIdIndex >= 0 ? (values[scryfallIdIndex] || '') : '';
          const isFoilImport = foilIndex >= 0 ? (values[foilIndex]?.toLowerCase() === 'yes' || values[foilIndex]?.toLowerCase() === 'true' || values[foilIndex] === '1') : false;
          
          // Parse price and total value
          let price = priceIndex >= 0 ? parsePrice(values[priceIndex]) : 0;
          let totalValue = totalValueIndex >= 0 ? parsePrice(values[totalValueIndex]) : 0;
          
          // If we have total value but no price, calculate price from total/quantity
          if (price === 0 && totalValue > 0 && quantity > 0) {
            price = totalValue / quantity;
          }
          // Always calculate total value from price * quantity if not explicitly provided
          // This ensures totalValue is always correct
          if (totalValueIndex === -1 || (totalValue === 0 && price >= 0)) {
            totalValue = price * quantity;
          }
          
          // Debug logging for first few rows
          if (i <= 3) {
            console.log(`Row ${i}: name="${name}", price=${price}, quantity=${quantity}, totalValue=${totalValue}, priceIndex=${priceIndex}, totalValueIndex=${totalValueIndex}`);
          }
          
          const importedCard = {
            id: scryfall_id || `imported-${i}-${Date.now()}`,
            name: name,
            set_name: set_name,
            collector_number: collector_number,
            price: price,
            quantity: quantity,
            totalValue: totalValue,
            scryfall_id: scryfall_id,
            isFoil: isFoilImport,
            image_uris: {}, // Will be populated if card is found via Scryfall later
            dateAdded: new Date().toISOString() // Timestamp for sorting
          };
          
          // Check if card already exists in library (including foil status)
          const existingIndex = findCardIndex(importedLibrary, importedCard);
          
          if (existingIndex >= 0) {
            // Merge: update quantity and total value
            importedLibrary[existingIndex].quantity += quantity;
            // Update price if the imported one is available (prefer imported price if it's non-zero)
            if (price > 0) {
              importedLibrary[existingIndex].price = price;
            }
            // Always recalculate total value based on current price and quantity
            importedLibrary[existingIndex].totalValue = importedLibrary[existingIndex].quantity * importedLibrary[existingIndex].price;
            // Update timestamp to reflect most recent import
            importedLibrary[existingIndex].dateAdded = new Date().toISOString();
          } else {
            // Add new card - ensure totalValue is calculated
            if (importedCard.totalValue === 0 && importedCard.price > 0) {
              importedCard.totalValue = importedCard.price * importedCard.quantity;
            }
            importedLibrary.push(importedCard);
          }
        }
        
        // Post-process: Ensure all totalValues are correctly calculated
        importedLibrary.forEach(item => {
          if (item.price !== undefined && item.quantity !== undefined) {
            item.totalValue = item.price * item.quantity;
          }
        });
        
        const importedCount = importedLibrary.length - library.length;
        const updatedCount = library.length - (importedLibrary.length - importedCount);
        
        setLibrary(importedLibrary);
        setShowLibrary(true);
        setError(null);
        
        // Show success message
        console.log(`CSV Import successful: ${importedCount} new cards added, ${updatedCount} existing cards updated`);
        console.log('Sample imported card:', importedLibrary[0]);
        if (priceIndex === -1) {
          console.warn('Warning: Price column not found in CSV. Prices may be 0.00');
        }
      } catch (err) {
        setError(`Error importing CSV: ${err.message}`);
        console.error('CSV Import Error:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          MTG Pricing and Card Management Assistant
        </h1>
        
        {/* Library Summary Bar */}
        <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              {showLibrary ? 'Hide' : 'Show'} Library ({library.length})
            </button>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Value: ${calculateTotalValue()}
            </span>
          </div>
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
              />
            </label>
            <button
              onClick={exportToCSV}
              disabled={library.length === 0}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter card name (e.g., Lightning Bolt)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !cardName.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                       text-white rounded-lg font-medium transition-colors
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {selectedCard && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {selectedCard.image_uris?.normal && (
                <div>
                  <img
                    src={selectedCard.image_uris.normal}
                    alt={selectedCard.name}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {selectedCard.name}
                </h2>
                {selectedCard.mana_cost && (
                  <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Mana Cost:</span> {selectedCard.mana_cost}
                  </p>
                )}
                {selectedCard.type_line && (
                  <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Type:</span> {selectedCard.type_line}
                  </p>
                )}
                {selectedCard.oracle_text && (
                  <div className="mb-4">
                    <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Oracle Text:</p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {selectedCard.oracle_text}
                    </p>
                  </div>
                )}
                {selectedCard.prices && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold mb-2 text-gray-900 dark:text-white">Prices:</p>
                    <div className="space-y-1 text-gray-700 dark:text-gray-300">
                      {selectedCard.prices.usd && (
                        <p>USD: ${selectedCard.prices.usd}</p>
                      )}
                      {selectedCard.prices.usd_foil && (
                        <p>USD Foil: ${selectedCard.prices.usd_foil}</p>
                      )}
                      {selectedCard.prices.eur && (
                        <p>EUR: €{selectedCard.prices.eur}</p>
                      )}
                      {selectedCard.prices.eur_foil && (
                        <p>EUR Foil: €{selectedCard.prices.eur_foil}</p>
                      )}
                    </div>
                  </div>
                )}
                {selectedCard.set_name && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Set:</span> {selectedCard.set_name}
                    {selectedCard.collector_number && ` (${selectedCard.collector_number})`}
                  </p>
                )}
                {selectedCard.rarity && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Rarity:</span> {selectedCard.rarity}
                  </p>
                )}
                <div className="mt-6 flex gap-4 items-center flex-wrap">
                  <label className="text-gray-700 dark:text-gray-300 font-semibold">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFoil}
                      onChange={(e) => setIsFoil(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold">Foil</span>
                  </label>
                  <button
                    onClick={() => addToLibrary(selectedCard)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 
                        text-red-700 dark:text-red-400 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {cards.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Found {cards.length} printing{cards.length !== 1 ? 's' : ''}
                {filterQuery && (
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                    ({filteredCards.length} matching)
                  </span>
                )}
              </h2>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by card name or set..."
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Set</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Set Name</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Card Name</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Collector #</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Rarity</th>
                    <th className="text-right py-3 px-4 text-gray-900 dark:text-white">Price</th>
                    <th className="text-center py-3 px-4 text-gray-900 dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.length === 0 ? (
                    <tr key="empty-search-results">
                      <td colSpan="7" className="py-8 text-center text-gray-600 dark:text-gray-400">
                        No cards match your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCards.map((card, index) => {
                      // Ensure we have a unique key
                      const uniqueKey = card.id || `card-${index}-${card.name || ''}-${card.set || ''}-${card.collector_number || ''}`;
                      return (
                      <tr
                        key={uniqueKey}
                        onClick={() => setSelectedCard(card)}
                      className={`border-b border-gray-200 dark:border-gray-700 cursor-pointer
                                transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50
                                ${selectedCard?.id === card.id 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                                  : ''
                                }`}
                    >
                      <td className="py-3 px-4">
                        {card.set && (
                          <img
                            src={`https://svgs.scryfall.io/sets/${card.set.toLowerCase()}.svg`}
                            alt={card.set_name || card.set}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              // Fallback if set emblem doesn't exist
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {card.set_name || 'Unknown Set'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {card.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {card.collector_number || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold
                          ${card.rarity === 'mythic' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                            card.rarity === 'rare' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            card.rarity === 'uncommon' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                          {card.rarity ? card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1) : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {card.prices?.usd ? (
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            ${card.prices.usd}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToLibrary(card);
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                                   font-medium transition-colors text-sm"
                        >
                          Add to Library
                        </button>
                      </td>
                    </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Library Display */}
        {showLibrary && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Library
            </h2>
            {library.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Your library is empty. Search for cards and add them to get started!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Card</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Set</th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-white">Price</th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-white">Quantity</th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-white">Total</th>
                      <th className="text-center py-3 px-4 text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...library]
                      .sort((a, b) => {
                        // Sort by dateAdded (most recent first)
                        // If no dateAdded, treat as very old (will appear at bottom)
                        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
                        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
                        return dateB - dateA; // Most recent first
                      })
                      .map((item, index) => {
                        // Ensure unique key
                        const uniqueKey = item.id || `library-item-${index}-${item.name || ''}-${item.set_name || ''}`;
                        return (
                      <tr key={uniqueKey} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {item.image_uris?.small && (
                              <img
                                src={item.image_uris.small}
                                alt={item.name}
                                className="w-12 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </span>
                              {item.isFoil && (
                                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                                  ✨ Foil
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {item.set_name} {item.collector_number && `#${item.collector_number}`}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                          ${(item.price || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          ${(item.totalValue || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => removeFromLibrary(item.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                        );
                      })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-400 dark:border-gray-500">
                      <td colSpan="4" className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                        Grand Total:
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-xl text-blue-600 dark:text-blue-400">
                        ${calculateTotalValue()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;