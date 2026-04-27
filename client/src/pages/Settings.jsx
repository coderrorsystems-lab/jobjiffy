import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Bell, Shield, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useResetScroll, useModalScroll, useWindowScroll } from '@/hooks';

export default function Settings() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('security');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingUpdates: true,
    promotionalEmails: false,
    profileRecommendations: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    activityStatus: true,
  });

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

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

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPasswordMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      setPasswordError('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowDeleteConfirm(false);
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-12"
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

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-8 border-b border-slate-800 overflow-x-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Change Password */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-semibold rounded-lg transition-all"
              >
                Update Password
              </motion.button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-400">Add an extra layer of security</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Enable
                </motion.button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-500/5 rounded-xl border border-red-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-400 mb-1 flex items-center gap-2">
                    <Trash2 size={18} />
                    Delete Account
                  </h3>
                  <p className="text-sm text-slate-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowDeleteConfirm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {[
              {
                key: 'emailNotifications',
                label: 'Email Notifications',
                description: 'Receive updates via email',
              },
              {
                key: 'smsNotifications',
                label: 'SMS Notifications',
                description: 'Receive updates via text message',
              },
              {
                key: 'pushNotifications',
                label: 'Push Notifications',
                description: 'Receive browser push notifications',
              },
              {
                key: 'bookingUpdates',
                label: 'Booking Updates',
                description: 'Get notified about booking changes',
              },
              {
                key: 'promotionalEmails',
                label: 'Promotional Emails',
                description: 'Receive special offers and discounts',
              },
              {
                key: 'profileRecommendations',
                label: 'Recommendations',
                description: 'Get personalized service recommendations',
              },
            ].map((item, index) => (
              <motion.div
                key={item.key}
                className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex items-center justify-between"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div>
                  <h3 className="font-medium text-white">{item.label}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationToggle(item.key)}
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    notificationSettings[item.key]
                      ? 'bg-cyan-500'
                      : 'bg-slate-700'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-lg"
                    animate={{
                      x: notificationSettings[item.key] ? 22 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Visibility */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h3 className="font-semibold text-white mb-4">Profile Visibility</h3>
              <div className="space-y-3">
                {[
                  { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                  { value: 'private', label: 'Private', description: 'Only you can view your profile' },
                  { value: 'friends', label: 'Friends Only', description: 'Only connected professionals can view' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border border-slate-700 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="profileVisibility"
                      value={option.value}
                      checked={privacySettings.profileVisibility === option.value}
                      onChange={(e) =>
                        handlePrivacyChange('profileVisibility', e.target.value)
                      }
                      className="w-4 h-4 accent-cyan-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{option.label}</p>
                      <p className="text-xs text-slate-400">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Info Visibility */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h3 className="font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                {[
                  { key: 'showEmail', label: 'Show Email Address', description: 'Let professionals contact you via email' },
                  { key: 'showPhone', label: 'Show Phone Number', description: 'Let professionals call or text you' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                    <motion.button
                      onClick={() =>
                        handlePrivacyChange(item.key, !privacySettings[item.key])
                      }
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        privacySettings[item.key] ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white shadow-lg"
                        animate={{
                          x: privacySettings[item.key] ? 22 : 2,
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Status */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Activity Status</h3>
                  <p className="text-sm text-slate-400">Let others see when you're online</p>
                </div>
                <motion.button
                  onClick={() =>
                    handlePrivacyChange('activityStatus', !privacySettings.activityStatus)
                  }
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    privacySettings.activityStatus ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-lg"
                    animate={{
                      x: privacySettings.activityStatus ? 22 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>

            {/* Allow Messages */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Allow Messages</h3>
                  <p className="text-sm text-slate-400">Let professionals send you messages</p>
                </div>
                <motion.button
                  onClick={() =>
                    handlePrivacyChange('allowMessages', !privacySettings.allowMessages)
                  }
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    privacySettings.allowMessages ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-lg"
                    animate={{
                      x: privacySettings.allowMessages ? 22 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && <DeleteAccountModal isOpen={showDeleteConfirm} onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteConfirm(false)} />}
    </div>
  );
}

/**
 * Delete Account Modal Component
 * Handles scroll management with hooks
 */
function DeleteAccountModal({ isOpen, onConfirm, onCancel }) {
  const modalRef = useResetScroll();
  useModalScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Trash2 className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Account?</h3>
            <p className="text-slate-400 text-sm mt-1">
              This will permanently delete your account and all associated data.
            </p>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-6">
          <p className="text-xs text-red-400 font-medium">
            ⚠️ This action cannot be undone. All your bookings, reviews, and profile information will be deleted.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
