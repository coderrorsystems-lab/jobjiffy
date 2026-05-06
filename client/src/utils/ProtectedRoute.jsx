import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * 
 * Props:
 * - isAuthenticated: boolean - whether user is logged in
 * - userRole: string - 'user' or 'professional'
 * - allowedRoles: array - roles allowed to access this route
 * - children: component to render if authorized
 * - redirectTo: string - where to redirect if not authorized (default: '/login')
 */
export function ProtectedRoute({ 
  isAuthenticated, 
  userRole, 
  allowedRoles = [], 
  children,
  redirectTo = '/login'
}) {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If route has role restrictions, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User is authenticated but doesn't have the right role
    // Redirect based on their actual role
    if (userRole === 'professional') {
      return <Navigate to="/professional/dashboard" replace />;
    } else {
      return <Navigate to="/user/bookings" replace />;
    }
  }

  // User is authenticated and has correct role (or no role restriction)
  return children;
}

export default ProtectedRoute;
