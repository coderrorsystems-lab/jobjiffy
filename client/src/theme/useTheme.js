import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

/**
 * useTheme hook
 * Custom hook to access theme state and functions
 * 
 * Usage in components:
 *   const { theme, toggleTheme, isDark, isLight } = useTheme();
 *
 * Returns:
 *   - theme: Current theme ('light' or 'dark')
 *   - setTheme: Function to set specific theme
 *   - toggleTheme: Function to toggle between light and dark
 *   - isDark: Boolean, true if dark mode
 *   - isLight: Boolean, true if light mode
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default useTheme;
