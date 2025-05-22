import React , { useState, useEffect } from 'react'

const IngredientSearchRecipeEdit = ({ 
    searchQuery, 
    setSearchQuery, 
    suggestedIngredients, 
    setSuggestedIngredients, 
    isSearching, 
    setIsSearching, 
    addIngredient 
  }) => {
    useEffect(() => {
        if (searchQuery.trim() === '') {
          setSuggestedIngredients([]);
          return;
        }
    
        const searchIngredients = async () => {
          setIsSearching(true);
          try {
            const response = await fetch('http://localhost:3000/ingredients/searchIngredient', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ingredient_name: searchQuery }),
            });
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.message || 'Error fetching ingredients');
            }
    
            // Map the response to the structure your component expects
            const formattedIngredients = data.map(ingredient => ({
              _id: ingredient._id,
              name: ingredient.ingredient_name,
              unit: ingredient.unit || 'unit',
              description: ingredient.description || ''
            }));
    
            setSuggestedIngredients(formattedIngredients);
          } catch (error) {
            console.error('Error searching ingredients:', error);
          } finally {
            setIsSearching(false);
          }
        };
    
        const searchDebounce = setTimeout(searchIngredients, 300);
        return () => clearTimeout(searchDebounce);
      }, [searchQuery]);
    
      return (
        <div className="space-y-4">
          {/* Ingredient Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for ingredients..."
              className="w-full p-4 bg-white rounded-xl shadow-sm"
            />
            {isSearching && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                Searching...
              </span>
            )}
          </div>
    
          {/* Suggested Ingredients */}
          {suggestedIngredients.length > 0 ? (
            <div className="max-h-96 overflow-auto bg-white rounded-xl shadow-sm border border-gray-200">
              {suggestedIngredients.map((ingredient) => (
                <div
                  key={ingredient._id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => addIngredient(ingredient)}
                >
                  <div className="font-medium">{ingredient.name}</div>
                  <div className="text-sm text-gray-500">
                    {ingredient.description || 'No description'}
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div className="p-4 bg-white rounded-xl shadow-sm text-gray-500">
              No ingredients found matching your search.
            </div>
          ) : null}
        </div>
      );
}

export default IngredientSearchRecipeEdit