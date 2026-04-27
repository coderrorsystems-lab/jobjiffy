import { motion } from 'framer-motion';
import { TrendingUp, Clock, Star, Eye, Users, Calendar, Plus, MessageSquare, AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';
import StatCard from '../components/dashboard/StatCard';
import QuickAction from '../components/dashboard/QuickAction';
import { BookingItem } from '../features/booking';

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
    customerName: 'Priya Singh',
    service: 'AC Repair',
    dateTime: 'Today, 2:00 PM',
    location: 'Sector 62, Noida',
    amount: 499,
    customerPhone: '+91-9876543210',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Amit Patel',
    service: 'AC Service',
    dateTime: 'Tomorrow, 10:00 AM',
    location: 'Dwarka, Delhi',
    amount: 599,
    customerPhone: '+91-8765432109',
    status: 'confirmed',
  },
  {
    id: '3',
    customerName: 'Neha Sharma',
    service: 'AC Repair',
    dateTime: '26 Apr, 3:30 PM',
    location: 'Vikram Apartments, Delhi',
    amount: 549,
    customerPhone: '+91-7654321098',
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
    <div className="min-h-screen bg-slate-950 pt-20">
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12"
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
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Professional Dashboard
              </h1>
              <p className="text-slate-400">Welcome back, {dummyProfessionalData.name}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg w-fit"
            >
              <Plus size={18} />
              Add Service
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <StatCard
            label="Total Earnings"
            value={dummyProfessionalData.totalEarnings}
            icon={TrendingUp}
            color="green"
            trend={{ positive: true, percentage: 12 }}
            index={0}
          />
          <StatCard
            label="This Month"
            value={dummyProfessionalData.monthlyEarnings}
            icon={Calendar}
            color="orange"
            trend={{ positive: true, percentage: 8 }}
            index={1}
          />
          <StatCard
            label="Completed Jobs"
            value={dummyProfessionalData.completedJobs}
            icon={Clock}
            color="cyan"
            trend={{ positive: false, percentage: 2 }}
            index={2}
          />
          <StatCard
            label="Rating"
            value={dummyProfessionalData.rating}
            icon={Star}
            color="yellow"
            index={3}
          />
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <StatCard
            label="Active Bookings"
            value={dummyProfessionalData.activeBookings}
            icon={AlertCircle}
            color="orange"
            index={0}
          />
          <StatCard
            label="Profile Views"
            value={dummyProfessionalData.profileViews}
            icon={Eye}
            color="purple"
            index={1}
          />
          <StatCard
            label="Reviews"
            value={dummyProfessionalData.reviews}
            icon={Users}
            color="cyan"
            index={2}
          />
          <StatCard
            label="Response Rate"
            value={dummyProfessionalData.responseRate}
            icon={MessageSquare}
            color="green"
            index={3}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              icon={Plus}
              label="New Job"
              description="Add availability for new jobs"
              color="blue"
              index={0}
            />
            <QuickAction
              icon={MessageSquare}
              label="Messages"
              description="Chat with customers"
              color="green"
              index={1}
            />
            <QuickAction
              icon={Calendar}
              label="Schedule"
              description="Manage your calendar"
              color="orange"
              index={2}
            />
            <QuickAction
              icon={TrendingUp}
              label="Analytics"
              description="View performance"
              color="purple"
              index={3}
            />
          </div>
        </motion.div>

        {/* Upcoming Bookings */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Bookings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking, index) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                index={index}
                onAccept={handleAcceptBooking}
                onReject={handleRejectBooking}
              />
            ))}
          </div>
        </motion.div>

        {/* Performance Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Recent Reviews */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Reviews</h3>
            <div className="space-y-4">
              {[
                { name: 'Rajesh Kumar', rating: 5, text: 'Excellent service! Highly professional.' },
                { name: 'Anjali Singh', rating: 4.5, text: 'Very quick and efficient work.' },
                { name: 'Vikram Patel', rating: 5, text: 'Best in the area, highly recommend!' },
              ].map((review, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white">{review.name}</p>
                    <span className="text-yellow-400 text-sm">★ {review.rating}</span>
                  </div>
                  <p className="text-sm text-slate-400">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Earnings Chart Placeholder */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Monthly Earnings</h3>
            <div className="h-60 flex items-end justify-around gap-2">
              {[65, 45, 78, 92, 70, 85, 88].map((height, index) => (
                <motion.div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${height}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className="text-xs text-white text-center mt-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
