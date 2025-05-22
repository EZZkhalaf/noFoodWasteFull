import React, { useEffect, useState } from 'react';
import RecipeElement from './RecipeElement';

const DisplayRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:3000/recipe');
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);


  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 gap-y-5'>
      {recipes.slice(0, 9).map((recipe) => (
        <RecipeElement 
        RecipeId={recipe._id}
        recipe_image={recipe.recipe_image}
        recipe_name={recipe.recipe_title}
        recipe_description={recipe.recipe_description}
        cookingTime={recipe.cookingTime} // Add this line
      />
      ))}
    </div>
  );
}
  
export default DisplayRecipes;
