import React from 'react';
import { useTheme } from '../theme/useTheme';

/**
 * ThemeToggle Component
 * Provides a visual button to switch between light and dark modes
 * Features:
 *   - Smooth animation and transition
 *   - Clear visual indication of current theme
 *   - Accessible and keyboard navigable
 *   - Persists selection to localStorage
 */
export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-12 rounded-lg font-semibold transition-all duration-300
        ${isDark
          ? 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400'
          : 'bg-neutral-100 hover:bg-neutral-200 text-gray-700'
        }
        border border-current border-opacity-20
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-primary focus-ring-offset-transparent
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        // Sun icon for dark mode
        <svg
          className="w-6 h-6 transition-transform duration-300 rotate-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.12-2.12a1 1 0 00-1.414 0l-2.12 2.12a1 1 0 001.414 1.414L9 11.414l1.464 1.465a1 1 0 001.414-1.414zm2.12-10.95a1 1 0 010 1.414l-2.12 2.12a1 1 0 11-1.414-1.414l2.12-2.12a1 1 0 011.414 0zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zm-7 4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l2.12 2.12a1 1 0 00-1.414 1.414L5.05 6.464zm5.414 9.414a1 1 0 00-1.414 1.414l2.12 2.12a1 1 0 001.414-1.414l-2.12-2.12zM5 8a1 1 0 100-2H3a1 1 0 000 2h2z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Moon icon for light mode
        <svg
          className="w-6 h-6 transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
