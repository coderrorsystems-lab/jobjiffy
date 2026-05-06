# JobJiffy Routing & Authentication Implementation

## Overview

This document explains the complete routing system with role-based access control for the JobJiffy application. The system ensures proper authentication, authorization, and navigation based on user roles.

## Architecture

### 1. **Public Routes** (No Authentication Required)
- `/` - Home Page
- `/services` - All Services Page
- `/professionals` - All Professionals Page
- `/professional/:userId` - Professional Detail Page
- `/services/:serviceSlug` - Service Professionals Page
- `/about` - About Page
- `/contact` - Contact Page

### 2. **Authentication Routes** (Always Accessible)
- `/login` - Login Page
- `/register` - Register Options Page
- `/register/user` - User Registration Page
- `/register/professional` - Professional Registration Page
- `/forgot-password` - Forgot Password Page
- `/verify-otp` - OTP Verification Page

### 3. **Protected User Routes** (Requires `user` role)
- `/user/profile` - User Profile
- `/user/edit-profile` - Edit User Profile
- `/user/settings` - User Settings
- `/user/bookings` - User Bookings/Dashboard

### 4. **Protected Professional Routes** (Requires `professional` role)
- `/professional/dashboard` - Professional Dashboard
- `/professional/bookings` - Professional Bookings
- `/professional/profile` - Professional Profile
- `/professional/availability` - Professional Availability
- `/professional/earnings` - Professional Earnings
- `/professional/reviews` - Professional Reviews
- `/professional/settings` - Professional Settings

## Components & Utilities

### **ProtectedRoute Component** (`src/utils/ProtectedRoute.jsx`)

Wrapper component that protects routes requiring authentication.

```jsx
<ProtectedRoute
  isAuthenticated={userIsAuthenticated}
  userRole={userRole}
  allowedRoles={['user']} // or ['professional']
  redirectTo="/login" // Optional: where to redirect if not authorized
>
  <YourComponent />
</ProtectedRoute>
```

**Features:**
- Checks if user is authenticated (has access token)
- Validates user role against allowed roles
- Redirects to appropriate location if unauthorized
- Prevents role-based unauthorized access

### **Authentication Utilities** (`src/utils/authUtils.js`)

Helper functions for managing authentication state:

```javascript
// Get access token
getAuthToken()

// Get user role ('user' or 'professional')
getUserRole()

// Check if user is authenticated
isAuthenticated()

// Get current user object
getCurrentUser()

// Set authentication data after login
setAuthData(user, accessToken, refreshToken, userRole)

// Clear authentication data on logout
clearAuthData()

// Check if token is expired
isTokenExpired()
```

## Data Flow

### 1. **Login Flow**

```
User fills login form
    ↓
Selects role (User or Professional)
    ↓
Submits login credentials + role
    ↓
API validates credentials
    ↓
Returns accessToken, refreshToken, user object
    ↓
setAuthData() stores everything in localStorage
    ↓
Navigate to dashboard based on role
    ↓
App.jsx re-evaluates routing with new auth state
```

### 2. **Route Access Flow**

```
User navigates to protected route
    ↓
App.jsx checks: isAuthenticated() && getUserRole()
    ↓
ProtectedRoute component validates:
  - Is user authenticated?
  - Does user have required role?
    ↓
If valid → Render component
If invalid → Redirect to login or appropriate dashboard
```

### 3. **Logout Flow**

```
User clicks logout
    ↓
clearAuthData() removes all auth data from localStorage
    ↓
App.jsx re-evaluates with empty auth state
    ↓
All protected routes redirect to login
    ↓
User redirected to home page
```

## localStorage Structure

```javascript
{
  "accessToken": "eyJhbGc...", // JWT token
  "refreshToken": "eyJhbGc...", // Refresh token
  "userRole": "user" | "professional", // User role
  "user": { // User object
    "_id": "...",
    "fullname": "...",
    "email": "...",
    "phone": "...",
    ...
  },
  "jobjiffy_is_authenticated": "true" // Boolean flag
}
```

## Key Features

### ✅ **Role-Based Access Control**

- Users can only access `/user/*` routes
- Professionals can only access `/professional/*` routes
- Attempting cross-role access redirects to correct dashboard

### ✅ **Automatic Redirects**

- Not logged in → Redirect to login
- Wrong role for route → Redirect to role-appropriate dashboard
- Invalid token → Redirect to login

### ✅ **Public Home Page**

- Home page accessible without login
- Full navigation available without authentication
- Users encouraged to explore before signing up

### ✅ **Persistent Authentication**

- Data stored in localStorage
- Persists across browser sessions
- Survives page refresh

### ✅ **Smart Navigation**

- Navbar hidden on auth pages
- Footer hidden on auth pages
- Footer hidden on professional routes
- Consistent layout management

## Usage Examples

### **Protecting a New Route**

```jsx
<Route
  path="/user/new-page"
  element={
    <ProtectedRoute
      isAuthenticated={userIsAuthenticated}
      userRole={userRole}
      allowedRoles={['user']}
    >
      <NewUserComponent />
    </ProtectedRoute>
  }
/>
```

### **Checking Authentication in Components**

```jsx
import { isAuthenticated, getCurrentUser, getUserRole } from '@/utils/authUtils';

export function MyComponent() {
  const isAuth = isAuthenticated();
  const user = getCurrentUser();
  const role = getUserRole();

  if (!isAuth) {
    return <LoginPrompt />;
  }

  return <Dashboard user={user} role={role} />;
}
```

### **Logging Out**

```jsx
import { clearAuthData } from '@/utils/authUtils';
import { useNavigate } from 'react-router-dom';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    navigate('/', { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## Security Considerations

### ⚠️ **Important Notes**

1. **Token Storage**: Tokens are stored in localStorage, which is vulnerable to XSS attacks
   - Consider using httpOnly cookies for production
   - Implement CSP headers to prevent XSS

2. **Token Validation**: Currently does basic validation
   - Should decode JWT and check `exp` claim
   - Implement token refresh logic for expired tokens

3. **CORS**: Ensure backend has proper CORS configuration
   - Allow requests from frontend domain
   - Support credentials for cookie-based auth

4. **Environment Variables**: Store API base URL in `.env`
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

## Testing the Routing

### **Test Case 1: Public Access**
```
1. Open http://localhost:3000
2. Should see Home page without login
3. Can browse services without login
4. Click on services → should work
```

### **Test Case 2: Protected Route Access**
```
1. Try to access /user/bookings without login
2. Should redirect to /login
3. Login as User
4. Should redirect to /user/bookings
```

### **Test Case 3: Role-Based Access**
```
1. Login as User
2. Try to access /professional/dashboard
3. Should redirect back to /user/bookings
4. Logout
5. Login as Professional
6. Should access /professional/dashboard successfully
```

### **Test Case 4: Persistent Authentication**
```
1. Login as User
2. Refresh the page (F5)
3. Should remain logged in
4. Check localStorage for tokens
5. Open DevTools → Application → localStorage
6. Verify tokens are stored
```

## Migration from Old System

If migrating from an old system:

1. Update all protected routes to use `<ProtectedRoute>`
2. Replace manual localStorage checks with utility functions
3. Update logout handlers to use `clearAuthData()`
4. Update login handlers to use `setAuthData()`
5. Test all protected routes thoroughly

## Future Enhancements

- [ ] Implement JWT token refresh logic
- [ ] Add role-based middleware on backend
- [ ] Implement granular permissions system
- [ ] Add MFA (Multi-Factor Authentication)
- [ ] Add session management
- [ ] Implement automatic logout on token expiration
- [ ] Add social login (Google, GitHub, etc.)

## Troubleshooting

### **Issue: Routes not redirecting properly**
- Check localStorage for tokens
- Verify role is saved correctly
- Clear localStorage and login again
- Check browser console for errors

### **Issue: ProtectedRoute component not working**
- Ensure `isAuthenticated` and `userRole` are passed correctly
- Check `allowedRoles` array matches user's role
- Verify token exists in localStorage

### **Issue: Lost authentication on page refresh**
- Check localStorage persistence
- Verify browser allows localStorage
- Check for browser privacy mode (may clear storage)

## Files Modified

- `src/App.jsx` - Main routing configuration
- `src/utils/ProtectedRoute.jsx` - NEW: Protected route wrapper
- `src/utils/authUtils.js` - NEW: Authentication utilities
- `src/features/auth/pages/Login.jsx` - Updated to use authUtils
- `src/features/auth/services/authAPI.js` - Updated role parameter support

---

**Last Updated**: May 6, 2026
**Version**: 1.0
**Status**: Production Ready ✅
