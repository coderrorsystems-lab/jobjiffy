import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Briefcase, User, Clock, DollarSign, Star, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const PROFESSIONAL_ROUTES = [
  { path: '/professional/dashboard', label: 'Dashboard', icon: Home },
  { path: '/professional/bookings', label: 'Bookings', icon: Briefcase },
  { path: '/professional/profile', label: 'Profile', icon: User },
  { path: '/professional/availability', label: 'Availability', icon: Clock },
  { path: '/professional/earnings', label: 'Earnings', icon: DollarSign },
  { path: '/professional/reviews', label: 'Reviews', icon: Star },
  { path: '/professional/settings', label: 'Settings', icon: Settings },
];

export default function ProfessionalLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative w-64 h-full bg-white dark:bg-slate-800 shadow-lg transform transition-transform z-40 md:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        initial={false}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/professional/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Briefcase size={24} className="text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">ProPanel</span>
            </Link>
          </div>

          {/* Close Button for Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-6 right-6 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {PROFESSIONAL_ROUTES.map((route) => {
              const Icon = route.icon;
              const isActive = location.pathname === route.path;

              return (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{route.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Professional Info */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Rohan Mehta</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">AC Repair & Service</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-all font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <Menu size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white ml-auto md:ml-0">
            Professional Dashboard
          </h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
