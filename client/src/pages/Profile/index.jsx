import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useWindowScroll } from '@/hooks';

import ProfileNotLoggedIn from './ProfileNotLoggedIn';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import ProfileActions from './ProfileActions';
import ProfileStats from './ProfileStats';

export default function Profile() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return <ProfileNotLoggedIn />;
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
        <ProfileHeader />

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
             <ProfileInfo name={user.name} />
            <ProfileDetails user={user} />
            <ProfileActions onLogout={handleLogout} />
          </div>
        </motion.div>

        {/* Quick Stats */}
        {/* <ProfileStats user={user} /> */}
      </motion.div>
    </div>
  );
}
