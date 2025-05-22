
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiBookmarkPlus } from "react-icons/ci";
import { IoMdBookmark } from "react-icons/io";
import { Clock, Utensils } from 'lucide-react';
import { useAuthContext } from '../Context/AuthContext';
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';
import defaultPhoto from '../assets/defaultPhoto.png'

const RecipeElementFeed = ({
  RecipeId,
  recipe_image,
  recipe_name,
  recipe_description,
  recipeType,
  cookingTime,
  difficulty,
  recipe_user,
  bookmarks
}) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(recipe_image || defaultRecipeImage);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const recipeUserId = recipe_user[0];
  const [recipeOwner, setRecipeOwner] = useState(null);

  useEffect(() => {
    if (recipe_image) {
      const isBase64 = /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipe_image);
      setDisplayedImage(isBase64 ? recipe_image : defaultRecipeImage);
    } else {
      setDisplayedImage(defaultRecipeImage);
    }
  }, [recipe_image]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/checkSave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, recipeId: RecipeId })
        });
        const data = await response.json();
        setSaved(data === 'saved');
      } catch (error) {
        console.error("Error checking saved status:", error);
        setError(error.message);
      }
    };

    const getTheOwnerData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/getUserById", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: recipeUserId })
        });

        if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
        const data = await response.json();
        console.log(data)
        setRecipeOwner(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    if (user?._id) {
      getTheOwnerData();
      checkSavedStatus();
    }
  }, [user?._id, RecipeId]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserid: user._id, RecipeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSaved(true);
    } catch (error) {
      console.error("Error saving bookmark:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserid: user._id, RecipeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSaved(false);
    } catch (error) {
      console.error("Error unsaving bookmark:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <Link
      to={`/recipe/${RecipeId}`}
      className="block rounded-2xl overflow-hidden shadow group hover:shadow-xl transition-all duration-500 transform hover:scale-101 bg-white"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header: Avatar + Username */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center">
            {/* <img
              src={recipeOwner.profilePic || defaultPhoto}
              alt={`${recipeOwner?.username || 'User'} avatar`}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            /> */}

            <img
              src={
                recipeOwner?.profilePic && /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipeOwner.profilePic)
                  ? recipeOwner.profilePic
                  : defaultPhoto
              }
              alt={`${recipeOwner?.username || 'User'} avatar`}
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />


            <span className="ml-3 font-medium text-gray-800 text-base">
              {recipeOwner?.username || 'Unknown'}
            </span>
          </div>
          {/* Optional time */}
          {/* <span className="text-sm text-gray-500">{someTimeAgoLogic}</span> */}
        </div>
  
        {/* Recipe image */}
        <div className="relative">
          <img
            src={displayedImage}
            alt={recipe_name}
            className="w-full h-60 object-cover transition-opacity duration-500 ease-in-out"
          />
        </div>
  
        {/* Recipe content */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 leading-snug">{recipe_name}</h2>
            <button
              onClick={saved ? handleUnBookmark : handleBookmark}
              className="
                bg-white bg-opacity-80 p-2 rounded-full 
                transition transform duration-300 ease-out 
                hover:scale-110 hover:bg-opacity-100 
                shadow-sm hover:shadow-md
              "
            >
              {saved ? (
                <IoMdBookmark className="text-blue-600 text-xl" />
              ) : (
                <CiBookmarkPlus className="text-gray-600 text-xl" />
              )}
            </button>
          </div>
  
          <p className="text-gray-700 text-sm line-clamp-3">{recipe_description}</p>
  
          <div className="mt-4 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
            <span className="flex items-center">
              <Utensils className="w-4 h-4 mr-1" /> {recipeType}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {cookingTime} mins
            </span>
            <span className="flex items-center">
              {difficulty}
            </span>
            <span className="flex items-center">

              Bookmarks : {bookmarks}
              
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
  
};

export default RecipeElementFeed;
