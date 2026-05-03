import { motion } from 'framer-motion';

export default function ProfileStats({ user }) {
  const stats = [
    { label: 'Bookings', value: user?.bookings || '0' },
    { label: 'Reviews', value: user?.reviews || '0' },
    { label: 'Saved', value: user?.saved || '0' },
  ];

  return (
    <motion.div
      className="grid md:grid-cols-3 gap-6 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      {stats.map((stat, index) => (
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
  );
}
