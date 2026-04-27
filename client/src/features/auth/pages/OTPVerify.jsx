import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Loader, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';

export default function OTPVerify() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  const email = location.state?.email || 'user@example.com';

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

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

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerified(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
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
        {!verified ? (
          <>
            {/* Logo Section */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 mx-auto shadow-lg">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
              <p className="text-gray-500">
                We've sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>
              </p>
            </motion.div>

            {/* OTP Input */}
            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="w-12 h-12 text-center text-xl font-semibold bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.05 }}
                  />
                ))}
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Resend OTP */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              {resendCountdown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend OTP in <span className="font-semibold">{resendCountdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50"
                >
                  Didn't receive the code? Resend OTP
                </button>
              )}
            </motion.div>

            {/* Back to Login */}
            <motion.div variants={itemVariants} className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </motion.div>
          </>
        ) : (
          <>
            {/* Success State */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 mx-auto"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
              <p className="text-gray-500 mb-4">Your phone number has been verified successfully</p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-500"
              >
                Redirecting to login...
              </motion.p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
