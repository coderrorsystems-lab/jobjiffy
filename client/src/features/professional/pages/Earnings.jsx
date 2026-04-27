import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { EarningsCard, PaymentTable } from '../components';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const EARNINGS_DATA = {
  today: '₹2,499',
  thisMonth: '₹58,920',
  total: '₹2,45,320',
};

const RECENT_PAYMENTS = [
  {
    id: 1,
    customer: 'Priya Singh',
    service: 'AC Repair',
    date: '26 Apr 2024',
    amount: '₹499',
    status: 'completed',
  },
  {
    id: 2,
    customer: 'Amit Patel',
    service: 'AC Service',
    date: '25 Apr 2024',
    amount: '₹599',
    status: 'completed',
  },
  {
    id: 3,
    customer: 'Rajesh Kumar',
    service: 'AC Repair',
    date: '24 Apr 2024',
    amount: '₹499',
    status: 'completed',
  },
  {
    id: 4,
    customer: 'Neha Sharma',
    service: 'AC Maintenance',
    date: '23 Apr 2024',
    amount: '₹399',
    status: 'completed',
  },
  {
    id: 5,
    customer: 'Vikram Patel',
    service: 'AC Repair',
    date: '22 Apr 2024',
    amount: '₹549',
    status: 'completed',
  },
];

export default function Earnings() {
  return (
    <div className="space-y-8">
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Earnings */}
        <EarningsCard
          label="Today's Earnings"
          value={EARNINGS_DATA.today}
          icon={DollarSign}
          change="From 2 completed jobs"
          index={0}
        />

        {/* This Month Earnings */}
        <EarningsCard
          label="This Month"
          value={EARNINGS_DATA.thisMonth}
          icon={Calendar}
          change="+12% from last month"
          index={1}
        />

        {/* Total Earnings */}
        <EarningsCard
          label="Total Earnings"
          value={EARNINGS_DATA.total}
          icon={TrendingUp}
          change="All-time earnings"
          index={2}
        />
      </div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment History</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <PaymentTable payments={RECENT_PAYMENTS} />
        </div>
      </motion.div>
    </div>
  );
}
