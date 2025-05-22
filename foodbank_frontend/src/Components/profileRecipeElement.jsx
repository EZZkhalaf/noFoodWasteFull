



// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { CiBookmarkPlus } from "react-icons/ci";
// import { useAuthContext } from '../Context/AuthContext';
// import { IoMdBookmark } from "react-icons/io";
// import { Clock, Utensils } from 'lucide-react';
// import defaultRecipeImage from "../assets/defaultRecipeImage.jpg"
// const ProfileRecipeElement = ({ RecipeId, recipe_image, recipe_name, recipe_description , recipeType ,cookingTime , difficulty}) => {
//     const [imageLoaded, setImageLoaded] = useState(false);
//     const [loading, setLoading] = useState(false);
  

//     return (
//         <Link
//               to={`/recipe/${RecipeId}`}
//               className="block group transform transition-all hover:scale-[1.02]"
//             >
//               <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
//                 {/* Image Container */}
//                 <div className="relative aspect-[4/3] bg-sand-100">
//                   {!imageLoaded && <div className="absolute inset-0 animate-pulse" />}
//                   <img
//                     className={`w-full h-full object-cover transition-opacity duration-300 ${
//                       imageLoaded ? 'opacity-100' : 'opacity-0'
//                     }`}
//                     src={recipe_image && recipe_image.trim() !== "" ? recipe_image : defaultRecipeImage}
//                     alt={recipe_name}
//                     onLoad={() => setImageLoaded(true)}
//                   />
                  
              


//                 </div>
//                 {recipeType && (
//                   <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
//                     {recipeType}
//                   </div>
//                 )}

//                 {/* Content */}
//                 <div className="p-4 text-left"> 
//                   <h3 className="font-serif text-lg font-medium line-clamp-2 mb-2 flex">
//                     {recipe_name}
//                   </h3>
//                   <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
//                     {recipe_description}
//                   </p>
//                   <div className="flex items-center text-sm text-muted-foreground space-x-4">
//                     <div className="flex items-center">
//                       <Clock className="w-4 h-4 mr-1" />
//                       <span>{cookingTime} min</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Utensils className="w-4 h-4 mr-1" />
//                       <span>{difficulty}</span>
//                     </div>
//                   </div>
                  
//                 </div>

//               </div>
//           </Link>
//       );
// }

// export default ProfileRecipeElement


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Utensils } from 'lucide-react';
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';

const profileRecipeElement = ({ RecipeId, recipe_image, recipe_name, cookingTime, difficulty }) => {
  const [displayedImage, setDisplayedImage] = useState(recipe_image || defaultRecipeImage);
  
  




  useEffect(() => {
    if (recipe_image && (recipe_image.startsWith("http") || /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipe_image))) {
      setDisplayedImage(recipe_image);
    } else {
      setDisplayedImage(defaultRecipeImage);
    }
  }, [recipe_image]);

  return (
    <Link
      to={`/recipe/${RecipeId}`}
      className="block group transform transition-all hover:scale-[1.02]"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gray-200">
          <img
            className="w-full h-full object-cover transition-opacity duration-300"
            src={displayedImage}
            alt={recipe_name || "Recipe Image"}
            onError={() => setDisplayedImage(defaultRecipeImage)}
          />
        </div>

        {/* Content */}
        <div className="p-4 text-left"> 
          <h3 className="font-serif text-lg font-medium line-clamp-2 mb-2 flex">
            {recipe_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
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

export default profileRecipeElement;

