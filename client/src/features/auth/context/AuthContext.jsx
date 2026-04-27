/**
 * Auth Context
 * Context for managing authentication state across the app
 */

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

// Demo user for testing
const DEMO_USER = {
  id: '1',
  fullName: 'Jatin Kumar',
  email: 'jatin@jobjiffy.com',
  phone: '+91-9876543210',
  location: 'New Delhi, India',
  bio: 'Tech enthusiast looking for home services',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  createdAt: '2024-01-15',
  bookings: 5,
  reviews: 3,
  saved: 12,
};

/**
 * Auth Provider - wrap your app with this
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Check if user is stored, otherwise use demo user
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      // Set demo user for testing (remove in production)
      setUser(DEMO_USER);
      localStorage.setItem('user', JSON.stringify(DEMO_USER));
      localStorage.setItem('token', 'demo-token-123');
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
