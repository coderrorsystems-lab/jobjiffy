import { motion } from 'framer-motion';
import { TrendingUp, Clock, Star, Eye, Users, Calendar, Plus, MessageSquare, AlertCircle, ArrowLeft, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';

// Dummy data for professional
const dummyProfessionalData = {
  name: 'Rohan Mehta',
  service: 'AC Repair & Service',
  rating: 4.8,
  reviews: 234,
  totalEarnings: '₹45,320',
  monthlyEarnings: '₹8,920',
  completedJobs: 156,
  activeBookings: 3,
  profileViews: 892,
  responseRate: '98%',
};

const dummyBookings = [
  {
    id: '1',
    UserName: 'Priya Singh',
    service: 'AC Repair',
    dateTime: 'Today, 2:00 PM',
    location: 'Sector 62, Noida',
    amount: 499,
    UserPhone: '+91-9876543210',
    status: 'pending',
  },
  {
    id: '2',
    UserName: 'Amit Patel',
    service: 'AC Service',
    dateTime: 'Tomorrow, 10:00 AM',
    location: 'Dwarka, Delhi',
    amount: 599,
    UserPhone: '+91-8765432109',
    status: 'confirmed',
  },
  {
    id: '3',
    UserName: 'Neha Sharma',
    service: 'AC Repair',
    dateTime: '26 Apr, 3:30 PM',
    location: 'Vikram Apartments, Delhi',
    amount: 549,
    UserPhone: '+91-7654321098',
    status: 'pending',
  },
];

export default function ProfessionalDashboard() {
  useWindowScroll(true);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(dummyBookings);

  const handleAcceptBooking = (bookingId) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'confirmed' } : b
    ));
  };

  const handleRejectBooking = (bookingId) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <motion.div
        className="max-w-7xl mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Professional Dashboard
              </h1>
              <p className="text-slate-400">Welcome back, {dummyProfessionalData.name}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl w-fit shadow-lg shadow-cyan-500/30"
            >
              <Plus size={18} />
              Add Service
            </motion.button>
          </div>
        </motion.div>

        {/* Primary Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {[
            { label: 'Total Earnings', value: dummyProfessionalData.totalEarnings, color: 'from-green-500 to-emerald-600', icon: '💰' },
            { label: 'This Month', value: dummyProfessionalData.monthlyEarnings, color: 'from-cyan-500 to-blue-600', icon: '📊' },
            { label: 'Completed Jobs', value: dummyProfessionalData.completedJobs, color: 'from-orange-500 to-red-600', icon: '✅' },
            { label: 'Rating', value: `${dummyProfessionalData.rating} ⭐`, color: 'from-yellow-500 to-amber-600', icon: '⭐' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-slate-800 shadow-lg`}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-4xl opacity-50">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { label: 'Active Bookings', value: dummyProfessionalData.activeBookings, color: 'from-orange-500 to-red-600', icon: '📅' },
            { label: 'Profile Views', value: dummyProfessionalData.profileViews, color: 'from-purple-500 to-pink-600', icon: '👁️' },
            { label: 'Reviews', value: dummyProfessionalData.reviews, color: 'from-cyan-500 to-blue-600', icon: '💬' },
            { label: 'Response Rate', value: dummyProfessionalData.responseRate, color: 'from-green-500 to-emerald-600', icon: '⚡' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-slate-800 shadow-lg`}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-4xl opacity-50">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Plus, label: 'New Job', description: 'Add availability', color: 'from-blue-500 to-cyan-500' },
              { icon: MessageSquare, label: 'Messages', description: 'Chat with Users', color: 'from-green-500 to-emerald-500' },
              { icon: Calendar, label: 'Schedule', description: 'Manage your calendar', color: 'from-orange-500 to-red-500' },
              { icon: TrendingUp, label: 'Analytics', description: 'View performance', color: 'from-purple-500 to-pink-500' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  className={`bg-gradient-to-br ${action.color} rounded-xl p-6 text-left border border-slate-800 hover:shadow-lg transition-all group`}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05, duration: 0.5 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white mb-1">{action.label}</p>
                      <p className="text-sm text-white/80">{action.description}</p>
                    </div>
                    <Icon className="text-white/50 group-hover:text-white transition-colors" size={24} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Bookings */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Bookings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{booking.UserName}</p>
                      <p className="text-sm text-slate-400">{booking.service}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-400" />
                    {booking.dateTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan-400" />
                    {booking.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-cyan-400" />
                    {booking.UserPhone}
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-2xl font-bold text-cyan-400">₹{booking.amount}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleAcceptBooking(booking.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Accept
                  </motion.button>
                  <motion.button
                    onClick={() => handleRejectBooking(booking.id)}
                    className="flex-1 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-all text-sm border border-red-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {/* Recent Reviews */}
          <motion.div
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            whileHover={{ y: -4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-6">Recent Reviews</h3>
            <div className="space-y-4">
              {[
                { name: 'Rajesh Kumar', rating: 5, text: 'Excellent service! Highly professional.' },
                { name: 'Anjali Singh', rating: 4.5, text: 'Very quick and efficient work.' },
                { name: 'Vikram Patel', rating: 5, text: 'Best in the area, highly recommend!' },
              ].map((review, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gradient-to-r from-slate-800 to-slate-700/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-all"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white">{review.name}</p>
                    <span className="text-yellow-400 text-sm font-semibold">⭐ {review.rating}</span>
                  </div>
                  <p className="text-sm text-slate-400">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Earnings Chart */}
          <motion.div
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            whileHover={{ y: -4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-6">Weekly Earnings</h3>
            <div className="h-60 flex items-end justify-around gap-2 px-2">
              {[65, 45, 78, 92, 70, 85, 88].map((height, index) => (
                <motion.div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer group relative"
                  style={{ height: `${height}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.35 + index * 0.05, duration: 0.5 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap">
                    ₹{Math.floor(height * 100)}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-around mt-6 text-xs text-slate-400 font-medium">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
