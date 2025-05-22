
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import defaultPhoto from "../assets/defaultPhoto.png";
import profileRecipeElement from "../Components/profileRecipeElement";
import { useAuthContext } from "../Context/AuthContext";
import RecipeElement from "../Components/RecipeElement";
import { ThreeDot } from 'react-loading-indicators';


const UserPage = () => {
  const { user } = useAuthContext();
  const { user2_id } = useParams();
  const [userPageOwner, setUserPageOwner] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [follower , setFollower] = useState(false);
  const userProfilePic =
    userPageOwner?.profilePic && userPageOwner.profilePic !== "/assets/defaultPhoto.png"
      ? userPageOwner.profilePic
      : defaultPhoto;

    const navigate = useNavigate();

  //checking for the follow or not followed for both users 
  useEffect(()=>{
    if(!user || !user._id) return ;
    const checkFollowStatus = async() =>{
        const response = await fetch("http://localhost:3000/user/checkFollowStatus", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentuserid: user._id, otheruserid: user2_id }),
        });
        if(!response.ok) throw new Error('failed to fetch from the backnd in (check follow status )')
        
          const data = await response.json();
          setFollower(data.isFollowing);
    }
    checkFollowStatus();
  },[user,user2_id]);

  // Fetch user data
  useEffect(() => {
    if (!user2_id) return;
    
    if(user._id === user2_id){
      navigate(`/userprofile/${user._id}`)
    }
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/user/getUserById", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user2_id }),
        });

        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const profileUser = await res.json();
        setUserPageOwner(profileUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchUserData();
    const interval = setInterval(fetchUserData, 100000);
    return () => clearInterval(interval);
  }, [user2_id]);

  const  handleToggleFollowButton = async() =>{
    try {
      const response = await fetch('http://localhost:3000/user/toggleFollow' ,{
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentuserid: user._id,
          followinguserid : user2_id
         })
      })
      const data = await response.json();
      console.log(data.isFollowing)
      setFollower(data.isFollowing);
    } catch (error) {
      console.log('error in adding the user' , error)
    }
  }
  // Fetch user recipes
  useEffect(() => {
    if (!userPageOwner?._id) return; // Ensure userPageOwner._id is available

    const fetchUserRecipes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/recipe/getUserRecipes/${userPageOwner._id}`

        );
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        // console.log("User recipes:", data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [userPageOwner?._id]); // Add userPageOwner._id as a dependency

    if (loading)     
      return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
          <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      </div>
    );
 
    

    if (!userPageOwner) {
      return (
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
                User not found
              </h2>
              <p className="text-gray-600 mb-4">
                The user you are looking for does not exist or has been deleted.
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
    }

  return (
    <div className="w-full mx-5 xl:mx-auto max-w-6xl p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* User Profile Section */}
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={userProfilePic}
            alt={`${userPageOwner.username}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex items-center justify-between w-full text-center md:text-lef">
            <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {userPageOwner.username || "Guest"}
            </h1>
            <p className="text-gray-600 mt-2">
              {userPageOwner.bio || "No bio available"}
            </p>


              </div>
            
              <button
                onClick={handleToggleFollowButton}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold 
                rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2
                focus:ring-blue-400 focus:ring-opacity-75"
                >
                {follower ? "Unfollow" : "Follow"}
                
              </button>
              </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-800">
              {userPageOwner.followers?.length || 0}
            </p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-800">
              {userPageOwner.following?.length || 0}
            </p>
            <p className="text-gray-600">Following</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-800">
              {userPageOwner.ownRecipes?.length || 0}
            </p>
            <p className="text-gray-600">Recipes</p>
          </div>
        </div>

        {/* Recipes Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipes</h2>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">last Recipes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeElement
                    key={recipe._id}
                    RecipeId={recipe._id}
                    recipe_image={recipe.recipe_image}
                    recipe_name={recipe.recipe_title}
                    cookingTime = {recipe.cookingTime}
                    difficulty={recipe.difficullty}
                  />
                ))
              ) : (
                <p className="text-gray-600">No recipes created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;


