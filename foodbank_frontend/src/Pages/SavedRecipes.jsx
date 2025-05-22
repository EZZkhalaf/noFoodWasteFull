
import React, { useState, useEffect } from 'react';
import SavedRecipeElement from '../Components/SavedRecipeElement';
import { useAuthContext } from '../Context/AuthContext';
import NavBar from '../Components/NavBar';
import { Link } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';


const SavedRecipes = () => {
  const { user } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const [loading , setLoading] = useState(false);
  const userid = user._id;

  // Fetch saved recipes
  useEffect(() => {
    const getSavedRecipes = async () => {
      setLoading(true);
      try {

        const response = await fetch(`http://localhost:3000/user/savedRecipes/${userid}`);
        const data = await response.json();
        if(data.length === 0){
          setRecipes([]);
          return 
        }
        const response2 = await fetch('http://localhost:3000/recipe/getMultipleRecipesData' , {
          method : 'POST' ,
          headers: {"Content-Type" : 'application/json'},
          body : JSON.stringify({
            recipeIds : data
          })
        }) 
        const data2= await response2.json();
        setRecipes(data2)
      } catch (error) {
        console.log(error); // Handle error
      }finally{
        setLoading(false);
      }
    };
    getSavedRecipes();
  }, [user]);

  // Remove a recipe from the saved list
  const removeRecipe = (RecipeId) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== RecipeId));
  };



  if (loading)     
    return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      </div>
    </div>
  );

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className="bg-gray-100 p-6 mt-13 flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Saved Recipes</h1>
        <div className='flex justify-center items-center mt-10'>
          <div className="w-[40vw] border-t-2 border-sand-200"></div>
        </div>
  
        {/* Conditionally render the content */}
        {recipes.length === 0 ? (
          <div className="text-center mt-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">No Saved Recipes</h2>
            <p className="text-xl text-gray-600 mb-8">Explore more recipes and search for your favorites!</p>
            {/* You can add a link or a button to redirect users to explore more */}
            <Link to={'/findRecipes'}>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
              Explore Recipes
            </button>
            </Link>
          </div>
        ) : (
 



          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-12">
            {recipes.map((recipe) => (
              <SavedRecipeElement
                key={recipe._id}
                RecipeId={recipe._id}
                recipe_image={recipe.recipe_image}
                recipe_name={recipe.recipe_title}
                removeRecipe={removeRecipe}
              />
            ))}
          </div>

        )}
      </div>
    </div>
  );
  
  
};

export default SavedRecipes;

