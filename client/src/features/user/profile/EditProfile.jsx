import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, ArrowLeft, Upload, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useWindowScroll } from '@/hooks';
import { updateUserProfile, updateProfessionalProfile } from '../services/profileAPI';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // Scroll to top when page loads
  useWindowScroll(true);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errors, setErrors] = useState({});

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-slate-400 mb-8">You need to be logged in to edit your profile.</p>
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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: {
          city: formData.location,
        },
      };

      // Call the appropriate API based on user type
      const userRole = localStorage.getItem('userRole') || 'user';
      if (userRole === 'professional') {
        await updateProfessionalProfile(updateData);
      } else {
        await updateUserProfile(updateData);
      }

      // Update user in auth context
      updateUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
      });

      setSaveMessage('Profile updated successfully!');
      setTimeout(() => {
        setSaveMessage('');
        navigate('/user/profile');
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

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
          <ArrowLeft size={20} />
          Back to Profile
        </motion.button>

        {/* Page Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Edit Profile
        </motion.h1>
        <motion.p
          className="text-slate-400 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Update your personal information and preferences
        </motion.p>

        {/* Avatar Section */}
        <motion.div
          className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-white mb-6">Profile Picture</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Preview */}
            <motion.div
              className="w-32 h-32 rounded-full border-4 border-slate-800 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                formData.fullName?.[0]?.toUpperCase() || 'U'
              )}
            </motion.div>

            {/* Upload Button */}
            <div className="flex-1">
              <label className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors group">
                <Upload size={18} className="group-hover:scale-110 transition-transform" />
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-slate-400 mt-2">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          className="bg-slate-900/50 rounded-xl border border-slate-800 p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>

          <div className="space-y-6">
            {/* Full Name */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-slate-700'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-slate-700'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={otpState.loading}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm"
                >
                  {otpState.loading ? 'Sending...' : otpState.isSent ? 'Resend OTP' : 'Get OTP'}
                </button>
                {otpState.isSent && (
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otpState.otp}
                    onChange={(e) => setOtpState(prev => ({ ...prev, otp: e.target.value }))}
                    className="px-3 py-1 bg-slate-800 rounded-md text-sm text-white"
                  />
                )}
              </div>
              {otpError && <p className="text-red-400 text-xs mt-1">{otpError}</p>}
              {otpSuccess && <p className="text-green-400 text-xs mt-1">{otpSuccess}</p>}
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-slate-700'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                    errors.location ? 'border-red-500' : 'border-slate-700'
                  }`}
                  placeholder="Enter your location"
                />
              </div>
              {errors.location && (
                <p className="text-red-400 text-xs mt-1">{errors.location}</p>
              )}
            </motion.div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Check className="text-green-400" size={20} />
              <p className="text-green-400 font-medium">{saveMessage}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="mt-8 flex gap-4 flex-col sm:flex-row"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
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
              onClick={handleSave}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
