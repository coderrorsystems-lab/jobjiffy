import { Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from './authUtils';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * 
 * Props:
 * - allowedRoles: array - roles allowed to access this route
 * - children: component to render if authorized
 * - redirectTo: string - where to redirect if not authorized (default: '/login')
 * 
 * Note: Role is checked dynamically from localStorage, not from props
 */
export function ProtectedRoute({ 
  allowedRoles = [], 
  children,
  redirectTo = '/login'
}) {
  // Check auth state dynamically (not from props) so it updates after login
  const userIsAuthenticated = isAuthenticated();
  const userRole = getUserRole();

  // If not authenticated, redirect to login
  if (!userIsAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If route has role restrictions, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User is authenticated but doesn't have the right role
    // Redirect based on their actual role
    if (userRole === 'professional') {
      return <Navigate to="/professional/dashboard" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/user/bookings" replace />;
    }
  }

  // User is authenticated and has correct role (or no role restriction)
  return children;
}

export default ProtectedRoute;
