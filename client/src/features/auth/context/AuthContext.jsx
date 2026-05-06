/**
 * Auth Context
 * Context for managing authentication state across the app
 */

import React, { createContext, useState, useEffect } from 'react';
import { clearAuthData } from '@/utils/authUtils';

export const AuthContext = createContext(null);

/**
 * Auth Provider - wrap your app with this
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('user');

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        setUserRole(role || 'user');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, accessToken, refreshToken, role = 'user') => {
    setUser(userData);
    setUserRole(role);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('jobjiffy_is_authenticated', 'true');
  };

  const logout = () => {
    setUser(null);
    setUserRole('user');
    clearAuthData();
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    user,
    userRole,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
