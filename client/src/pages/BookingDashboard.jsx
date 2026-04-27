import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, MessageCircle, Phone, Navigation, Star, RotateCcw, XCircle, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';

// DUMMY API DATA
const dummyBookings = [
  {
    id: 'BK001',
    serviceType: 'AC Repair & Service',
    serviceIcon: '❄️',
    professionalName: 'Rohan Mehta',
    professionalPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    status: 'pending',
    date: '2026-04-28',
    time: '10:00 AM',
    address: 'Block A, Sector 62, Noida',
    price: 499,
    createdAt: '2026-04-25 2:30 PM',
  },
  {
    id: 'BK002',
    serviceType: 'Home Cleaning',
    serviceIcon: '🧹',
    professionalName: 'Sana Khan',
    professionalPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    status: 'accepted',
    date: '2026-04-26',
    time: '2:00 PM',
    address: 'Vikram Apartments, Delhi',
    price: 599,
    createdAt: '2026-04-24 5:15 PM',
  },
  {
    id: 'BK003',
    serviceType: 'Plumbing',
    serviceIcon: '🚿',
    professionalName: 'Amit Kumar',
    professionalPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 4.7,
    status: 'in-progress',
    date: '2026-04-25',
    time: '11:00 AM',
    address: 'Dwarka, New Delhi',
    price: 399,
    createdAt: '2026-04-24 9:00 AM',
  },
  {
    id: 'BK004',
    serviceType: 'Electrical',
    serviceIcon: '⚡',
    professionalName: 'Ravi Singh',
    professionalPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.6,
    status: 'completed',
    date: '2026-04-23',
    time: '3:00 PM',
    address: 'Greater Noida',
    price: 450,
    createdAt: '2026-04-22 1:00 PM',
  },
  {
    id: 'BK005',
    serviceType: 'Beauty & Salon',
    serviceIcon: '💇',
    professionalName: 'Priya Sharma',
    professionalPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    status: 'completed',
    date: '2026-04-20',
    time: '5:00 PM',
    address: 'South Delhi',
    price: 299,
    createdAt: '2026-04-19 10:30 AM',
  },
  {
    id: 'BK006',
    serviceType: 'Electronics Repair',
    serviceIcon: '📱',
    professionalName: 'Vikram Patel',
    professionalPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    status: 'cancelled',
    date: '2026-04-21',
    time: '4:00 PM',
    address: 'Sector 15, Noida',
    price: 349,
    createdAt: '2026-04-20 3:45 PM',
  },
];

// Status configuration
const statusConfig = {
  pending: { color: 'yellow', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-400', label: 'Pending', icon: AlertCircle },
  accepted: { color: 'blue', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400', label: 'Accepted', icon: CheckCircle },
  'in-progress': { color: 'orange', bgColor: 'bg-orange-500/10', textColor: 'text-orange-400', label: 'In Progress', icon: Clock },
  completed: { color: 'green', bgColor: 'bg-green-500/10', textColor: 'text-green-400', label: 'Completed', icon: CheckCircle },
  cancelled: { color: 'red', bgColor: 'bg-red-500/10', textColor: 'text-red-400', label: 'Cancelled', icon: XCircle },
};

const filterTabs = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

export default function BookingDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [bookings, setBookings] = useState(dummyBookings);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Calculate stats
  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => ['accepted', 'in-progress'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }), [bookings]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'All') return bookings;
    if (selectedFilter === 'In Progress') return bookings.filter(b => b.status === 'in-progress');
    return bookings.filter(b => b.status === selectedFilter.toLowerCase());
  }, [selectedFilter, bookings]);

  const handleDelete = (bookingId) => {
    setDeleteConfirm(bookingId);
  };

  const confirmDelete = () => {
    setBookings(bookings.filter(b => b.id !== deleteConfirm));
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-slate-400">Track and manage all your service bookings</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {[
            { label: 'Total Bookings', value: stats.total, color: 'from-cyan-500 to-blue-600', icon: '📋' },
            { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-amber-600', icon: '⏳' },
            { label: 'Active', value: stats.active, color: 'from-orange-500 to-red-600', icon: '🔥' },
            { label: 'Completed', value: stats.completed, color: 'from-green-500 to-emerald-600', icon: '✅' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-slate-800 shadow-lg`}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
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

        {/* Filter Tabs */}
        <motion.div
          className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {filterTabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 text-sm ${
                selectedFilter === tab
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-slate-900/50 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {filteredBookings.map((booking, index) => (
              <BookingCard key={booking.id} booking={booking} index={index} onDelete={handleDelete} />
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirm !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking, index, onDelete }) {
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
      whileHover={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="p-6 md:flex md:items-center md:justify-between">
        {/* Left Section: Service & Professional Info */}
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-start gap-4 mb-4">
            {/* Professional Photo */}
            <motion.img
              src={booking.professionalPhoto}
              alt={booking.professionalName}
              className="w-16 h-16 rounded-lg object-cover border border-slate-700"
              whileHover={{ scale: 1.05 }}
            />

            {/* Service & Professional Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-sm text-slate-400">Service</p>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">{booking.serviceIcon}</span>
                    {booking.serviceType}
                  </h3>
                </div>
                {/* Status Badge */}
                <motion.div
                  className={`${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <StatusIcon size={14} />
                  {config.label}
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-medium text-slate-300">{booking.professionalName}</p>
                <div className="flex items-center gap-0.5">
                  <span className="text-yellow-400">★</span>
                  <span className="text-xs text-slate-400">{booking.rating}</span>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-cyan-400">#</span>
                  <span>{booking.id}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={16} className="text-cyan-400" />
                  <span>{booking.date}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={16} className="text-cyan-400" />
                  <span>{booking.time}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <DollarSign size={16} className="text-green-400" />
                  <span className="font-semibold">₹{booking.price}</span>
                </div>
              </div>

              {/* Address & Created Date */}
              <div className="flex items-center justify-between gap-2 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="truncate">{booking.address}</span>
                </div>
                <span>Booked: {booking.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4">
          <ActionButtons status={booking.status} bookingId={booking.id} onDelete={onDelete} />
        </div>
      </div>
    </motion.div>
  );
}

// Action Buttons based on Status
function ActionButtons({ status, bookingId, onDelete }) {
  const buttonClass = 'flex-1 md:flex-initial px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95';

  if (status === 'pending') {
    return (
      <div className="flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClass} bg-red-600 hover:bg-red-700 text-white`}
        >
          <XCircle size={16} />
          Cancel
        </motion.button>
        <motion.button
          onClick={() => onDelete(bookingId)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-white`}
        >
          <XCircle size={16} />
          Delete
        </motion.button>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="flex gap-2 flex-wrap md:flex-col">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white`}>
          <MessageCircle size={16} />
          Chat
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-white`}>
          <Phone size={16} />
          Call
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-white`}>
          <Navigation size={16} />
          Track
        </motion.button>
        <motion.button
          onClick={() => onDelete(bookingId)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs`}
        >
          <XCircle size={14} />
          Delete
        </motion.button>
      </div>
    );
  }

  if (status === 'in-progress') {
    return (
      <div className="flex gap-2 flex-wrap md:flex-col">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-green-600 hover:bg-green-700 text-white flex-1`}>
          <MessageCircle size={16} />
          Live Chat
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-white flex-1`}>
          <Clock size={16} />
          Status
        </motion.button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="flex gap-2 flex-wrap md:flex-col">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-yellow-600 hover:bg-yellow-700 text-white flex-1`}>
          <Star size={16} />
          Rate
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white flex-1`}>
          <RotateCcw size={16} />
          Rebook
        </motion.button>
        <motion.button
          onClick={() => onDelete(bookingId)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs flex-1`}
        >
          <XCircle size={14} />
          Delete
        </motion.button>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="flex gap-2 flex-wrap md:flex-col">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white flex-1`}>
          <RotateCcw size={16} />
          New Booking
        </motion.button>
        <motion.button
          onClick={() => onDelete(bookingId)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClass} bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs flex-1`}
        >
          <XCircle size={14} />
          Delete
        </motion.button>
      </div>
    );
  }
}

// Confirm Delete Modal Component
function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <XCircle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Booking?</h3>
            <p className="text-slate-400 text-sm mt-1">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-6">
          <p className="text-xs text-red-400 font-medium">
            💡 Deleted bookings will be permanently removed from your history.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="text-6xl mb-6" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        📭
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-2">No Bookings Yet</h3>
      <p className="text-slate-400 mb-8 text-center max-w-md">You haven't made any bookings yet. Start exploring our services and book your first appointment!</p>

      <motion.a
        href="/services"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:brightness-110 transition-all"
      >
        Explore Services
        <ArrowRight size={18} />
      </motion.a>
    </motion.div>
  );
}
