import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function QuickLinkCard({ to, icon: Icon, label, color, index = 0 }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={to}
        className={`block p-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${colorClasses[color]}`}
      >
        <Icon size={20} />
        {label}
      </Link>
    </motion.div>
  );
}
