// components/IngredientsList.js
import React , { useState ,useEffect } from 'react';

const IngredientsList = ({ 
  isEditing, 
  newIngredients, 
  setNewIngredients, 
  suggestedIngredients, 
  setSearchQuery,
  searchQuery,
  addIngredient,
  removeIngredient,
  recipe // Ensure recipe is passed as a prop
}) => {


  useEffect(() => {
    if (isEditing && recipe?.ingredients?.length > 0) {
      setNewIngredients(recipe.ingredients.map((ing) => ({
        ...ing,
        quantity: ing.quantity || '',
      })));
    }
  }, [isEditing, recipe]);



  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Ingredients</h3>
      
      {isEditing ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients..."
              className="w-full p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-sm sm:text-base"
            />
          </div>

          {/* Suggested Ingredients */}
          {suggestedIngredients.length > 0 && (
            <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto bg-white rounded-lg sm:rounded-xl border border-gray-200">
              {suggestedIngredients.map((ingredient) => (
                <div
                  key={ingredient._id}
                  className="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer text-sm sm:text-base"
                  onClick={() => addIngredient(ingredient)}
                >
                  <div className="font-medium">{ingredient.name}</div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    {ingredient.description || 'No description'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Added Ingredients List */}
          {newIngredients.length > 0 ? (
            <div className="mt-3 sm:mt-4">
              <h4 className="text-base font-semibold mb-2">Added Ingredients</h4>
              <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto space-y-2">
                {newIngredients.map((ingredient) => (
                  <div key={ingredient._id || ingredient.ingredient_name} className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex flex-col w-full">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">{ingredient.name}</h3>
                      <input
                        type="text"
                        value={ingredient.quantity || ''}
                        onChange={(e) => {
                          const updatedIngredients = [...newIngredients];
                          updatedIngredients[index].quantity = e.target.value;
                          setNewIngredients(updatedIngredients);
                        }}
                        className="bg-transparent border-none outline-none text-xs sm:text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-gray-500 text-sm sm:text-base">
              No ingredients added yet.
            </div>
          )}
        </div>
      ) : (
        <ul className="max-h-[250px] sm:max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 space-y-2">
          {recipe?.ingredients?.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex justify-between p-2 sm:p-3 bg-white rounded-lg shadow-sm text-sm sm:text-base"
              >
                <div>
                  <span className="font-medium text-gray-800">{ingredient.name}</span>
                  <span className="text-gray-500 ml-2">{ingredient.quantity}</span>
                </div>
                <span className="text-gray-400">{index + 1}</span>
              </li>
            ))
          ) : (
            <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-gray-500 text-sm sm:text-base">
              No ingredients available.
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default IngredientsList;