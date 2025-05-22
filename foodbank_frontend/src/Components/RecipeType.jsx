// import React, { useState } from 'react';

// const RecipeType = ({ selectedRecipeType, setSelectedRecipeType }) => {
//   // Static list of recipe types
//   // the ' ' type will be removed later or modified to 'ALL'    
//   const recipeTypes = [
//     '',
//     'Appetizer',
//     'Main Course',
//     'Dessert',
//     'Soup',
//     'Salad',
//     'Beverage',
//     'Side Dish',
//     'Snack',
//     'Drinks',
//     'Vegan'
//   ];
//   const handleTypeSelect = (type)=>{
//     setSelectedRecipeType(type => selectedRecipeType? '' : type);
//   }

//   // Handle the change in recipe type
//   const handleChange = (type) => {
//     setSelectedRecipeType(prevType => (prevType === type ? '' : type));
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Recipe Type</h3>
//       <div className="max-h-64 overflow-hidden rounded-lg border border-gray-200 p-3">
//         {/* Dynamically rendering recipe types */}
//         {recipeTypes.map((type) => (
//           <div className="flex items-center mb-2" key={type}>
//             <input
//               type="radio"
//               name="recipeType"
//               value={type}
//               checked={selectedRecipeType === type}
//               onChange={() => handleChange(type)}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
//             />
//             <label className="ml-2 text-sm text-gray-600">{type}</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecipeType;





import React from 'react';

const RecipeType = ({ selectedRecipeType, setSelectedRecipeType }) => {
  // Updated recipe types to match common categories and remove duplicates
  const recipeTypes = [
    'Appetizer',
    'Main Course',
    'Breakfast',
    'Dessert',
    'Soup',
    'Salad',
    'Beverage',
    'Side Dish',
    'Snack',
    'Vegan'
  ];

  // Handle type selection/deselection
  const handleChange = (type) => {
    setSelectedRecipeType(prevType => (prevType === type ? '' : type));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by Recipe Type</h3>
      <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 p-3">
        {/* All Categories option */}
        <div className="flex items-center mb-2">
          <input
            type="radio"
            name="recipeType"
            value=""
            checked={selectedRecipeType === ''}
            onChange={() => handleChange('')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm text-gray-600">All Categories</label>
        </div>

        {/* Recipe type options */}
        {recipeTypes.map((type) => (
          <div className="flex items-center mb-2" key={type}>
            <input
              type="radio"
              name="recipeType"
              value={type}
              checked={selectedRecipeType === type}
              onChange={() => handleChange(type)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">{type}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeType;