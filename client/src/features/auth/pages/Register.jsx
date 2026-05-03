import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, ArrowRight, Loader, Eye, EyeOff, Check, X, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';
import { registerUser, sendOTP } from '../services/authAPI';

export default function UserRegister() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '+91 ',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // OTP States
  const [otpData, setOtpData] = useState({
    otp: '',
    isOtpSent: false,
    otpLoading: false,
  });
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile number, ensure +91 prefix is always present
    if (name === 'mobileNumber') {
      if (!value.startsWith('+91')) {
        return; // Don't allow removing the prefix
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGetOTP = async () => {
    setOtpError('');
    setOtpSuccess('');

    // Validate email
    if (!formData.email.trim()) {
      setOtpError('Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      setOtpError('Please enter a valid email address');
      return;
    }

    setOtpData(prev => ({ ...prev, otpLoading: true }));
    try {
      await sendOTP(formData.email);
      setOtpSuccess('OTP sent to your email! Check your inbox.');
      setOtpData(prev => ({ 
        ...prev, 
        isOtpSent: true,
        otpLoading: false,
        otp: ''
      }));
      // Clear success message after 5 seconds
      setTimeout(() => setOtpSuccess(''), 5000);
    } catch (err) {
      console.error('Get OTP error:', err);
      setOtpError(err.message || 'Failed to send OTP. Please try again.');
      setOtpData(prev => ({ ...prev, otpLoading: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if OTP is entered
    if (!otpData.isOtpSent) {
      setError('Please get OTP first');
      return;
    }

    if (!otpData.otp.trim()) {
      setError('Please enter the OTP sent to your email');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Include OTP in registration data
      const registrationData = {
        ...formData,
        otp: otpData.otp,
      };

      const response = await registerUser(registrationData);
      
      // Store user data if provided
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      localStorage.setItem('jobjiffy_is_authenticated', 'true');
      
      // Redirect to login or home
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { icon: User, name: 'fullName', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
    { icon: Phone, name: 'mobileNumber', label: 'Mobile Number', placeholder: '+91 98765 43210', type: 'tel' },
    { icon: Mail, name: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-cyan-400/30 bg-slate-900/85 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              JF
            </div>
            <h1 className="text-2xl font-bold text-white">User Registration</h1>
            <p className="mt-1 text-sm text-slate-300">Create your account in one simple form.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Fields */}
          {inputFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name} className="group">
                <label className="mb-2 block text-sm font-medium text-slate-200">{field.label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            );
          })}

          {/* OTP Section */}
          <div className="space-y-3 border-t border-slate-700/50 pt-4">
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={handleGetOTP}
                disabled={otpData.otpLoading}
                whileHover={{ scale: !otpData.otpLoading ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 flex-1 rounded-xl border border-cyan-400/50 bg-cyan-500/10 py-2.5 px-3 font-medium text-cyan-400 transition disabled:cursor-not-allowed disabled:opacity-50 disabled:border-slate-600 disabled:text-slate-500 disabled:bg-slate-800/30"
              >
                {otpData.otpLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : otpData.isOtpSent ? (
                  <>
                    <Check className="w-4 h-4" />
                    OTP Sent - Resend?
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Get OTP
                  </>
                )}
              </motion.button>
            </div>

            {/* OTP Input Field */}
            {otpData.isOtpSent && (
              <motion.div 
                className="group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="mb-2 block text-sm font-medium text-slate-200">Enter OTP</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    value={otpData.otp}
                    onChange={(e) => {
                      setOtpData(prev => ({ ...prev, otp: e.target.value }));
                      setOtpError('');
                    }}
                    placeholder="Enter OTP from email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    maxLength="6"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">OTP will be verified when you submit the form</p>
              </motion.div>
            )}

            {/* OTP Success Message */}
            {otpSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-green-500/40 bg-green-950/40 p-3 text-sm text-green-300 flex items-center gap-2"
              >
                <Check className="w-4 h-4 flex-shrink-0" />
                {otpSuccess}
              </motion.div>
            )}

            {/* OTP Error Message */}
            {otpError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300 flex items-center gap-2"
              >
                <X className="w-4 h-4 flex-shrink-0" />
                {otpError}
              </motion.div>
            )}
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-12 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="group">
            <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-12 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !otpData.isOtpSent || !otpData.otp.trim()}
            whileHover={{ scale: (!loading && otpData.isOtpSent && otpData.otp.trim()) ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 font-semibold text-white transition ${
              otpData.isOtpSent && otpData.otp.trim()
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                : 'bg-gradient-to-r from-slate-600 to-slate-700'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : !otpData.isOtpSent ? (
              <>
                <Mail className="w-5 h-5" />
                Get OTP First
              </>
            ) : !otpData.otp.trim() ? (
              <>
                <Lock className="w-5 h-5" />
                Enter OTP to Continue
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <div className="pt-2 text-center text-sm text-slate-300">
            Already have an account?
          </div>

          <Link
            to="/login"
            className="block w-full rounded-xl border border-cyan-400/35 py-3 px-4 text-center font-medium text-cyan-300 transition-colors duration-300 hover:bg-cyan-500/10"
          >
            Sign In Instead
          </Link>

          <p className="mt-4 text-center text-xs text-slate-500">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
