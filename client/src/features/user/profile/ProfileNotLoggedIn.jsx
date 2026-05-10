import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProfileNotLoggedIn() {
  const navigate = useNavigate();

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
