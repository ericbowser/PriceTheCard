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

  // Load library from localStorage on mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem('mtgLibrary');
    if (savedLibrary) {
      setLibrary(JSON.parse(savedLibrary));
    }
  }, []);

  // Save library to localStorage whenever it changes
  useEffect(() => {
    if (library.length > 0) {
      localStorage.setItem('mtgLibrary', JSON.stringify(library));
    }
  }, [library]);

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
        setCards(data);
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message || "Failed to fetch card data");
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = () => {
    if (!selectedCard) return;
    
    const price = parseFloat(selectedCard.prices?.usd || 0);
    const existingIndex = library.findIndex(item => item.id === selectedCard.id);
    
    if (existingIndex >= 0) {
      // Update quantity if card already exists
      const updatedLibrary = [...library];
      updatedLibrary[existingIndex].quantity += quantity;
      updatedLibrary[existingIndex].totalValue = updatedLibrary[existingIndex].quantity * price;
      setLibrary(updatedLibrary);
    } else {
      // Add new card to library
      const newItem = {
        id: selectedCard.id,
        name: selectedCard.name,
        set_name: selectedCard.set_name,
        collector_number: selectedCard.collector_number,
        image_uris: selectedCard.image_uris,
        price: price,
        quantity: quantity,
        totalValue: quantity * price,
        scryfall_id: selectedCard.id
      };
      setLibrary([...library, newItem]);
    }
    
    setQuantity(1);
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
          totalValue: newQuantity * item.price
        };
      }
      return item;
    });
    setLibrary(updatedLibrary);
  };

  const calculateTotalValue = () => {
    return library.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Set', 'Collector Number', 'Price', 'Quantity', 'Total Value', 'Scryfall ID'];
    const rows = library.map(item => [
      `"${item.name}"`,
      `"${item.set_name || ''}"`,
      item.collector_number || '',
      item.price.toFixed(2),
      item.quantity,
      item.totalValue.toFixed(2),
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
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const importedLibrary = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const item = {
          id: values[6] || `imported-${i}`, // Scryfall ID or generated ID
          name: values[0],
          set_name: values[1] || '',
          collector_number: values[2] || '',
          price: parseFloat(values[3]) || 0,
          quantity: parseInt(values[4]) || 1,
          totalValue: parseFloat(values[5]) || 0,
          scryfall_id: values[6] || ''
        };
        importedLibrary.push(item);
      }
      
      setLibrary(importedLibrary);
      setShowLibrary(true);
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

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 
                        text-red-700 dark:text-red-400 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {cards.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Found {cards.length} printing{cards.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-left 
                            transition-all hover:shadow-lg border-2
                            ${selectedCard?.id === card.id 
                              ? 'border-blue-500 ring-2 ring-blue-300' 
                              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                >
                  {card.image_uris?.small && (
                    <img
                      src={card.image_uris.small}
                      alt={card.name}
                      className="w-full rounded mb-2"
                    />
                  )}
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {card.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {card.set_name} {card.collector_number && `#${card.collector_number}`}
                  </p>
                  {card.prices?.usd && (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ${card.prices.usd}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCard && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                <div className="mt-6 flex gap-4 items-center">
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
                  <button
                    onClick={addToLibrary}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add to Library
                  </button>
                </div>
              </div>
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
                    {library.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {item.image_uris?.small && (
                              <img
                                src={item.image_uris.small}
                                alt={item.name}
                                className="w-12 h-16 object-cover rounded"
                              />
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {item.set_name} {item.collector_number && `#${item.collector_number}`}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                          ${item.price.toFixed(2)}
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
                          ${item.totalValue.toFixed(2)}
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
                    ))}
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