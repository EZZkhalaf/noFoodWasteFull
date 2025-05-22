import React ,{useState , useEffect}from 'react'
import RecipeElement from './RecipeElement';

import { useAuthContext } from '../Context/AuthContext';
import { ThreeDot } from 'react-loading-indicators';
import RecipeElementFeed from './RecipeElementFeed';
import defaultPhoto from '../assets/defaultPhoto.png'

const UserHomeFeed = () => {
 const { user } = useAuthContext(); // Import your auth context
const [feedRecipes, setFeedRecipes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
// console.log(user)
useEffect(() => {
    if (!user?._id) return;

    const fetchFeed = async () => {
        setLoading(true);
        setError(null);

        // Get token either from localStorage or from context
        const token = localStorage.getItem('token') || user.token;
        try {
            const res = await fetch('http://localhost:3000/user/getUserFeed', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            });
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();

            
            // console.log(data)
            setFeedRecipes(data);
        } catch (err) {
            console.error('Failed to fetch feed:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  

  
    fetchFeed();
  
}, [user]);

if (loading) {
  return <div className="flex items-center justify-center p-6">
    <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
  </div>;
}
if (error) {
  return <div className="text-red-500 text-center p-4">
    Error loading feed: {error}
  </div>;
}
if (feedRecipes.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600">
      
      <h2 className="text-xl font-semibold">No recipes found</h2>
      <p className="mt-2 text-sm">
        Try following some friends to see their delicious recipes here!
      </p>
    </div>
  );
}



return (
  <div className="mt-8">
      <div className="flex justify-center">
        <div className="w-[30vw] border-t-2 border-sand-200"></div>
      </div>
    <h2 className="font-serif text-2xl font-medium mb-7 text-center mt-7">Your latest  Feed</h2>
    <div className="flex flex-col space-y-6 px-4">
      {feedRecipes.map(recipe => (

        // RecipeId, recipe_image, recipe_name, recipe_description, recipeType, cookingTime, difficulty
        <RecipeElementFeed 
          key={recipe._id}
          RecipeId={recipe._id}
          recipe_name={recipe.recipe_title}
          recipeType={recipe.type}
          recipe_description={recipe.recipe_description}
          cookingTime={recipe.cookingTime}
          recipe_image={recipe.recipe_image}
          difficulty = {recipe.difficulty}
          recipe_user={ recipe.recipe_user}
          bookmarks = {recipe.Bookmarks.length}
        />
      ))}
    </div>
  </div>
);
}

export default UserHomeFeed