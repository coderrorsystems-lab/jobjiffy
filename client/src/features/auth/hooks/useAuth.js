import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default if context not available
    return {
      user: null,
      login: () => {},
      logout: () => {},
      updateUser: () => {},
      isLoading: false,
    };
  }
  return context;
}
