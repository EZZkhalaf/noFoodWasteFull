import React, { createContext, useContext, useReducer } from 'react';

// Initial state for authentication
const initialState = {
  user: (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  })(),
};


// Reducer function to handle actions
const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      localStorage.setItem('user' , JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'logout':
      localStorage.removeItem('user');
      return { ...state, user: null };
    case 'SET_USER':
      localStorage.setItem('user' , JSON.stringify(action.payload)); //update the info of the user without logging in again 
      return { ...state,  user: action.payload};
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext();  // Ensure it's exported

// Custom hook to use the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};

// just returns the updated user JSON
export const fetchUserData = async (userId) => {
  const res = await fetch(`http://localhost:3000/user/${userId}`);
  if (!res.ok) throw new Error('Fetch user failed');
  return res.json();
};


// AuthProvider component to wrap the app with context
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};



// import React, { createContext, useContext, useReducer } from 'react';

// // Initial state for authentication
// const initialState = {
//   user: (() => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         return JSON.parse(storedUser);
//       }else return null;
//     } catch (error) {
//       console.error("Error parsing user from localStorage", error);
//       return null;  // Return null if error occurs during parsing
//     }
//   })(),
// };


// // Reducer function to handle actions
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'login':
//       localStorage.setItem('user', JSON.stringify(action.payload));
//       return { ...state, user: action.payload };
//     case 'logout':
//       localStorage.removeItem('user');
//       return { ...state, user: null };
//     case 'SET_USER':
//       localStorage.setItem('user', JSON.stringify(action.payload)); // Update user info
//       return { ...state, user: action.payload };
//     default:
//       return state;
//   }
// };

// // Create context
// export const AuthContext = createContext();  // Ensure it's exported

// // Custom hook to use the AuthContext
// export const useAuthContext = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }

//   return context;
// };

// // AuthProvider component to wrap the app with context
// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   return (
//     <AuthContext.Provider value={{ user: state.user, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
