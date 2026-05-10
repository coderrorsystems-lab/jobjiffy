import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { professionals as dummyProfessionals } from '../../../data/professionals';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};


export default function CategoriesSection() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  // Fetch professionals on component mount (only first 10)
  useEffect(() => {
    fetchTopProfessionals();
  }, []);

  const toServiceSlug = (serviceName) =>
    String(serviceName || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  // Fetch top-rated professionals (using dummy data - only first 10)
  const fetchTopProfessionals = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const firstTen = dummyProfessionals.slice(0, 10);
      setProfessionals(firstTen);
    } catch (err) {
      console.error('Error loading professionals:', err);
      setError('Failed to load professionals. Please try again.');
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreAll = () => {
    navigate('/professionals');
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div className="text-center" variants={categoryVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Top Rated Professionals
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover our most highly-rated professionals across all services
          </p>
        </motion.div>

        {error && (
          <motion.div className="max-w-2xl mx-auto text-sm text-red-300 bg-red-900/30 border border-red-600/30 rounded-lg px-4 py-3" variants={categoryVariants}>
            {error}
          </motion.div>
        )}

        {/* Professionals Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : professionals.length > 0 ? (
              professionals.map((prof) => {
                const serviceName = prof.serviceName || prof.specialization || 'Professional Service';
                const icon = '🌟';
                const color = 'from-blue-500 to-blue-600';

                return (
                  <motion.button
                    key={prof._id || prof.id}
                    onClick={() => navigate(`/professional/${prof.userId || prof._id}`)}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-48 md:h-56"
                    variants={categoryVariants}
                    whileHover={{
                      y: -12,
                      boxShadow:
                        '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Background Gradient */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                      }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                      {/* Icon and Info */}
                      <div className="text-left">
                        <motion.div
                          className={`text-4xl md:text-5xl mb-4 inline-block`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          {icon}
                        </motion.div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white text-left line-clamp-2">
                          {prof.fullName || 'Professional'}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                          {serviceName}
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs md:text-sm font-semibold">
                          ⭐ {prof.rating || 4.5}
                        </span>
                        <motion.div
                          className={`p-3 rounded-full bg-gradient-to-r ${color} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight size={20} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-slate-900/0 to-slate-900/0 group-hover:from-slate-900/5 group-hover:to-slate-900/10 dark:group-hover:from-slate-900/20 dark:group-hover:to-slate-900/30 transition-all duration-300"
                      aria-hidden="true"
                    />
                  </motion.button>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                No professionals found
              </div>
            )}
          </motion.div>

        {/* Pagination Controls */}
        {/* Removed - no pagination on home */}

        {/* Action Button */}
        <motion.div className="flex justify-center" variants={categoryVariants}>
          <motion.button
            onClick={() => navigate('/professionals')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 group"
          >
            Show All Professionals
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </motion.button>
        </motion.div>


      </motion.div>
    </div>
  );
}
