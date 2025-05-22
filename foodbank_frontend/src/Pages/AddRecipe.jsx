
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { CircleLoader } from 'react-spinners';

import { ThreeDot } from 'react-loading-indicators';

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    recipe_title: '',
    recipe_description: '',
    instructions: '',
    type: '',
    ingredients: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
  const [isImproving , setIsImproving] = useState(false)
  const [ingredientQuery, setIngredientQuery] = useState('');
    const [newInstruction, setNewInstruction] = useState('');
  
  const { user } = useAuthContext();
  const userId = user?._id;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [name]: value,
    };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
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
          ingredient_name: query,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggested ingredients');
      const data = await response.json();
      const filteredIngredients = data.filter((ing) => {
        return !formData.ingredients.some((item) => item.name === ing.ingredient_name);
      });

      setSuggestedIngredients(filteredIngredients);
    } catch (error) {
      console.error('Error fetching suggested ingredients:', error);
      setSuggestedIngredients([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestedIngredients(ingredientQuery);
      console.log(formData.ingredients)
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [ingredientQuery]);

  const addSuggestedIngredient = (ingredient) => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: ingredient.ingredient_name, quantity: ''  , unit: ingredient.unit},
      ],
    });
    setIngredientQuery('');
    setSuggestedIngredients([]);
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (
        !formData.recipe_title ||
        !formData.instructions ||
        !formData.ingredients.length ||
        !userId ||
        !formData.type
      ) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      const invalidIngredients = formData.ingredients.some(
        (ing) => !ing.name.trim() || !ing.quantity.trim()
      );
      if (invalidIngredients) {
        setError('All ingredients must have name and quantity');
        setLoading(false);
        return;
      }

      let imageData = '';
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imageData = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
        await new Promise((resolve) => (reader.onloadend = resolve));
      } else {
        imageData = formData.recipe_image;
      }

      const response = await fetch('http://localhost:3000/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          ...formData,
          recipe_image: imageData,
          recipe_user: userId,
        }]),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          recipe_title: '',
          recipe_description: '',
          instructions: '',
          type: '',
          ingredients: [],
        });
        setSelectedFile(null);
        setPreviewImage(null);
        navigate(`/userprofile/${userId}`);
      } else {
        setError(data.message || 'Error adding recipe');
      }
    } catch (err) {
      setError('Error adding recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };



    //using the deepseek API
  const improveInstructions = async()=>{
    setIsImproving(true);
    const instructionsMessage = formData.instructions ;
    const message =  instructionsMessage + 'for the recipe : ' + formData.recipe_title;
      try {
        const response = await fetch('http://localhost:3000/apiDeepseek/improveInstructions' , {
          method:'post' ,
          headers:{'Content-Type' : 'application/json'},
          body : JSON.stringify({message : message})
        });
        

        const data = await response.json();
            setFormData((prev) => ({
      ...prev,
      instructions: data,  // or data.improvedText if your API returns an object
    }));
      } catch (error) {
          console.log(error)
      }finally{
        setIsImproving(false);
      }
  }



  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
        <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
      </div>
    </div>
  );
  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden ring-2 ring-purple-200 ring-offset-2 p-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-purple-300 pb-2">
              Add New Recipe
            </h2>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
                Recipe added successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title:
                  </label>
                  <input
                    type="text"
                    name="recipe_title"
                    value={formData.recipe_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Type:
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Soup">Soup</option>
                    <option value="Salad">Salad</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Snack">Snack</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description:
                  </label>

                  <textarea
                    name="recipe_description"
                    value={formData.recipe_description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none h-32"
                  />
                </div>

                <div>
<div className="flex flex-col md:flex-row md:items-center justify-between">
  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-0">
    Instructions:
  </label>
  <button
    type="button"
    onClick={improveInstructions}
    className="
      flex items-center 
      text-xs sm:text-sm 
      px-2 sm:px-3 
      py-1 sm:py-1.5 
      bg-gradient-to-r from-purple-500 to-blue-600 
      text-white rounded-full 
      hover:from-purple-600 hover:to-blue-700 
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400
      transition 
    "
  >
    {isImproving
      ? (
        <div className="flex items-center gap-1">
          <CircleLoader color="#fff" size={14} />
          <span>Improving…</span>
        </div>
      )
      : 'AI Improve ✨'
    }
  </button>
</div>


                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none h-32"
                    required
                  />
                </div>




              </div>

              <div className="mt-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Ingredients
                </h3>

                <div className="relative">
                  <input
                    type="text"
                    value={ingredientQuery}
                    onChange={(e) => setIngredientQuery(e.target.value)}
                    placeholder="Search for ingredients..."
                    className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-4"
                  />

                  {suggestedIngredients.length > 0 && (
                    <div className="absolute w-full z-10 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {suggestedIngredients.map((ing) => (
                        <div
                          key={ing.ingredient_name}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => addSuggestedIngredient(ing)}
                        >
                          {ing.ingredient_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formData.ingredients.map((ingredient, index) => (
               <div
               key={index}
               className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-5 bg-white rounded-2xl shadow-md border border-gray-200 mb-4"
             >
               <span className="min-w-[120px] px-4 py-2 text-center rounded-full bg-violet-100 text-violet-700 text-sm font-semibold shadow-sm">
                 {ingredient.name}
               </span>
             
               <input
                 type="text"
                 name="quantity"
                 value={ingredient.quantity}
                 onChange={(e) => handleIngredientChange(index, e)}
                 placeholder="Quantity"
                 className="flex-1 min-w-[100px] px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                 required
               />
             
               <span className="min-w-[80px] px-4 py-2 text-center rounded-full bg-violet-100 text-violet-700 text-sm font-semibold shadow-sm">
                 {ingredient.unit || 'Unit'}
               </span>
             
               {formData.ingredients.length > 0 && (
                 <button
                   type="button"
                   onClick={() => removeIngredient(index)}
                   className="mt-2 md:mt-0 text-sm text-red-500 hover:text-white hover:bg-red-500 border border-red-400 px-4 py-2 rounded-lg transition-colors duration-200"
                 >
                   Remove
                 </button>
               )}
             </div>
             
              
                ))}

                {/* <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-md hover:from-purple-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
                >
                  Add Ingredient
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="recipe_image"
                      value={formData.recipe_image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Or enter image URL"
                      style={{ flex: 3 }} 
                    />
                    <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-md">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {previewImage && (
                <div
                  className="mt-4 cursor-pointer"
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                >
                  {isImageExpanded ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-[80vh] max-w-[80vw] object-cover rounded-xl shadow-lg mx-auto block"
                    />
                  ) : (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-64 h-48 object-cover rounded-xl shadow-md"
                    />
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 mt-6 rounded-full ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Recipe'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddRecipe;