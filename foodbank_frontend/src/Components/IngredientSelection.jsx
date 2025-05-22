import React, { useEffect, useState } from 'react';
import IngredientElement from './ingredientElement';

const IngredientSelection = ({ selectedItems, setSelectedItems  , componentTitle}) => {
  const [ingredientsBucket, setIngredientsBucket] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');
  const [searchedIngBucket, setSearchedIngBucket] = useState([]);
  const [loading, setLoading] = useState(false);

  // Show only the first 30 ingredients
  const visibleIngredients = showAll ? ingredientsBucket : ingredientsBucket.slice(0, 30);
  const visibleSearchedIngredients = searchedIngBucket.slice(0, 30);

  // Update the query every 500ms
  useEffect(() => {
    const delay = setTimeout(() => handleIngredientSearch(query), 500);
    return () => clearTimeout(delay);
  }, [query]);

  // This function handles ingredient search
  const handleIngredientSearch = async (searchedIng) => {
    if (!searchedIng) {
      setSearchedIngBucket([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/ingredients/searchIngredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient_name: searchedIng }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data || 'Error fetching the searchIngredients section');

      setSearchedIngBucket(data);
    } catch (error) {
      console.log('Error in fetching ingredients', error);
    } finally {
      setLoading(false);
    }
  };

  // Displaying some suggested elements from the backend (only 20)
  useEffect(() => {
    const getFirst30 = async () => {
      try {
        const response = await fetch('http://localhost:3000/ingredients/getFirst20');
        if (!response.ok) throw new Error('Error in fetching the data and the network');

        const data = await response.json();
        setIngredientsBucket(data);
      } catch (error) {
        console.log(error);
      }
    };
    getFirst30();
  }, []);

  // This function for putting the selected items in one bucket above the rest of the elements
  const handleSelectedItems = (ingredient) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(ingredient)) {
        // If ingredient is already in selectedItems, remove it
        return prevSelectedItems.filter((ing) => ing !== ingredient);
      } else {
        // If ingredient is not in selectedItems it gets added
        return [...prevSelectedItems, ingredient];
      }
    });
  };

  return (
    <div className="w-full h-1/2 min-h-[50vh] px-4 flex flex-col">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{componentTitle}</h3>

        {/* Search Input */}
        <div className="relative w-full mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search ingredients..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="my-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Selected Ingredients:</h4>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md">
              {selectedItems.map((ingredient, index) => (
                <IngredientElement
                  key={index}
                  ingredient={ingredient}
                  checked={selectedItems.includes(ingredient)}
                  onChangeHandler={() => handleSelectedItems(ingredient)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Searched Ingredients */}
        {searchedIngBucket.length > 0 && (
          <div className="flex flex-wrap gap-4 p-4 min-w-[calc(40rem)] bg-gray-300 rounded-md shadow-md transition-all">
            {loading ? (
              <div className="w-full text-center py-6">
                <div className="loader"></div> {/* Add custom loader */}
              </div>
            ) : (
              visibleSearchedIngredients.map((ingredient, index) => (
                <IngredientElement
                  key={index}
                  ingredient={ingredient.ingredient_name}
                  checked={selectedItems.includes(ingredient.ingredient_name)}
                  onChangeHandler={() => handleSelectedItems(ingredient.ingredient_name)}
                />
              ))
            )}
          </div>
        )}

        {/* Ingredients List (Selected) */}
        {searchedIngBucket.length === 0 && (
          <div className="flex flex-wrap gap-4 p-4 min-w-[calc(40rem)] bg-gray-200 rounded-md shadow-md transition-all">
            {visibleIngredients.map((ingredient, index) => (
              <IngredientElement
                key={index}
                ingredient={ingredient.ingredient_name}
                checked={selectedItems.includes(ingredient.ingredient_name)}
                onChangeHandler={() => handleSelectedItems(ingredient.ingredient_name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientSelection;
