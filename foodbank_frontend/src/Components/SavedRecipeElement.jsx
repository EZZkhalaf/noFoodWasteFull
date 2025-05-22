

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";
// import { useAuthContext } from '../Context/AuthContext';
// import { IoMdBookmark } from "react-icons/io";


// const SavedRecipeElement = ({ RecipeId, recipe_image, recipe_name }) => {
//   const [loading, setLoading] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const { user } = useAuthContext();

//   useEffect(() => {
//     const checkSavedStatus = async () => {
//       try {
//         const response  = await fetch('http://localhost:3000/user/checkSave', {
//           method: 'post' ,
//           headers:{'Content-Type' : 'application/json'},
//           body : JSON.stringify({
//             userId : user._id ,
//             recipeId : RecipeId
//           })
//         });

//         const data = await response.json();
//         if(data === 'not saved') setSaved(false);
//         if(data === 'saved') setSaved(true)
//       } catch (error) {
//         console.error("Error checking saved status:", error);
//       }
//     };

//     checkSavedStatus();
//   }, [user._id, RecipeId]); // Dependency array ensures it runs when user or recipe changes

  

//   const handleUnBookmark = async(e)=>{
//     e.stopPropagation();
//     e.preventDefault();

//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:3000/user/unsave', {
//         method: 'post',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           currentUserid: user._id,
//           RecipeId: RecipeId
//         })
//       });

//       const data = await response.json();
//       console.log(data)
//       if (data.message === 'Recipe removed from saved recipes successfully.') {
//         setSaved(false);
//       } 

//     } catch (error) {
//       console.error("Error unsaving bookmark:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <Link
//         to={`/recipe/${RecipeId}`} 
//         className="block transform transition-all hover:scale-105"
//       >
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
//           {/* Recipe Image */}
//           <img 
//             className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" 
//             src={recipe_image} 
//             alt={recipe_name} 
//           />

//           {/* Recipe Name & Bookmark */}
//           <div className="p-4 flex justify-between items-center">
//             <p className="text-lg font-semibold text-gray-800 text-center">{recipe_name}</p>

//             {/* Conditional Rendering for Bookmark Icon */}
            
//               <IoMdBookmark 
//                 onClick={handleUnBookmark}
//                 className="text-3xl text-green-600 hover:text-green-800 transition-colors duration-300 cursor-pointer"
//               />
            
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default SavedRecipeElement;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdBookmark } from "react-icons/io";
import { useAuthContext } from '../Context/AuthContext';
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';
const SavedRecipeElement = ({ RecipeId, recipe_image, recipe_name, removeRecipe }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuthContext();
  const [displayImage , setDisplayedImage]= useState(recipe_image || defaultRecipeImage);
  // Check if the recipe is saved by the user
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

    checkSavedStatus();


    if(recipe_image){
           const isBase64 = /^data:image\/(png|jpe?g|gif|webp);base64,/.test(recipe_image);
           if (!isBase64) {
             setDisplayedImage(defaultRecipeImage);
           } else {
             setDisplayedImage(recipe_image);
           }
         } else {
           setDisplayedImage(defaultRecipeImage);
         }
  }, [user._id, RecipeId]);

  // Handle unsaving the recipe (unbookmark)
  const handleUnBookmark = async (e) => {
    e.stopPropagation();
    e.preventDefault();

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
      if (data.message === 'Recipe removed from saved recipes successfully.') {
        setSaved(false);
        removeRecipe(RecipeId); // Call the removeRecipe function passed from the parent
      }
    } catch (error) {
      console.error("Error unsaving bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
    <Link
      to={`/recipe/${RecipeId}`}
      className="block h-full transform transition-all hover:scale-105"
    >
      <div className="bg-white h-full flex flex-col justify-between shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        {/* Recipe Image */}
        <img
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          src={displayImage}
          alt={recipe_name}
        />
  
        {/* Recipe Name & Bookmark */}
        <div className="p-4 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-800 text-center">{recipe_name}</p>
  
          {saved ? (
            <IoMdBookmark
              onClick={handleUnBookmark}
              className="text-3xl text-green-600 hover:text-green-800 transition-colors duration-300 cursor-pointer"
            />
          ) : (
            <IoMdBookmark
              onClick={handleUnBookmark}
              className="text-3xl text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
            />
          )}
        </div>
      </div>
    </Link>
  </div>
  
  );
};

export default SavedRecipeElement;
