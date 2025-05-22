import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext'; // Correct the import to point to AuthContext

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
