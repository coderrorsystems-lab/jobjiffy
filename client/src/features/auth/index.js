/**
 * Auth Feature Index
 * Central export point for all auth-related utilities
 */

// Pages
export { default as LoginPage } from './pages/Login';
export { default as RegisterPage } from './pages/Register';
export { default as ForgotPasswordPage } from './pages/ForgotPassword';
export { default as OTPVerifyPage } from './pages/OTPVerify';

// Components
export { default as AuthLayout } from './components/AuthLayout';
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';

// Services
export * from './services/authAPI';
export { default as tokenService } from './services/tokenService';

// Hooks
export { useAuth, useIsAuthenticated, useHasRole, useHasAnyRole } from './hooks/useAuth';
export { useRole } from './hooks/useRole';

// Store
export { default as authReducer, login, register, logout, forgotPassword, resetPassword, verifyOTP, getProfile } from './store/authSlice';

// Utils
export * from './utils/authHelpers';

// Constants
export { AUTH_CONSTANTS } from './constants';
