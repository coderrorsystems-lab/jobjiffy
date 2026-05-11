/**
 * Authentication Utilities
 * Helper functions to manage authentication state and tokens
 */

/**
 * Decode JWT token and get payload
 */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

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
  if (!token) return false;
  // Check if token is expired
  return !isTokenExpired();
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
 * Check if token is expired
 * Decodes JWT and checks the exp claim
 */
export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = currentTime > decoded.exp;
    
    if (isExpired) {
      console.warn('[Auth] Token has expired');
    }
    
    return isExpired;
  } catch (error) {
    console.error('[Auth] Error checking token expiration:', error);
    return true; // Assume expired if we can't decode
  }
};
