import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, Eye, EyeOff, Save, AlertCircle, Mail, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  
  // Password reset OTP flow states
  const [passwordResetStep, setPasswordResetStep] = useState('idle'); // idle, request-otp, verify-otp, set-password
  const [email, setEmail] = useState('rohan.mehta@example.com');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // OTP timer countdown
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate email
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    // Simulate API call to send OTP
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: `OTP sent to ${email}. Check your inbox.`,
      });
      setPasswordResetStep('verify-otp');
      setOtpTimer(300); // 5 minutes
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!otp || otp.length < 4) {
      setMessage({ type: 'error', text: 'Please enter a valid OTP' });
      setLoading(false);
      return;
    }

    // Simulate API call to verify OTP
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'OTP verified successfully!',
      });
      setPasswordResetStep('set-password');
      setOtp('');
      setLoading(false);
    }, 1000);
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    // Simulate API call to update password
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Password changed successfully!',
      });
      setTimeout(() => {
        resetPasswordFlow();
      }, 2000);
      setLoading(false);
    }, 1000);
  };

  const resetPasswordFlow = () => {
    setPasswordResetStep('idle');
    setEmail('rohan.mehta@example.com');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpTimer(0);
    setMessage(null);
  };

  const handleResendOtp = () => {
    setPasswordResetStep('request-otp');
    setOtp('');
    setMessage(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Change Password with OTP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Change Password</h2>
        </div>

        {passwordResetStep === 'idle' && (
          <div className="text-center py-8">
            <Lock size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              For security, we'll send an OTP to your registered email to verify your identity.
            </p>
            <button
              onClick={() => setPasswordResetStep('request-otp')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full"
            >
              <Lock size={18} />
              Reset Password
            </button>
          </div>
        )}

        {/* Step 1: Request OTP */}
        {passwordResetStep === 'request-otp' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="w-full px-4 pl-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                OTP will be sent to this email
              </p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{message.text}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetPasswordFlow}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {passwordResetStep === 'verify-otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Enter OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-mono"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                6-digit code sent to {email}
              </p>
            </div>

            {otpTimer > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Clock size={16} />
                <span>
                  OTP expires in{' '}
                  <span className="font-semibold">
                    {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </span>
                </span>
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{message.text}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetPasswordFlow}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={otpTimer > 0}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Resend OTP
              </button>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {passwordResetStep === 'set-password' && (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3 mb-6">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-300">OTP Verified!</p>
                <p className="text-sm text-green-700 dark:text-green-200">You can now set your new password</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Minimum 6 characters required
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>{message.text}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetPasswordFlow}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                <Save size={18} />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Logout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <LogOut size={24} className="text-red-600 dark:text-red-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Logout</h2>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You will be logged out from your account and redirected to the login page.
        </p>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Account Information</h3>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p>Email: rohan.mehta@example.com</p>
          <p>Account Type: Professional (Service Provider)</p>
          <p>Member Since: January 2023</p>
          <p>Last Login: Today at 2:30 PM</p>
        </div>
      </motion.div>
    </div>
  );
}
