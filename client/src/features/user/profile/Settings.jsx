import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useWindowScroll } from '@/hooks';
import { changePassword, changeProfessionalPassword } from './service/profileAPI';

export default function Settings({ isEmbedded = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!isEmbedded) {
    useWindowScroll(true);
  }

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required';
    if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');
    try {
      const userRole = localStorage.getItem('userRole') || 'user';
      if (userRole === 'professional') {
        await changeProfessionalPassword(formData.currentPassword, formData.newPassword);
      } else {
        await changePassword(formData.currentPassword, formData.newPassword);
      }

      setMessage('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        setMessage('');
        if (!isEmbedded) {
          navigate('/user/profile');
        }
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to change password';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ label, name, showPassword, onToggleVisibility }) => (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full pl-10 pr-10 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
            errors[name] ? 'border-red-500' : 'border-slate-700'
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
      )}
    </motion.div>
  );

  if (!user && !isEmbedded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-slate-400 mb-8">You need to be logged in to change your password.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      <PasswordInput
        label="Current Password"
        name="currentPassword"
        showPassword={showPasswords.current}
        onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
      />

      <PasswordInput
        label="New Password"
        name="newPassword"
        showPassword={showPasswords.new}
        onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
      />

      <PasswordInput
        label="Confirm New Password"
        name="confirmPassword"
        showPassword={showPasswords.confirm}
        onToggleVisibility={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
      />

      {/* Message Display */}
      {message && (
        <motion.div
          className={`p-4 rounded-lg border flex items-center gap-3 ${
            message.includes('successfully')
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message.includes('successfully') ? (
            <Check className="text-green-400" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          <p className={`font-medium ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      {!isEmbedded && (
        <motion.div
          className="flex gap-4 flex-col sm:flex-row pt-6 border-t border-slate-700"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => navigate('/user/profile')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel
          </motion.button>

          <motion.button
            onClick={handleChangePassword}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            {loading ? 'Changing...' : 'Change Password'}
          </motion.button>
        </motion.div>
      )}

      {isEmbedded && (
        <motion.button
          onClick={handleChangePassword}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Check size={18} />
          {loading ? 'Changing...' : 'Change Password'}
        </motion.button>
      )}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <motion.div
        className="max-w-2xl mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.button
          onClick={() => navigate('/user/profile')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          whileHover={{ x: -4 }}
        >
          <X size={20} />
          Back to Profile
        </motion.button>

        {/* Page Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Account Settings
        </motion.h1>
        <motion.p
          className="text-slate-400 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Change your password to keep your account secure
        </motion.p>

        {/* Settings Form */}
        <motion.div
          className="bg-slate-900/50 rounded-xl border border-slate-800 p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
          {content}
        </motion.div>
      </motion.div>
    </div>
  );
}
