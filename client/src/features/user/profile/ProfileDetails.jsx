import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ProfileDetails({ user }) {
  return (
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
  );
}
