# Auth Feature Documentation

Complete authentication module for Jobjiffy marketplace with support for users, professionals, and admins.

## 📁 Structure

```
auth/
├── pages/                 # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   └── OTPVerify.jsx
│
├── components/            # Reusable auth components
│   ├── AuthLayout.jsx
│   ├── LoginForm.jsx
│   └── RegisterForm.jsx
│
├── services/              # API & token management
│   ├── authAPI.js         # API calls with interceptors
│   └── tokenService.js    # JWT token handling
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Auth state & functions
│   └── useRole.js         # Role-based access
│
├── store/                 # Redux state management
│   └── authSlice.js       # Redux slice with async thunks
│
├── utils/                 # Helper functions
│   └── authHelpers.js     # Validation & formatting
│
├── context/               # React Context (optional)
│   └── AuthContext.jsx
│
├── constants.js           # Auth constants
├── index.js               # Central exports
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Setup Redux Store

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
```

### 2. Wrap App with Providers

```javascript
// main.jsx
import { Provider } from 'react-redux';
import { ThemeProvider } from './theme';
import store from './app/store';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
```

### 3. Setup Routes

```javascript
// app/router.jsx
import { LoginPage, RegisterPage, ForgotPasswordPage, OTPVerifyPage } from '../features/auth';

const routes = [
  {
    path: '/auth',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'otp-verify', element: <OTPVerifyPage /> },
    ],
  },
];
```

## 📖 Usage Examples

### Check Authentication

```javascript
import { useAuth } from '../features/auth';

function ProtectedComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Redirect to="/auth/login" />;

  return <div>Welcome, {user.fullName}!</div>;
}
```

### Check User Role

```javascript
import { useRole } from '../features/auth';

function AdminPanel() {
  const { isAdmin, canAccessAdmin } = useRole();

  if (!canAccessAdmin) {
    return <Redirect to="/dashboard" />;
  }

  return <AdminDashboard />;
}
```

### Use Multiple Roles

```javascript
import { useAuth } from '../features/auth';
import { AUTH_CONSTANTS } from '../features/auth';

function Dashboard() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      {hasRole(AUTH_CONSTANTS.ROLES.ADMIN) && <AdminSection />}
      {hasRole(AUTH_CONSTANTS.ROLES.PROFESSIONAL) && <ProfessionalSection />}
      {hasRole(AUTH_CONSTANTS.ROLES.USER) && <UserSection />}
    </div>
  );
}
```

### Manual Login

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth';

function CustomLoginButton() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    const result = await dispatch(login({
      email: 'user@example.com',
      password: 'password123',
    }));

    if (result.payload?.user) {
      console.log('Login successful');
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Form Validation

```javascript
import { validateRegistrationData, getPasswordStrength } from '../features/auth';

function SignupForm() {
  const { isValid, errors } = validateRegistrationData(formData);

  const strength = getPasswordStrength(password);
  // strength = { score: 0-5, label: 'Weak|Good|Strong' }
}
```

## 🔐 Security Features

✅ **JWT Token Management** - Auto-refresh with interceptors
✅ **Password Validation** - Strong password requirements
✅ **Input Sanitization** - Protection against XSS
✅ **Role-Based Access** - Fine-grained permissions
✅ **Token Persistence** - Secure localStorage with fallbacks
✅ **Error Handling** - User-friendly error messages
✅ **OTP Verification** - Two-factor authentication support

## 🔑 API Endpoints

```javascript
POST   /auth/login              # Login with email/password
POST   /auth/register           # Register new account
POST   /auth/forgot-password    # Request password reset
POST   /auth/reset-password     # Reset password with token
POST   /auth/verify-otp         # Verify OTP code
POST   /auth/resend-otp         # Resend OTP
POST   /auth/verify-email       # Verify email token
POST   /auth/logout             # Logout
POST   /auth/refresh-token      # Refresh access token
GET    /auth/profile            # Get current user profile
```

## 📋 Constants Reference

```javascript
import { AUTH_CONSTANTS } from '../features/auth';

// Roles
AUTH_CONSTANTS.ROLES.USER           // 'user'
AUTH_CONSTANTS.ROLES.PROFESSIONAL   // 'professional'
AUTH_CONSTANTS.ROLES.ADMIN          // 'admin'

// Storage Keys
AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN     // 'jobjiffy_access_token'
AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN    // 'jobjiffy_refresh_token'
AUTH_CONSTANTS.STORAGE_KEYS.USER_DATA        // 'jobjiffy_user_data'

// Validation
AUTH_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH        // 8
AUTH_CONSTANTS.VALIDATION.PHONE_REGEX               // /^[0-9]{10}$/
AUTH_CONSTANTS.VALIDATION.EMAIL_REGEX               // Email regex

// OTP
AUTH_CONSTANTS.OTP.LENGTH          // 6
AUTH_CONSTANTS.OTP.EXPIRY          // 300 (5 minutes)
AUTH_CONSTANTS.OTP.MAX_ATTEMPTS    // 3
```

## 🛠️ Customization

### Change Validation Rules

Edit `constants.js`:
```javascript
export const AUTH_CONSTANTS = {
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 12,  // Change to 12
    PHONE_REGEX: /^[1-9]\d{9}$/,  // Update regex
  },
};
```

### Add Custom Auth Logic

Extend `authSlice.js` with your own thunks:
```javascript
export const customAuth = createAsyncThunk(
  'auth/customAuth',
  async (data, { rejectWithValue }) => {
    // Your custom logic
  }
);
```

### Modify Token Interceptors

Edit `authAPI.js` response interceptor to add custom logic.

## 🧪 Testing

```javascript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../features/auth';

test('useAuth provides auth state', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    ),
  });

  expect(result.current.isAuthenticated).toBe(false);
});
```

## 🐛 Troubleshooting

### "useAuth must be used within AuthProvider"
- Make sure Redux Provider wraps your app
- Check that store is properly configured

### Tokens not persisting
- Check localStorage is enabled
- Verify `tokenService.saveTokens()` is called after login

### CORS errors
- Update `VITE_API_BASE_URL` in `.env`
- Ensure backend CORS headers are correct

### OTP not working
- Check email service configuration on backend
- Verify OTP length matches (default 6)

## 📚 References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
