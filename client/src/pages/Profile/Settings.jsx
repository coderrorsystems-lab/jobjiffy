import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, changeProfessionalPassword } from './serivce/profileAPI';
import { useWindowScroll } from '@/hooks';

export default function Settings({ isEmbedded = false }) {
  if (!isEmbedded) {
    useWindowScroll(true);
  }
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;

    setIsChangingPassword(true);
    try {
      // Get user role to call the right API
      const userRole = localStorage.getItem('userRole') || 'user';
      
      if (userRole === 'professional') {
        await changeProfessionalPassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );
      } else {
        await changePassword(
          passwordData.currentPassword,
          passwordData.newPassword
        );
      }

      setPasswordMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };



  return (
    <div className={!isEmbedded ? "min-h-screen bg-slate-950 pt-20" : ""}>
      <motion.div
        className={!isEmbedded ? "max-w-4xl mx-auto px-4 py-12" : ""}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header - Only show if not embedded */}
        {!isEmbedded && (
          <>
            <motion.button
              onClick={() => navigate('/user/profile')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft size={20} />
              Back to Profile
            </motion.button>

            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Settings
            </motion.h1>
            <motion.p
              className="text-slate-400 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              Manage your account preferences and security
            </motion.p>
          </>
        )}



        {/* Security Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Change Password */}
            <div className={isEmbedded ? "bg-slate-900/50 rounded-xl border border-slate-800 p-6" : "bg-slate-900/50 rounded-xl border border-slate-800 p-6"}>
              <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>

              <div className="space-y-4 mb-6">
                {/* Current Password */}
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* New Password */}
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors pr-10"
                      placeholder="Enter new password (min 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              </div>

              {passwordError && (
                <motion.div
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <X size={16} />
                    {passwordError}
                  </p>
                </motion.div>
              )}

              {passwordMessage && (
                <motion.div
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <Check size={16} />
                    {passwordMessage}
                  </p>
                </motion.div>
              )}

              <motion.button
                onClick={handleSavePassword}
                disabled={isChangingPassword}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </motion.button>
            </div>
          </motion.div>
      </motion.div>
    </div>
  );
}
