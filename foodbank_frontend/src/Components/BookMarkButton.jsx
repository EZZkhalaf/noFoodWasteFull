// BookmarkButton.jsx
import React, { useState, useEffect } from 'react';
import { IoMdBookmark } from 'react-icons/io';

const BookmarkButton = ({ recipeId, userId, isBookmarked: initialIsBookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmarkToggle = async () => {
    setLoading(true);
    try {
      const endpoint = isBookmarked 
        ? 'http://localhost:3000/user/unsave' 
        : 'http://localhost:3000/user/save';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserid: userId,
          RecipeId: recipeId
        })
      });

      if (!response.ok) throw new Error(isBookmarked ? 'Failed to unbookmark' : 'Failed to bookmark');
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out ${
        isBookmarked
          ? 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
      }`}
      onClick={handleBookmarkToggle}
      disabled={loading}
    >
      <IoMdBookmark className={`mr-2 ${isBookmarked ? 'text-purple-600' : 'text-white'}`} />
      <span className={`${isBookmarked ? 'text-gray-700 hover:text-gray-900' : 'text-white'}`}>
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </button>
  );
};

export default BookmarkButton;