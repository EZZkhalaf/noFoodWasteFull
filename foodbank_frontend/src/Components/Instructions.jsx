// components/Instructions.js
import { useState } from 'react';

const Instructions = ({ isEditing, newInstruction, setNewInstruction, recipe }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl ring-1 sm:ring-2 ring-purple-200 mt-6 sm:mt-8 md:mt-10">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b-2 border-purple-300 pb-2">
        Step-by-Step Instructions
      </h2>
      {isEditing ? (
        <textarea
          value={newInstruction}
          onChange={(e) => setNewInstruction(e.target.value)}
          className="w-full p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm resize-none h-48 sm:h-64 text-sm sm:text-base"
          placeholder="Instructions..."
        />
      ) : (
        <ol className="space-y-3 sm:space-y-4">
          {recipe.instructions?.split(". ").map((step, index) =>
            step ? (
              <li key={index} className="relative pl-5 sm:pl-6 py-2 sm:py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <span className="absolute left-1.5 sm:left-2 top-3.5 sm:top-4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                <p className="text-gray-700 text-sm sm:text-base pl-3 sm:pl-4">{step.trim()}</p>
              </li>
            ) : null
          )}
        </ol>
      )}
    </div>
  );
};

export default Instructions;