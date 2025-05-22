// components/CookingTime.js
import { useState } from 'react';

const CookingTime = ({ isEditing, newCookingTime, setNewCookingTime, recipe }) => {
  return (
    <div className="relative group bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center space-x-4">
        {/* Clock Icon */}
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
          <svg className="w-8 h-8 text-white animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">
            Cooking Time
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white drop-shadow">
              {isEditing ? (
                <input
                  type="number"
                  value={newCookingTime}
                  onChange={(e) => setNewCookingTime(e.target.value)}
                  className="w-12 bg-transparent text-3xl font-bold text-white outline-none"
                />
              ) : (
                recipe.cookingTime || 20
              )}
            </span>
            <span className="text-lg font-medium text-purple-100">mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingTime;