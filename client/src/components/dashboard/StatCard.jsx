import { motion } from 'framer-motion';

/**
 * Reusable StatCard Component
 * Used across dashboard pages for displaying metrics
 * Props: label, value, icon, color, trend (optional)
 */
export default function StatCard({ label, value, icon: Icon, color = 'cyan', trend, index = 0 }) {
  const colorMap = {
    cyan: 'from-cyan-500 to-blue-600',
    orange: 'from-orange-500 to-amber-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    yellow: 'from-yellow-500 to-amber-600',
  };

  return (
    <motion.div
      className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all duration-300"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ borderColor: 'rgb(100, 200, 255)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-3xl md:text-4xl font-bold text-white mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.percentage}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center flex-shrink-0`}>
            <Icon size={24} className="text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
