import { motion } from 'framer-motion';

export default function EarningsCard({ label, value, icon: Icon, color, change, index = 0 }) {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
      {change && <p className="text-xs text-slate-500 dark:text-slate-400">{change}</p>}
    </motion.div>
  );
}
