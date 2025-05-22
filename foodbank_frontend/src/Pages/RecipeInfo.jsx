import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import defaultRecipeImage from '../assets/defaultRecipeImage.jpg';
import { Clock } from 'lucide-react';
import { HiMiniPencilSquare } from "react-icons/hi2";
import BookmarkButton from "../Components/BookMarkButton";
import Footer from "../Components/Footer";
import { useAuthContext } from "../Context/AuthContext";
import { RiCloseLargeLine } from "react-icons/ri";
import { CircleLoader } from 'react-spinners';
import { ImproveAction } from "@cloudinary/url-gen/actions/adjust/ImproveAction";
import { ThreeDot } from "react-loading-indicators";
import { CiBookmarkPlus } from "react-icons/ci";
import { IoMdBookmark } from "react-icons/io";
import defaultPhoto from '../assets/defaultPhoto.png';

const RecipeInfo = () => {
  const { RecipeId } = useParams();
  const { user } = useAuthContext();

  const [recipe, setRecipe] = useState(null);
  const [recipeUser, setRecipeUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for edited values
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [newIngredients, setNewIngredients] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [newRecipeDescription, setNewRecipeDescription] = useState('');
  const [newCookingTime, setNewCookingTime] = useState(20);
  const navigate =  useNavigate();

  // New state for ingredient search
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
  const fileInputRef = useRef(null);

  const [isImproving , setIsImproving ] = useState(false)
// 
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
      console.log(data)
      setIsBookmarked(data === 'saved');
    };
    checkBookmark();
  }, []);

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

  // Check if user is the recipe owner
  const [recipeOwner] = recipe?.recipe_user || [];
  const isRecipeOwner = user && recipe && user._id === recipeOwner;

  const [newRecipeImage, setNewRecipeImage] = useState(defaultRecipeImage);
  
  
  // Save edited recipe
  const saveEditedRecipe = async () => {
    try {
 
      let formData = new FormData();
      formData.append('newRecipe_title', newRecipeTitle);
      
      formData.append('newIngredients', newIngredients.length > 0 
                ? JSON.stringify(newIngredients)
                 : JSON.stringify(recipe.ingredients || []));

      formData.append('newInstructions', newInstruction);
      formData.append('newRecipe_description', newRecipeDescription);
      formData.append('newCookingTime', newCookingTime);
      formData.append('newRecipe_image', newRecipeImage); // File object


      const response = await fetch(`http://localhost:3000/recipe/${RecipeId}`, {method: 'post', body: formData});

      // if (!response.ok) throw new Error('Failed to update recipe');
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
    // Reset to original values
    if (recipe) {
      setNewRecipeTitle(recipe.recipe_title || '');
      setNewIngredients(recipe.ingredients || []);
      setNewInstruction(recipe.instructions || '');
      setNewRecipeDescription(recipe.recipe_description || '');
      setNewCookingTime(recipe.cookingTime || 20);
    }
  };

  const handleRecipeImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If Base64 is needed
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewRecipeImage(reader.result);
    };
    reader.readAsDataURL(file);

    // If a file object is needed
    setNewRecipeImage(file);
  };

  // Delete recipe
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:3000/recipe/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeid: RecipeId,
        })
      });

      if (response.ok) {
        // Redirect to home page or another appropriate page
        window.location.href = `/`;
      } else {
        const data = await response.json();
        console.error("Error deleting recipe:", data.message);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteRecipe = async() =>{
    try {
      const response = await fetch(`http://localhost:3000/recipe/${RecipeId}` ,{
        method:"delete",
        headers:{'Content-Type' : "application/json"},
        body:JSON.stringify({
          userId : user._id,
        })
      });

      if(!response.ok) console.log("error in response ")
      const data = await response.json();
      if(data.success) navigate(`/userprofile/${user._id}`)
    } catch (error) {
      console.log(error)
    }
  }



  const addIngredient = (ingredient) => {

    const isAlreadyAdded = newIngredients.some(item => item.name === ingredient.ingredient_name) 
                                || recipe.ingredients?.some(item => item.name === ingredient.ingredient_name);
    if (!isAlreadyAdded) {
      const newIngredient = {
        name: ingredient.ingredient_name,
        quantity: '0',
        unit: ingredient.unit || ''
      };
  
      setNewIngredients([...newIngredients, newIngredient]);
  
      // Remove the added ingredient from suggested ingredients
      setSuggestedIngredients(suggestedIngredients.filter(
        (suggested) => suggested.ingredient_name !== ingredient.ingredient_name
      ));
    } else {
      console.log('Ingredient already exists in the recipe or has been added.');
    }
  }


  const removeIngredient = (index) => {
    const updatedIngredients = newIngredients.filter((_, i) => i !== index);
    setNewIngredients(updatedIngredients);
  };

  const fetchSuggestedIngredients = async (query) => {
    if (!query.trim()) {
      setSuggestedIngredients([]);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/ingredients/searchIngredient`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredient_name: query
        })
      });
  
      if (!response.ok) throw new Error('Failed to fetch suggested ingredients');
      const data = await response.json();

      const filteredIngredients = data.filter(ing =>{  
          return !newIngredients.some(item => item.name === ing.ingredient_name) 
                && !recipe.ingredients.some(item => item.name === ing.ingredient_name) 
        })

      setSuggestedIngredients(filteredIngredients);
    } catch (error) {
      console.error('Error fetching suggested ingredients:', error);
      setSuggestedIngredients([]);
    }
  };

  // 300ms delay for debounce for fetching the suggested ingredients 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestedIngredients(searchQuery);
    }, 300); 
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  //using the deepseek API
  const improveInstructions = async()=>{
    setIsImproving(true);
    const instructionsMessage = newInstruction || recipe.instructions;
    const message =  instructionsMessage + 'for the recipe : ' + recipe.recipe_title;
      try {
        const response = await fetch('http://localhost:3000/apiDeepseek/improveInstructions' , {
          method:'post' ,
          headers:{'Content-Type' : 'application/json'},
          body : JSON.stringify({message : message})
        });
        

        const data = await response.json();
        console.log(data)
        setNewInstruction(data);
      } catch (error) {
          console.log(error)
      }finally{
        setIsImproving(false);
      }
  }



  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    try {
      const response = await fetch('http://localhost:3000/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserid: user._id, RecipeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setIsBookmarked(true);
    } catch (error) {
      console.error("Error saving bookmark:", error);
      setError(error.message);
    } 
  };

  const handleUnBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    try {
      const response = await fetch('http://localhost:3000/user/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserid: user._id, RecipeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setIsBookmarked(false);
    } catch (error) {
      console.error("Error unsaving bookmark:", error);
      setError(error.message);
    } 
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      </div>
    </div>
  );
  
  if (!recipe) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 rounded-lg shadow-lg bg-white max-w-md w-full">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto text-blue-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Recipe not found
          </h2>
          <p className="text-gray-600 mb-4">
            The recipe you are looking for does not exist or has been deleted.
          </p>
          <button 
            onClick={navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
            
            Go back home
          </button>
        </div>
      </div>
    </div>
  );



  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
    <NavBar className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-50" />
    
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-12">
        <div className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden ring-1 sm:ring-2 ring-purple-200">
          {/* Recipe Header */}
          <div className="relative">
            {isEditing ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRecipeImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <img
                  src={ recipe.recipe_image || defaultRecipeImage }
                  alt={recipe.recipe_title || "Default Recipe Image"}
                  className="w-full h-48 xs:h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-md"
                  onClick={() => fileInputRef.current.click()}
                />
              </div>
            ) : (
              <img
                src={recipe.recipe_image || defaultRecipeImage}
                alt={recipe.recipe_title || "Default Recipe Image"}
                className="w-full h-48 xs:h-64 sm:h-80 md:h-96 object-cover"
                onError={(e) => {
                  e.target.src = defaultRecipeImage;
                  e.target.alt = "Default Recipe Image";
                }}
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-md">
                {isEditing ? (
                  <input
                    type="text"
                    value={newRecipeTitle}
                    onChange={(e) => setNewRecipeTitle(e.target.value)}
                    className="w-[20vw] bg-transparent text-xl sm:text-2xl md:text-4xl font-bold z-10 text-white outline-none w-full"
                    placeholder="Enter the name  "
                  />
                ) : (
                  recipe.recipe_title
                )}
              </h1>
              
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                {/* Buttons responsive adjustments */}
                {isRecipeOwner && !isEditing ? (
                  <div className="flex ">
                      <button
                        className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all hover:scale-105 hover:shadow-xl transform-gpu duration-300"
                        onClick={() => setIsEditing(true)}
                      >
                        <HiMiniPencilSquare className="mr-1 sm:mr-2 w-4 h-4" />
                        Edit Recipe
                      </button>
                      
                  </div>
                ) : isRecipeOwner && isEditing ? (
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-xl transform-gpu duration-300"
                      onClick={saveEditedRecipe}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 hover:shadow-lg transform-gpu duration-300"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transform-gpu duration-300"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Choose Image
                    </button>
                  </div>
                ) : (



                  <button
                    onClick={isBookmarked ? handleUnBookmark : handleBookmark}
                    className="
                      flex items-center gap-2 bg-white bg-opacity-80 px-4 py-2 rounded-full 
                      transition transform duration-300 ease-out 
                      hover:scale-110 hover:bg-opacity-100 
                      shadow-sm hover:shadow-md
                    "
                  >
                    {isBookmarked ? (
                      <>
                        <IoMdBookmark className="text-blue-600 text-xl" />
                        <span className="text-blue-600 font-medium">Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <CiBookmarkPlus className="text-gray-600 text-xl" />
                        <span className="text-gray-600 font-medium">Bookmark</span>
                      </>
                    )}
                  </button>

                )}
                
                <span className="text-white bg-gray-800/90 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {recipe.Bookmarks?.length || 0} bookmarks
                </span>
              {isRecipeOwner && !isEditing ? (
                <button 
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-red-500
                   text-white rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl transform-gpu 
                   duration-300"
                  onClick={deleteRecipe}
                   >
                      delete
                </button>
              ):(<div></div>)}
              </div>
            </div>
          </div>
  
          {/* Recipe Details Grid */}
          <div className="p-4 sm:p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Left Column */}
            <div>
              {/* Created By Section Responsive Adjustments */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-6">
                <Link
                  to={`/userPage/${recipe.recipe_user}`}
                  className="flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-6"
                >
                  <div className="relative -mt-12 xs:-mt-0">
                    <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl rotate-45 overflow-hidden border-4 border-white shadow-lg">
<img
  src={
    recipeUser.profilePic?.startsWith('data:image/')
      ? recipeUser.profilePic
      : defaultPhoto
  }
  alt="User avatar"
  className="w-full h-full object-cover -rotate-45 scale-125"
/>

                    </div>
   
                  </div>
  
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {recipeUser?.username || "Unknown Chef"}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-emerald-600">
                        Recipe Creator • {recipeUser?.experience || "Professional Chef"}
                      </p>
                    </div>
                    
                    <div className="inline-flex items-center bg-white rounded-full py-1 px-3 sm:py-1.5 sm:px-4 shadow-sm border border-gray-200">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <time 
                        dateTime={recipe.createdAt} 
                        className="text-xs sm:text-sm font-medium text-gray-600"
                      >
                        {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </div>
  
              {/* Cooking Time */}
              <div className="relative group bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-101 hover:ring-2 hover:ring-white/20">
                <div className="flex items-center space-x-4">
                  {/* Animated Clock Icon */}
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Clock 
                      className="w-8 h-8 text-white animate-pulse-slow"
                      strokeWidth={2.5}
                    />
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
                            className="w-20 px-2 py-1 bg-white/20 text-3xl font-bold text-white rounded-lg
                                      border-2 border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20
                                      outline-none transition-all duration-200 backdrop-blur-sm
                                      hover:bg-white/30 placeholder:text-white/50"
                            min="1"
                            max="999"
                            placeholder="Time"
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





              
            </div>
  
            {/* Right Column */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
              {/* Ingredients Section Responsive Adjustments */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Ingredients</h3>
                
                {isEditing ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ingredients..."
                        className="w-full p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-sm sm:text-base"
                      />
                    </div>
  
                    {/* Suggested Ingredients Scroll Container */}
                    {suggestedIngredients.length > 0 ? (
                      <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto bg-white rounded-lg sm:rounded-xl border border-gray-200">
                        {suggestedIngredients.map((ingredient) => (
                          <div
                            key={ingredient._id}
                            className="p-3 sm:p-4 bg-gray-300 border border-amber-50 hover:bg-gray-400 cursor-pointer text-sm sm:text-base flex justify-around "
                            onClick={() => addIngredient(ingredient)}
                          >
                            <div className="font-medium">{ingredient.ingredient_name}</div>
                            <div className="font-medium ">{ingredient.unit}</div>
                            
                            {/* <div className="text-gray-500 text-xs sm:text-sm">
                              {ingredient.description || 'No description'}
                            </div> */}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-gray-500 text-sm sm:text-base">
                        No ingredients found.
                      </div>
                    )}
  
                    {/* Added Ingredients List */}
                   {newIngredients.length > 0 ? (
                      <div className="mt-3 sm:mt-4">
                        <h4 className="text-base font-semibold mb-2">Added Ingredients</h4>
                        <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto space-y-2">
                          {newIngredients.map((ingredient , index) => (
                            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                              <div className="flex justify-between items-center w-full gap-4">
                                    {/* Ingredient name on the left */}
                                    <h3 className=" font-medium text-gray-800 text-sm sm:text-base flex-1 truncate">
                                      {ingredient.name }
                                    </h3>
                                    
                                    {/* Quantity and unit on the right */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={ingredient.quantity || ''}
                                  onChange={(e) => {
                                    const updatedIngredients = [...newIngredients];
                                    updatedIngredients[index].quantity = e.target.value;
                                    setNewIngredients(updatedIngredients);
                                  }}
                                  className="w-16 px-2 py-1 bg-white rounded border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right text-sm"
                                  placeholder="Qty"
                                />










                                {ingredient.unit && (
                                  <span className="text-gray-500 text-sm w-12 text-right">
                                    {ingredient.unit}
                                  </span>
                                )}
                              </div>

                                </div>
                              <button
                                onClick={() => removeIngredient(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <RiCloseLargeLine className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm text-gray-500 text-sm sm:text-base">
                        No ingredients added yet.
                      </div>
                    )}
                  </div>
                ) : (
                    <ul className="max-h-[250px] sm:max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 space-y-2">
                      {recipe.ingredients?.map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 sm:p-3 bg-white rounded-lg shadow-sm text-sm sm:text-base"
                        >
                          {/* Ingredient name (left) */}
                          <span className="font-medium text-gray-800 flex-1 pr-2">
                            {ingredient.name}
                          </span>

                          {/* Quantity and unit (middle-right) */}
                          <div className="flex items-center gap-1 text-gray-500 mr-4">
                            <span>{ingredient.quantity}</span>
                            <span>{ingredient.unit}</span>
                          </div>


                        </li>
                      ))}
                    </ul>
                )}
              </div>
            </div>
          </div>

  
          {/* Instructions Section Responsive Adjustments */}
          <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl ring-1 sm:ring-2 ring-purple-200 mt-6 sm:mt-8 md:mt-10">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold border-b-2 border-purple-300 pb-2">
                  Step-by-Step Instructions
                </h2>
                {isEditing ? (
                  <button 
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-xl transform-gpu duration-300"
                      onClick={improveInstructions}
                    >
                      {isImproving ? (
                        <div className="flex items-center gap-2">
                          <CircleLoader color="#ffffff" size={16} /> {/* Loading spinner */}
                          <span>Improving...</span>
                        </div>
                      ):(
                       'Improve with AI ✨'
                      )}
                    </button>
                ):(
                  <div></div>
                )
              }
                
              </div>

              {isEditing ? (
                <textarea
                  value={newInstruction || recipe.instructions}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  className="w-full p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm resize-none h-48 sm:h-64 text-sm sm:text-base"
                  placeholder="Enter step-by-step instructions. Separate steps with '/ ' (e.g., Step 1/ Step 2/ Step 3)"
                />
              ) : (
                <ol className="space-y-3 sm:space-y-4">
                  {recipe.instructions?.split(". ").map((step, index) =>
                    step ? (
                      <li key={index} className="relative pl-5 sm:pl-6 py-2 sm:py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <span className="absolute left-1.5 sm:left-2 top-3.5 sm:top-4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        <p className="text-gray-700 text-sm sm:text-base pl-3 sm:pl-4">{step.trim()}</p>
                      </li>
                    ) : null
                  )}
                </ol>
              )}
            </div>
        </div>
      </div>
  

    </main>
  
    <Footer className="bg-white/90 backdrop-blur-md shadow-inner" />
  </div>
  );
};

export default RecipeInfo;
