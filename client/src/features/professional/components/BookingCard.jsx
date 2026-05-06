import { motion } from 'framer-motion';
import { Check, X, CheckCheck, MapPin, Clock, Phone } from 'lucide-react';

const statusBadges = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

export default function BookingCard({
  booking,
  index = 0,
  onAccept,
  onReject,
  onComplete,
  variant = 'full',
}) {
  if (variant === 'compact') {
    // Compact version for dashboard
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {booking.User}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {booking.service}
            </p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadges[booking.status]}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>
            {booking.date} at {booking.time}
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {booking.amount}
          </span>
        </div>
      </motion.div>
    );
  }

  // Full version for bookings page
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="grid md:grid-cols-2 gap-6 mb-4">
        {/* Booking Info */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {booking.User}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {booking.service}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-slate-900 dark:text-white">
                {booking.date} • {booking.time}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-slate-900 dark:text-white">{booking.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-blue-600 dark:text-blue-400" />
              <a
                href={`tel:${booking.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {booking.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-start justify-between md:justify-start md:flex-col">
          <div className="text-right md:text-left">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Amount</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {booking.amount}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {booking.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept && onAccept(booking.id)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Check size={18} />
              Accept
            </button>
            <button
              onClick={() => onReject && onReject(booking.id)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <X size={18} />
              Reject
            </button>
          </>
        )}

        {booking.status === 'confirmed' && (
          <button
            onClick={() => onComplete && onComplete(booking.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <CheckCheck size={18} />
            Mark Complete
          </button>
        )}

        {booking.status === 'completed' && (
          <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg font-medium flex items-center gap-2">
            <CheckCheck size={18} />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}
