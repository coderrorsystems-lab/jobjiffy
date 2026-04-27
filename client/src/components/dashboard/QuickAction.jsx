import { motion } from 'framer-motion';

/**
 * Reusable QuickAction Component
 * Used for action buttons across dashboard pages
 * Props: icon, label, description, color, onClick, index
 */
export default function QuickAction({ icon: Icon, label, description, color = 'blue', onClick, index = 0 }) {
  const colorMap = {
    blue: 'from-blue-600 to-cyan-500',
    green: 'from-green-600 to-emerald-500',
    orange: 'from-orange-600 to-amber-500',
    purple: 'from-purple-600 to-pink-500',
    red: 'from-red-600 to-orange-500',
  };

  return (
    <motion.button
      onClick={onClick}
      className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-left hover:border-slate-700 transition-all duration-300 group"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -4, borderColor: 'rgb(100, 200, 255)' }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="font-semibold text-white text-sm">{label}</h3>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </motion.button>
  );
}
