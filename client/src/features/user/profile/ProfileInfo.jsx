import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileInfo( {name}) {
  
  const navigate = useNavigate();

  return (
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
          {name?.[0]?.toUpperCase() || 'U'}
        </motion.div>
        <div className="pb-2">
          <h1 className="text-3xl font-bold text-white mb-1">{name || 'User'}</h1>
       
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
  );
}
