import { useState } from 'react';
import { motion } from 'framer-motion';
import { TabsNav, BookingCard } from '../components';

const BOOKINGS_DATA = {
  pending: [
    {
      id: 1,
      customer: 'Priya Singh',
      service: 'AC Repair',
      date: 'Today',
      time: '2:00 PM',
      address: 'Sector 62, Noida',
      amount: '₹499',
      phone: '+91-9876543210',
    },
    {
      id: 2,
      customer: 'Neha Sharma',
      service: 'AC Repair',
      date: '26 Apr',
      time: '3:30 PM',
      address: 'Vikram Apartments, Delhi',
      amount: '₹549',
      phone: '+91-7654321098',
    },
  ],
  accepted: [
    {
      id: 3,
      customer: 'Amit Patel',
      service: 'AC Service',
      date: 'Tomorrow',
      time: '10:00 AM',
      address: 'Dwarka, Delhi',
      amount: '₹599',
      phone: '+91-8765432109',
    },
  ],
  completed: [
    {
      id: 4,
      customer: 'Rajesh Kumar',
      service: 'AC Repair',
      date: '25 Apr',
      time: '5:00 PM',
      address: 'Gurgaon',
      amount: '₹499',
      phone: '+91-9999999999',
    },
  ],
};

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState(BOOKINGS_DATA);

  const handleAccept = (id) => {
    const booking = bookings.pending.find((b) => b.id === id);
    if (booking) {
      setBookings({
        ...bookings,
        pending: bookings.pending.filter((b) => b.id !== id),
        accepted: [...bookings.accepted, booking],
      });
    }
  };

  const handleReject = (id) => {
    setBookings({
      ...bookings,
      pending: bookings.pending.filter((b) => b.id !== id),
    });
  };

  const handleComplete = (id) => {
    const booking = bookings.accepted.find((b) => b.id === id);
    if (booking) {
      setBookings({
        ...bookings,
        accepted: bookings.accepted.filter((b) => b.id !== id),
        completed: [...bookings.completed, booking],
      });
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: bookings.pending.length },
    { key: 'accepted', label: 'Accepted', count: bookings.accepted.length },
    { key: 'completed', label: 'Completed', count: bookings.completed.length },
  ];

  const currentBookings = bookings[activeTab];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Bookings List */}
      <div className="space-y-4">
        {currentBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl"
          >
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No {activeTab} bookings
            </p>
          </motion.div>
        ) : (
          currentBookings.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              index={index}
              variant="full"
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
}
