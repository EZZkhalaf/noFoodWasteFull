// import React, { useEffect, useState } from 'react';
// import googleLogo from '../assets/googleLogo.jpeg';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../hooks/useAuthContext'; // Use AuthContext

// const Login = () => {
//   const [signinEmail, setEmail] = useState('');
//   const [Password, setPass] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { user, dispatch } = useAuthContext(); // Get user and dispatch from context

//   useEffect(() => {
//     // Check if a user is already logged in from localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         // If user exists in localStorage, update the context
//         dispatch({ type: 'login', payload: JSON.parse(storedUser) });
//         navigate('/'); // Redirect to home page
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//       }
//     }
//   }, [dispatch, navigate]);

//   const setEmailFunction = (event) => {
//     setEmail(event.target.value);
//   };

//   const setPasswordFunction = (event) => {
//     setPass(event.target.value);
//   };

//   const SignIn = async (event) => {
//     event.preventDefault();
//     setLoading(true); // Start loading state
//     try {
//       const response = await fetch('http://localhost:3000/user/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: signinEmail,
//           password: Password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success('Login successful!', { autoClose: 1500 });
        
       

//         // Save token and user to localStorage
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));

//         // Dispatch the login action to update context
//         dispatch({ type: 'login', payload: data.user });

//         setTimeout(() => navigate('/'), 1000);
//       } else {
//         toast.error(data.message || 'Invalid inputs');
//       }
//     } catch (err) {
//       toast.error('Something went wrong. Please try again.');
//       console.log(err);
//     } finally {
//       setLoading(false); // Stop loading state
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="relative flex flex-col p-8 m-6 space-y-6 bg-white shadow-2xl rounded-2xl w-96">
//         <span className="mb-3 text-4xl font-bold">Welcome...</span>
//         <span className="font-light text-gray-500">Please enter your email and password</span>

//         <div className="w-full">
//           <label className="mb-2 text-md font-medium">Email</label>
//           <input
//             onChange={setEmailFunction}
//             type="email"
//             name="email"
//             className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
//             placeholder="Enter your email"
//           />
//         </div>

//         <div className="w-full">
//           <label className="mb-2 text-md font-medium">Password</label>
//           <input
//             onChange={setPasswordFunction}
//             type="password"
//             name="password"
//             className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
//             placeholder="Enter your password"
//           />
//         </div>

//         <div className="w-full text-right">
//           <span className="text-sm font-semibold text-gray-600 cursor-pointer hover:text-black">
//             Forgot password?
//           </span>
//         </div>

//         <button
//           onClick={SignIn}
//           className={`w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-white hover:text-black border border-black transition ${loading && 'opacity-50 cursor-not-allowed'}`}
//           disabled={loading}
//         >
//           {loading ? 'Signing in...' : 'Sign in'}
//         </button>

//         <button className="w-full border border-gray-400 p-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-black hover:text-white transition">
//           <img src={googleLogo} alt="Google Logo" className="w-fit h-5" />
//           Sign in with Google
//         </button>

//         <div className="text-center text-gray-400">
//           Don't have an account?
//           <span
//             onClick={() => navigate('/register')} 
//             className="font-bold text-black ml-1 cursor-pointer">
//             Sign up for free
//           </span>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;





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
    if (event) {
      event.preventDefault();
    }
    setLoading(true); // Start loading state
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signinEmail,
          password: Password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!', { autoClose: 1500 });
        
        // Save token and user to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Dispatch the login action to update context
        dispatch({ type: 'login', payload: data.user });

        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error(data.message || 'Invalid inputs');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.log(err);
    } finally {
      setLoading(false); // Stop loading state
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

      <ToastContainer />
    </div>
  );
};

export default Login;