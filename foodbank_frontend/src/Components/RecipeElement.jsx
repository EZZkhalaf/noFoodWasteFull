
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiBookmarkPlus } from "react-icons/ci";
import { useAuthContext } from '../Context/AuthContext';
import { IoMdBookmark } from "react-icons/io";
import { Clock, Utensils } from 'lucide-react';
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';

const RecipeElement = ({ RecipeId, recipe_image, recipe_name, recipe_description, recipeType, cookingTime, difficulty }) => {


  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(recipe_image || defaultRecipeImage);
  const { user } = useAuthContext();

  useEffect(() => {
    if (recipe_image) {
      const isBase64 = /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipe_image);
      if (!isBase64) {
        setDisplayedImage(defaultRecipeImage);
      } else {
        setDisplayedImage(recipe_image);
      }
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
          body: JSON.stringify({
            userId: user._id,
            recipeId: RecipeId
          })
        });

        const data = await response.json();
        setSaved(data === 'saved');
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    if (user?._id) checkSavedStatus();
  }, [user?._id, RecipeId]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserid: user._id,
          RecipeId: RecipeId
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSaved(true);
    } catch (error) {
      console.error("Error saving bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnBookmark = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserid: user._id,
          RecipeId: RecipeId
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSaved(false);
    } catch (error) {
      console.error("Error unsaving bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/recipe/${RecipeId}`}
      className="block group transform transition-all hover:scale-[1.02]"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-sand-100">
          {!imageLoaded && <div className="absolute inset-0 animate-pulse" />}
          <img
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src={displayedImage}
            alt={recipe_name || "Default Recipe Image"}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = defaultRecipeImage;
              e.target.alt = "Default Recipe Image";
              setDisplayedImage(defaultRecipeImage);
            }}
          />
          
          {/* Bookmark Button */}
          <div className="absolute top-3 right-3">
            <button
              onClick={saved ? handleUnBookmark : handleBookmark}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer ${
                saved 
                  ? 'bg-green-100/90 text-green-600 hover:bg-green-200/90'
                  : 'bg-white/90 text-sand-600 hover:bg-gray-300/90'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {saved ? (
                <IoMdBookmark className="w-5 h-5" />
              ) : (
                <CiBookmarkPlus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {recipeType && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {recipeType}
          </div>
        )}

        {/* Content */}
        <div className="p-4 text-left"> 
          <h3 className="font-serif text-lg font-medium line-clamp-2 mb-2 flex">
            {recipe_name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {recipe_description}
          </p>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{cookingTime} min</span>
            </div>
            <div className="flex items-center">
              <Utensils className="w-4 h-4 mr-1" />
              <span>{difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeElement;