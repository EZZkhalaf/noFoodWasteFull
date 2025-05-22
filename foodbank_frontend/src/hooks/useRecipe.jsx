import React , {useState , useEffect }from 'react'

export const useRecipe = (RecipeId, user) => {
    const [recipe, setRecipe] = useState(null);
    const [recipeUser, setRecipeUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // edited values
    const [newRecipeTitle, setNewRecipeTitle] = useState('');
    const [newIngredients, setNewIngredients] = useState([]);
    const [newInstruction, setNewInstruction] = useState('');
    const [newRecipeDescription, setNewRecipeDescription] = useState('');
    const [newCookingTime, setNewCookingTime] = useState(20);
    const [newRecipeImage, setNewRecipeImage] = useState(null);

      // Fetch recipe and user data
  useEffect(() => {
    const fetchRecipeAndUser = async () => {
      setLoading(true);

      try {
        const recipeResponse = await fetch(`http://localhost:3000/recipe/${RecipeId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!recipeResponse.ok) throw new Error("Failed to fetch the recipe");
        const recipeData = await recipeResponse.json();
        setRecipe(recipeData);

        const userResponse = await fetch('http://localhost:3000/user/getUserById', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: recipeData.recipe_user }),
        });

        if (!userResponse.ok) throw new Error("Failed to fetch the recipe owner");
        const userData = await userResponse.json();
        setRecipeUser(userData);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndUser();
  }, [RecipeId]);



 // Check if recipe is bookmarked
 useEffect(() => {
    const checkBookmark = async () => {
      const response = await fetch('http://localhost:3000/user/checkSave', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: RecipeId,
          userId: user._id
        })
      });

      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setIsBookmarked(data === 'saved');
    };
    checkBookmark();
  }, [recipe]);

  // Initialize edited values when recipe data is available
  useEffect(() => {
    if (recipe) {
      setNewRecipeTitle(recipe.recipe_title || '');
      setNewIngredients(recipe.ingredients || []);
      setNewInstruction(recipe.instructions || '');
      setNewRecipeDescription(recipe.recipe_description || '');
      setNewCookingTime(recipe.cookingTime || 20);
    }
  }, [recipe]);

  // Save edited recipe
  const saveEditedRecipe = async () => {
    try {
      let formData = new FormData();
      formData.append('newRecipe_title', newRecipeTitle);
      formData.append('newIngredients', JSON.stringify(newIngredients));
      formData.append('newInstructions', newInstruction);
      formData.append('newRecipe_description', newRecipeDescription);
      formData.append('newCookingTime', newCookingTime);
      formData.append('newRecipe_image', newRecipeImage);

      const response = await fetch(`http://localhost:3000/recipe/${RecipeId}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update recipe');
      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    if (recipe) {
      setNewRecipeTitle(recipe.recipe_title || '');
      setNewIngredients(recipe.ingredients || []);
      setNewInstruction(recipe.instructions || '');
      setNewRecipeDescription(recipe.recipe_description || '');
      setNewCookingTime(recipe.cookingTime || 20);
    }
  };

  return {
    recipe,
    recipeUser,
    loading,
    isBookmarked,
    isEditing,
    newRecipeTitle,
    setNewRecipeTitle,
    newIngredients,
    setNewIngredients,
    newInstruction,
    setNewInstruction,
    newRecipeDescription,
    setNewRecipeDescription,
    newCookingTime,
    setNewCookingTime,
    newRecipeImage,
    setNewRecipeImage,
    saveEditedRecipe,
    cancelEditing,
    setIsEditing
  };
}

