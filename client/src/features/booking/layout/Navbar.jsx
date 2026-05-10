import { motion } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, ChevronDown, User, Home, Info, Briefcase, Bell, HelpCircle, Wallet, Settings, LogOut, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { serviceTypes as services } from '../../../data/serivceTypes';
import { useAuth } from '../../auth/hooks/useAuth';
import { useResetScroll, useModalScroll } from '@/hooks';

const navigationLinks = [
  { label: 'Home', to: '/', isRoute: true },
  { label: 'Services', to: '#services', isRoute: false, hasDropdown: true },
  { label: 'About', to: '/about', isRoute: true },
  { label: 'Contact', to: '/contact', isRoute: true },
];



const mobileMenuItems = [
  { label: 'Home', icon: <Home size={20} />, to: '/', type: 'route' },
  { label: 'About Us', icon: <Info size={20} />, to: '/about', type: 'route' },
  { label: 'Services', icon: <MapPin size={20} />, to: '', type: 'services' },
  { label: 'My Bookings', icon: <Briefcase size={20} />, to: '/user/bookings', type: 'route' },
  { label: 'Notifications', icon: <Bell size={20} />, to: '/notifications', type: 'route' },
  { label: 'Support / Help', icon: <HelpCircle size={20} />, to: '/support', type: 'route' },
  { label: 'Wallet', icon: <Wallet size={20} />, to: '/wallet', type: 'route' },
  { label: 'Become a Professional', icon: <Briefcase size={20} />, to: '/register/professional', type: 'route' },
  { label: 'Settings', icon: <Settings size={20} />, to: '/user/settings', type: 'route' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const mobileMenuRef = useResetScroll();
  useModalScroll(isOpen);

  // Check if user is actually logged in (not just exists but has valid data)
  const isUserLoggedIn = !!(user && (user._id || user.id || user.email));
  const isAdmin = user?.role === 'admin';

  // Filter mobile menu items based on role
  const filteredMobileMenuItems = mobileMenuItems.filter(item => {
    if (isAdmin) {
      // For admin, only show: Home, About, Services
      return ['Home', 'About Us', 'Services'].includes(item.label);
    }
    return true; // For regular users, show all items
  });

  const toServiceSlug = (serviceName) =>
    String(serviceName || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleServiceClick = (serviceName) => {
    navigate(`/services/${toServiceSlug(serviceName)}`);
    setIsServicesDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/85 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
              JJ
            </div>
            <span className="hidden md:inline text-lg font-bold tracking-tight text-white">
              JobJiffy
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 p-1.5">
          {navigationLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
              >
                <button className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-slate-300 transition-all duration-300 hover:text-white hover:bg-slate-800">
                  {link.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isServicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-50"
                  >
                    <div className="p-2 space-y-1">
                      {services.map((service) => (
                        <button
                          key={service.name}
                          onClick={() => handleServiceClick(service.name)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm text-slate-300 transition-all duration-200 hover:bg-blue-600/20 hover:text-white"
                        >
                          <span className="text-lg">{service.icon}</span>
                          <span className="font-medium">{service.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : link.isRoute ? (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.label}
                href={link.to}
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isUserLoggedIn ? (
            <>
              {!isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/user/bookings"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:text-white hover:bg-slate-800"
                  >
                    <Briefcase size={16} />
                    My Bookings
                  </Link>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={isAdmin ? '/admin' : '/user/profile'}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:brightness-110"
                >
                  <User size={16} />
                  {isAdmin ? 'Admin Panel' : 'Profile'}
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition-colors duration-300 hover:bg-slate-800 hover:text-white"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-900/30 transition-all duration-300 hover:brightness-110"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden rounded-lg border border-slate-700 p-2 text-slate-100 transition-colors duration-300 hover:bg-slate-800"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation Sidebar */}
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-16 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={mobileMenuRef}
            className="absolute top-16 left-0 right-0 bg-slate-950 border-b border-slate-800 max-h-[calc(100vh-64px)] overflow-y-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-6 space-y-1">
              {/* Main Menu Items */}
              {filteredMobileMenuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  {item.type === 'services' ? (
                    <div>
                      <button
                        onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-400">{item.icon}</span>
                          {item.label}
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Services Submenu */}
                      {isServicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700 pl-4"
                        >
                          {services.map((service) => (
                            <button
                              key={service.name}
                              onClick={() => {
                                handleServiceClick(service.name);
                                setIsOpen(false);
                                setIsServicesDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"
                            >
                              <span className="text-lg">{service.icon}</span>
                              <span>{service.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <span className="text-cyan-400">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  )}
                </motion.div>
              ))}

              {/* Conditional Professional Dashboard (mobile) */}
              {isUserLoggedIn && user?.role === 'professional' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                >
                  <NavLink
                    to="/professional/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }` }
                    >
                    <span className="text-cyan-400"><Briefcase size={18} /></span>
                    Professional Dashboard
                  </NavLink>
                </motion.div>
              )}

              {/* Conditional Admin Dashboard (mobile) */}
              {isUserLoggedIn && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                >
                  <NavLink
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }` }
                    >
                    <span className="text-cyan-400"><Briefcase size={18} /></span>
                    Admin Panel
                  </NavLink>
                </motion.div>
              )}

              {/* Divider */}
              <div className="my-4 border-t border-slate-800" />

              {/* Auth / Profile Section */}
              {isUserLoggedIn ? (
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all text-sm font-medium hover:brightness-110"
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} />
                        {isAdmin ? 'Admin Panel' : (user?.fullName || user?.name || user?.email || 'Profile')}
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Profile Submenu */}
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-2 mt-2 space-y-1 border-l-2 border-cyan-500 pl-4"
                      >
                        {isAdmin ? (
                          <Link
                            to="/admin"
                            onClick={() => {
                              setIsOpen(false);
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"
                          >
                            <Briefcase size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        ) : (
                          <>
                            <Link
                              to="/user/profile"
                              onClick={() => {
                                setIsOpen(false);
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"
                            >
                              <User size={16} />
                              <span>View Profile</span>
                            </Link>
                            <Link
                              to="/user/edit-profile"
                              onClick={() => {
                                setIsOpen(false);
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white transition-colors"
                            >
                              <User size={16} />
                              <span>Edit Profile</span>
                            </Link>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55, duration: 0.3 }}
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                      <LogIn size={18} />
                      Sign In
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55, duration: 0.3 }}
                  >
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110 transition-all text-sm font-medium"
                    >
                      <UserPlus size={18} />
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
}
