import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import NavBar from './Components/NavBar';
import RecipeInfo from './Pages/RecipeInfo';
import UserProfile from './Pages/UserProfile';
import { Component, useContext, useEffect, useState } from 'react';
import Register from './Pages/Register';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './Context/AuthContext';
import SavedRecipes from './Pages/SavedRecipes';
import FindRecipes from './Pages/FindRecipes';
import UserPage from './Pages/UserPage';
import AddRecipe from './Pages/AddRecipe';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  const loadUser = (data) => {
    console.log('Loaded user data:', data);  // Log full user data
    console.log('Profile Pic:', data.user.profilePic);  // Check if profilePic is being passed correctly
  
    dispatch({
      type: 'SET_USER',
      payload: {
        id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        friends: data.user.friends,
        followers: data.user.followers,
        following: data.user.following,
        ownRecipes: data.user.ownRecipes,
        savedRecipes: data.user.savedRecipes,
        profilePic: data.profilePic,
        bio: data.user.bio,
      }
    });
  };
  
  

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (!user) {
        loadUser(parsedUser);
        // Delay navigation to ensure the user context is updated
        setTimeout(() => {
          navigate('/');
        }, 500);
      }
    }
  }, [user, dispatch, navigate]);
  


 

  return (
    <div className='px-4 sm:px-[5vw]  w-full  '>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login loadUser={loadUser} />} />
        <Route path='/register' element={<Register loadUser={loadUser} />} />
        <Route path='/recipe/:RecipeId' element={<RecipeInfo />} />
        <Route path='/userprofile/:userId' element={<UserProfile />} />
        <Route path='/savedRecipes' element={<SavedRecipes />} />
        <Route path='/findRecipes' element={<FindRecipes />} />
        <Route path='/userPage/:user2_id' element={<UserPage  />}/>
        <Route path='/addRecipe' element={<AddRecipe />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;






