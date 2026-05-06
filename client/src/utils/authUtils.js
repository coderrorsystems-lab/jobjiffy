/**
 * Authentication Utilities
 * Helper functions to manage authentication state and tokens
 */

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Get the user role from localStorage
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'user';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token; // Returns true if token exists, false otherwise
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Set authentication data
 */
export const setAuthData = (user, accessToken, refreshToken, userRole) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userRole', userRole);
  localStorage.setItem('jobjiffy_is_authenticated', 'true');
};

/**
 * Clear authentication data on logout
 */
export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('jobjiffy_is_authenticated');
};

/**
 * Check if token is expired (basic check)
 * Note: A more robust implementation would decode the JWT
 */
export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  // For now, we'll assume token is valid if it exists
  // In production, you should decode and check the exp claim
  return false;
};
