import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Clock, Utensils, ArrowRight } from 'lucide-react';
import defaultRecipeImage from "../assets/defaultRecipeImage.jpg"

const FeaturedRecipe = ({ recipe }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const [displayImage , setDisplayedImage] = useState(null);
  useEffect(() =>{
    if(recipe.recipe_image){
      const imageBase64 =  /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipe.recipe_image);
      if(imageBase64) setDisplayedImage(recipe.recipe_image);
        else setDisplayedImage(defaultRecipeImage);
    } else setDisplayedImage(defaultRecipeImage);



  } , [recipe.recipe_image])
  return (
    <Link
      to={`/recipe/${recipe._id}`}
    >
    <div className="grid md:grid-cols-2 gap-8 bg-sand-50 rounded-2xl overflow-hidden bg-gray-200">
      <div className="relative h-full">
        <div className={`absolute inset-0 bg-sand-100 ${!imageLoaded ? 'animate-pulse' : ''}`} />
        <img
          src={displayImage}
          alt={recipe.recipe_title}
          className={`h-full w-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="p-8 flex flex-col justify-center">
        {recipe.type && (
          <span className="inline-block bg-sand-100 text-sand-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {recipe.type}
          </span>
        )}
        
        <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-4">
          {recipe.recipe_title}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {recipe.recipe_description}
        </p>
        
        <div className="flex items-center space-x-6 mb-8 text-sm">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{recipe.cookingTime} minutes</span>
          </div>
          
        </div>
        
        <Link 
          to={`/recipe/${recipe._id}`}
          className="inline-flex items-center px-6 py-3 bg-spice-500 text-white rounded-lg hover:bg-spice-600 transition-colors w-fit group"
        >
          View Recipe
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
    </Link>

  );
};

export default FeaturedRecipe;