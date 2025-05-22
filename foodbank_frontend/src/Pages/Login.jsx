

import React, { useEffect, useState } from 'react';
import googleLogo from '../assets/googleLogo.jpeg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'; // Use AuthContext
import { ThreeDot } from 'react-loading-indicators';

const Login = () => {
  const [signinEmail, setEmail] = useState('');
  const [Password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext(); // Get user and dispatch from context



  useEffect(() => {
    // Check if a user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // If user exists in localStorage, update the context
        dispatch({ type: 'login', payload: JSON.parse(storedUser) });
        navigate('/'); // Redirect to home page
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [dispatch, navigate]);

  const setEmailFunction = (event) => {
    setEmail(event.target.value);
  };

  const setPasswordFunction = (event) => {
    setPass(event.target.value);
  };






const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('https://nofoodwastefull.onrender.com/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signinEmail,
        password: Password,
      }),
    });

    const data = await response.json();
    console.log('Response from login:', data);

    if (response.ok) {
      toast.success(('Login successful!'));
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'login', payload: data.user });
      setTimeout(() => navigate('/'), 1000);
    } else {
      toast.error((data.message || 'Invalid inputs'));
    }
  } catch (err) {
    toast.error(('Something went wrong. Please try again.'));
    console.error(err);
  } finally {
    setLoading(false);
  }
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
    <>
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative flex flex-col p-8 m-6 space-y-6 bg-white shadow-2xl rounded-2xl w-96">
        <span className="mb-3 text-4xl font-bold">Welcome...</span>
        <span className="font-light text-gray-500">Please enter your email and password</span>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="mb-2 text-md font-medium">Email</label>
            <input
              onChange={setEmailFunction}
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-2 text-md font-medium">Password</label>
            <input
              onChange={setPasswordFunction}
              type="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="w-full text-right">
            {/* <span className="text-sm font-semibold text-gray-600 cursor-pointer hover:text-black">
              Forgot password?
            </span> */}
          </div>

          <button
            type="submit"
            className={`w-full bg-black mt-6 text-white p-3 rounded-lg font-semibold hover:bg-white hover:text-black border border-black transition ${loading && 'opacity-50 cursor-not-allowed'}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>



        <div className="text-center text-gray-400">
          Don't have an account?
          <span
            onClick={() => navigate('/register')} 
            className="font-bold text-black ml-1 cursor-pointer">
            Sign up for free
          </span>
        </div>
      </div>

    </div>
    </>
  );
};

export default Login;