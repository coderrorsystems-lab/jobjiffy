import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { serviceTypes as services } from '../../data/serivceTypes';
import ServiceGrid from './home/ServiceGrid';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};



const toServiceSlug = (serviceName) =>
  String(serviceName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function AllServicesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8;

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, []);


  const getServicesForCurrentPage = () => {
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    return services.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(services.length / servicesPerPage);
  };

  const handleNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentTotalPages = getTotalPages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Fixed Back Button */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed top-24 left-6 md:left-10 z-40 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl text-slate-900 dark:text-white font-medium transition-all duration-300"
        whileHover={{ scale: 1.05, translateX: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </motion.button>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            All Services
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browse all available service categories ({services.length} services)
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <ServiceGrid
            services={getServicesForCurrentPage()}
            onServiceClick={(s) => navigate(`/services/${toServiceSlug(s.name)}`)}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            loading={loading}
            gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10"
          />
        )}

        {/* Pagination Controls */}
        {currentTotalPages > 1 && (
          <motion.div
            className="flex flex-col items-center gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Info */}
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Showing {(currentPage - 1) * servicesPerPage + 1} to{' '}
                {Math.min(currentPage * servicesPerPage, services.length)} of{' '}
                {services.length} services
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-4">
              <motion.button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-6 py-3 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Previous
              </motion.button>

              <div className="flex items-center gap-2 min-w-[160px] justify-center">
                <span className="text-slate-900 dark:text-white font-bold text-lg">
                  Page {currentPage}
                </span>
                <span className="text-slate-500 dark:text-slate-400">/</span>
                <span className="text-slate-600 dark:text-slate-400 font-semibold text-lg">
                  {currentTotalPages}
                </span>
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage === currentTotalPages || loading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next →
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
