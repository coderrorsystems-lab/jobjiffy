import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, BookingCard } from '../components';

const STATS = [
  {
    label: 'Total Bookings',
    value: '24',
    icon: Clock,
    color: 'blue',
    change: '+3 this week',
  },
  {
    label: 'Pending Requests',
    value: '5',
    icon: TrendingUp,
    color: 'orange',
    change: 'Action needed',
  },
  {
    label: 'Completed Jobs',
    value: '156',
    icon: CheckCircle,
    color: 'green',
    change: '+12 this month',
  },
  {
    label: 'Total Earnings',
    value: '₹45,320',
    icon: DollarSign,
    color: 'purple',
    change: '+₹8,920 this month',
  },
];

const RECENT_BOOKINGS = [
  {
    id: '1',
    customer: 'Priya Singh',
    service: 'AC Repair',
    date: 'Today',
    time: '2:00 PM',
    status: 'pending',
    amount: '₹499',
    address: 'Sector 62, Noida',
    phone: '+91-9876543210',
  },
  {
    id: '2',
    customer: 'Amit Patel',
    service: 'AC Service',
    date: 'Tomorrow',
    time: '10:00 AM',
    status: 'confirmed',
    amount: '₹599',
    address: 'Dwarka, Delhi',
    phone: '+91-8765432109',
  },
  {
    id: '3',
    customer: 'Neha Sharma',
    service: 'AC Repair',
    date: '26 Apr',
    time: '3:30 PM',
    status: 'completed',
    amount: '₹549',
    address: 'Vikram Apartments, Delhi',
    phone: '+91-7654321098',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome back, Rohan! 👋</h2>
        <p className="opacity-90">You have 5 pending booking requests waiting for your response.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Bookings</h3>
            <Link
              to="/professional/bookings"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_BOOKINGS.map((booking, index) => (
              <BookingCard key={booking.id} booking={booking} index={index} variant="compact" />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>

          <div className="space-y-3">
            <Link
              to="/professional/bookings"
              className="block p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400 font-medium transition-colors"
            >
              📋 View Bookings
            </Link>
            <Link
              to="/professional/profile"
              className="block p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg text-green-600 dark:text-green-400 font-medium transition-colors"
            >
              👤 Edit Profile
            </Link>
            <Link
              to="/professional/earnings"
              className="block p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg text-purple-600 dark:text-purple-400 font-medium transition-colors"
            >
              💰 View Earnings
            </Link>
            <Link
              to="/professional/reviews"
              className="block p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg text-yellow-600 dark:text-yellow-400 font-medium transition-colors"
            >
              ⭐ View Reviews
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}