import { motion } from 'framer-motion';
import { Search, Zap, LogIn, UserPlus, User, Briefcase } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');

  const words = ['Professional', 'Trusted', 'Affordable', 'Premium'];
  const [currentWord, setCurrentWord] = useState(0);

  // Rotate words every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isUserIdSearch = (query) => /^JJ\d{4}$/i.test(query.trim());

  const toServiceSlug = (serviceName) =>
    String(serviceName || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleSearchClick = () => {
    const query = serviceType.trim();
    if (!query) return;

    if (isUserIdSearch(query)) {
      navigate(`/professional/${query.toUpperCase()}`);
    } else {
      navigate(`/services/${toServiceSlug(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 pt-20 md:pt-32 pb-16 md:pb-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-orange-200 dark:bg-orange-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          animate={{
            x: [0, -20, 10, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          variants={textVariants}
          custom={0}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm font-medium">
            <Zap size={16} className="text-blue-600 dark:text-blue-300" />
            Trusted by 10,000+ Users worldwide
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              <motion.span
                className="block"
                variants={textVariants}
                custom={1}
              >
                Quality Services,
              </motion.span>
              <motion.span
                className="block"
                variants={textVariants}
                custom={2}
              >
                One Click Away
              </motion.span>
            </h1>

            {/* Animated word */}
            <div className="h-12 md:h-14 mt-4 flex items-center justify-center">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
              >
                {words[currentWord]} Services
              </motion.span>
            </div>
          </div>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            variants={textVariants}
            custom={3}
          >
            Connect with verified professionals for home services. Fast, reliable, and transparent pricing.
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          variants={textVariants}
          custom={4}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500 pointer-events-none"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-1 md:p-2">
              <div className="flex flex-col md:flex-row gap-3 p-4 md:p-6">
                <div className="flex-1 relative">
                  <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
                    Service Type or Pro ID
                  </label>
                  <input
                    type="text"
                    placeholder="Plumbing, AC Repair, or JJ0001..."
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full mt-2 text-base md:text-lg bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  
                  {/* Search Type Hint */}
                  {serviceType.trim() && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      {isUserIdSearch(serviceType) ? (
                        <>
                          <User className="w-3 h-3 text-blue-500" />
                          Professional ID
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3 h-3 text-orange-500" />
                          Service Search
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="h-px md:h-auto md:w-px bg-slate-200 dark:bg-slate-600"></div>

                <div className="flex-1">
                  <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full mt-2 text-base md:text-lg bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                <motion.button
                  onClick={handleSearchClick}
                  disabled={!serviceType.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="md:ml-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search size={20} />
                  <span className="hidden md:inline">Search</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          variants={textVariants}
          custom={5}
        >
          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-shadow duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <LogIn size={18} />
            Sign In
          </motion.button>
          <motion.button
            onClick={() => navigate('/register/user')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-semibold border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <UserPlus size={18} />
            Join as User
          </motion.button>
          <motion.button
            onClick={() => navigate('/register/professional')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <UserPlus size={18} />
            Join as Professional
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Verified Pros', value: '50K+' },
            { label: 'Happy Users', value: '100K+' },
            { label: 'Services', value: '150+' },
            { label: 'On-time Rate', value: '98%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center p-4"
              variants={textVariants}
              custom={6 + idx}
            >
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
