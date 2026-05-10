import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';
import { login } from '../services/authAPI';
import { useTheme } from '@/theme/useTheme';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'professional'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkWarning, setNetworkWarning] = useState('');
  const { theme, toggleTheme, isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password, role);

      // if network was slow, show a non-blocking warning
      if (response._meta?.slowNetwork) {
        setNetworkWarning(`Network looks slow (took ${response._meta.duration}ms).`);
        setTimeout(() => setNetworkWarning(''), 5000);
      }

      // Ensure user object exists and has necessary fields
      const userData = response.user || {};
      if (!userData._id && response.userId) {
        userData._id = response.userId;
      }
      if (!userData.email) {
        userData.email = email;
      }

      // Update auth context immediately
      contextLogin(
        userData,
        response.accessToken,
        response.refreshToken,
        role
      );

      console.log('Login successful - User data:', userData, 'Role:', role);

      // Navigate based on role with a small delay to ensure state updates
      setTimeout(() => {
        if (role === 'professional') {
          navigate('/professional/dashboard', { replace: true });
        } else if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      }, 100);
    } catch (err) {
      if (err.isNetwork || (err.original && err.original.isAxiosError && !err.original.response)) {
        setError('Network error: please check your internet connection and try again.');
      } else if (err.isTimeout) {
        setError('Request timed out. Your network may be slow.');
      } else {
        setError(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
       <div className="inline-flex items-center gap-4">
           <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 mx-auto shadow-lg">
            <span className="text-2xl font-bold text-white">JF</span>
          </div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-300">Sign in to your JobJiffy account</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-4 px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-sm text-gray-700 dark:text-gray-200"
            >
              {isDark ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
       </div>
        </motion.div>

        {/* Form */}
        {networkWarning && (
          <div className="p-2 mb-2 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
            {networkWarning}
          </div>
        )}

        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-4">
          {/* Email Input */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-gray-900 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login As Selection */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Login As</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  role === 'user'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole('professional')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  role === 'professional'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                  role === 'admin'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>

        {/* Sign Up Options */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Link
            to="/register/user"
            className="block w-full rounded-xl border-2 border-blue-200 py-3 px-4 text-center font-medium text-blue-600 transition-colors duration-300 hover:bg-blue-50"
          >
            Sign Up as User
          </Link>
          <Link
            to="/register/professional"
            className="block w-full rounded-xl border-2 border-indigo-200 py-3 px-4 text-center font-medium text-indigo-600 transition-colors duration-300 hover:bg-indigo-50"
          >
            Sign Up as Professional
          </Link>
        </motion.div>

        {/* Footer Text */}
        <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
