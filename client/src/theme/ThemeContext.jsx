import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * ThemeContext
 * Provides theme state and functions to the entire app
 */
export const ThemeContext = createContext();

/**
 * ThemeProvider component
 * Wraps the app to provide theme functionality
 * - Manages light/dark mode state
 * - Persists theme choice to localStorage
 * - Applies CSS variables and DOM classes
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // 1. Check localStorage for saved theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      // 2. Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    // 3. Default to light
    return 'light';
  });

  // Update DOM and localStorage whenever theme changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('app-theme', theme);

    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update CSS variable for theme
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
