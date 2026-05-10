import { motion } from 'framer-motion';
import { MapPin, Clock, User, Phone } from 'lucide-react';

/**
 * Reusable BookingItem Component
 * Used for displaying individual booking/job details
 * Props: booking, index, onAccept, onReject
 */
export default function BookingItem({ booking, index = 0, onAccept, onReject }) {
  return (
    <motion.div
      className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-all duration-300"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ borderColor: 'rgb(100, 200, 255)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{booking.customerName}</h3>
          <p className="text-sm text-slate-400">{booking.service}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${
          booking.status === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {booking.status === 'pending' ? 'New' : 'Confirmed'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock size={14} className="text-cyan-400 flex-shrink-0" />
          <span>{booking.dateTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin size={14} className="text-cyan-400 flex-shrink-0" />
          <span className="truncate">{booking.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <User size={14} className="text-cyan-400 flex-shrink-0" />
          <span>₹{booking.amount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Phone size={14} className="text-cyan-400 flex-shrink-0" />
          <span>{booking.customerPhone}</span>
        </div>
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-2">
          <motion.button
            onClick={() => onReject?.(booking.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded transition-colors"
          >
            Reject
          </motion.button>
          <motion.button
            onClick={() => onAccept?.(booking.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium rounded transition-colors"
          >
            Accept
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
