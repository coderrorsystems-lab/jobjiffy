import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileHeader() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/')}
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
      whileHover={{ x: -4 }}
    >
      <ArrowLeft size={20} />
      Back to Home
    </motion.button>
  );
}
