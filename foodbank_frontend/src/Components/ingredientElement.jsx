import React from 'react';




const IngredientElement = ({ ingredient, checked, onChangeHandler }) => {
  return (
    <div className="flex items-center mb-2 hover:bg-gray-100 rounded p-1 transition-colors">
      <input
        type="checkbox"
        id={`ingredient-${ingredient}`}
        checked={checked}
        onChange={onChangeHandler} // Use onChange instead of onClick
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label 
        htmlFor={`ingredient-${ingredient}`}
        className={`ml-2 text-sm cursor-pointer select-none ${
          checked ? 'text-black font-medium' : 'text-gray-600'
        }`}
      >
        {ingredient || 'Unknown Ingredient'}
      </label>
    </div>
  );
};

export default IngredientElement;

