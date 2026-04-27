import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, LogOut, Edit, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useWindowScroll } from '@/hooks';

export default function Profile() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-slate-400 mb-8">You need to be logged in to view your profile.</p>
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

  const handleLogout = () => {
    logout();
    navigate('/');
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
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>

        {/* Profile Card */}
        <motion.div
          className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {/* Profile Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-600/20 to-cyan-500/20" />

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Profile Info */}
            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-end gap-6">
                <motion.div
                  className="w-32 h-32 rounded-full border-4 border-slate-900 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  {user?.fullName?.[0]?.toUpperCase() || 'U'}
                </motion.div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-white mb-1">{user?.fullName || 'User'}</h1>
                  <p className="text-slate-400">{user?.role || 'Member'}</p>
                </div>
              </div>

              <motion.button
                onClick={() => navigate('/user/edit-profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Edit size={18} />
                Edit Profile
              </motion.button>
            </motion.div>

            {/* Profile Details */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
                
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <Mail className="text-cyan-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-white font-medium">{user?.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <Phone className="text-cyan-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-white font-medium">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <MapPin className="text-cyan-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-white font-medium">{user?.city || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400">Account Type</p>
                  <p className="text-white font-medium capitalize">{user?.role || 'User'}</p>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400">Member Since</p>
                  <p className="text-white font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-green-400 font-medium">✓ Active</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                onClick={() => navigate('/user/settings')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                Settings
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            { label: 'Bookings', value: user?.bookings || '0' },
            { label: 'Reviews', value: user?.reviews || '0' },
            { label: 'Saved', value: user?.saved || '0' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center"
            >
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
