import { motion } from 'framer-motion';
import { ArrowRight, Loader, ArrowLeft } from 'lucide-react';
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

export default function AllProfessionals() {
  const navigate = useNavigate();
  const [groupedProfessionals, setGroupedProfessionals] = useState({});
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState('services'); // 'services' or 'professionals'
  const categoriesPerPage = 9;
  const professionalsPerPage = 9;

  // Group professionals by service on component mount
  useEffect(() => {
    groupProfessionalsByService();
  }, []);

  // Group professionals by service name
  const groupProfessionalsByService = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      // Group professionals by service
      const grouped = {};
      dummyProfessionals.forEach(prof => {
        const serviceName = prof.serviceName || 'Professional Service';
        if (!grouped[serviceName]) {
          grouped[serviceName] = [];
        }
        grouped[serviceName].push(prof);
      });

      // Sort services alphabetically and get unique service names
      const uniqueServices = Object.keys(grouped).sort();
      
      setGroupedProfessionals(grouped);
      setServiceCategories(uniqueServices);
      setTotalPages(Math.ceil(uniqueServices.length / categoriesPerPage));
      setCurrentPage(1);
      setViewMode('services');
    } catch (err) {
      console.error('Error loading professionals:', err);
      setError('Failed to load professionals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle service selection
  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
    setViewMode('professionals');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go back to services view
  const handleBackToServices = () => {
    setSelectedService(null);
    setViewMode('services');
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get services for current page
  const getServicesForCurrentPage = () => {
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return serviceCategories.slice(startIndex, endIndex);
  };

  // Get professionals for selected service
  const getProfessionalsForService = () => {
    if (!selectedService) return [];
    const professionals = groupedProfessionals[selectedService] || [];
    
    // Apply pagination
    const startIndex = (currentPage - 1) * professionalsPerPage;
    const endIndex = startIndex + professionalsPerPage;
    return professionals.slice(startIndex, endIndex);
  };

  // Calculate total pages based on view mode
  const getTotalPages = () => {
    if (viewMode === 'services') {
      return Math.ceil(serviceCategories.length / categoriesPerPage);
    } else if (selectedService) {
      return Math.ceil((groupedProfessionals[selectedService]?.length || 0) / professionalsPerPage);
    }
    return 1;
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
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 py-12">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Back to Home Button */}
          <motion.div className="flex justify-start" variants={categoryVariants}>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 hover:border-cyan-500/60 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <ArrowLeft size={18} />
              Back to Home
            </motion.button>
          </motion.div>

          {/* Header */}
          <motion.div className="text-center" variants={categoryVariants}>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {viewMode === 'services' ? 'All Services' : selectedService}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              {viewMode === 'services' 
                ? `Browse all service categories (${serviceCategories.length} total services)` 
                : `All professionals offering ${selectedService}`}
            </p>
          </motion.div>

          {error && (
            <motion.div className="max-w-2xl mx-auto text-sm text-red-300 bg-red-900/30 border border-red-600/30 rounded-lg px-4 py-3" variants={categoryVariants}>
              {error}
            </motion.div>
          )}

          {/* Services View */}
          {viewMode === 'services' ? (
            <>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {getServicesForCurrentPage().map((serviceName) => (
                    <motion.button
                      key={serviceName}
                      onClick={() => handleServiceClick(serviceName)}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-8 text-left transition-all duration-300 h-64"
                      variants={categoryVariants}
                      whileHover={{
                        y: -12,
                        boxShadow:
                          '0 25px 50px -12px rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="text-5xl mb-4">🏷️</div>
                          <h3 className="text-2xl font-bold text-white line-clamp-2">
                            {serviceName}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold">
                            {groupedProfessionals[serviceName]?.length || 0} professionals
                          </span>
                          <motion.div
                            className="p-3 rounded-full bg-white/20 text-white group-hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                          >
                            <ArrowRight size={20} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Background gradient overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10"
                        aria-hidden="true"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </>
          ) : (
            /* Professionals View */
            <>
              {/* Back button */}
              <motion.button
                onClick={handleBackToServices}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium transition-all duration-300 mb-6"
                variants={categoryVariants}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={18} />
                Back to Services
              </motion.button>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {getProfessionalsForService().map((prof) => (
                    <motion.button
                      key={prof._id || prof.id}
                      onClick={() => navigate(`/professional/${prof.userId || prof._id}`)}
                      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 p-6"
                      variants={categoryVariants}
                      whileHover={{
                        y: -8,
                        boxShadow:
                          '0 20px 40px -10px rgba(59, 130, 246, 0.15)',
                      }}
                    >
                      {/* Content */}
                      <div className="space-y-4">
                        {/* Icon and Name */}
                        <div>
                          <div className="text-4xl mb-3">🌟</div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                            {prof.fullName || 'Professional'}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            ID: {prof.userId || prof._id}
                          </p>
                        </div>

                        {/* Bio */}
                        {prof.bio && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {prof.bio}
                          </p>
                        )}

                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100/20 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm font-semibold">
                            ⭐ {prof.rating || 4.5}
                          </span>
                          <span className="text-xs text-slate-500">
                            {prof.reviewCount || 0} reviews
                          </span>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <motion.div
                        className="absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* Pagination Controls */}
          {currentTotalPages > 1 && (
            <motion.div className="flex flex-col items-center gap-4" variants={categoryVariants}>
              {/* Info */}
              <div className="text-center">
                {viewMode === 'services' ? (
                  <>
                    <p className="text-slate-300 text-sm mb-2">
                      Showing {(currentPage - 1) * categoriesPerPage + 1} to{' '}
                      {Math.min(currentPage * categoriesPerPage, serviceCategories.length)} of{' '}
                      {serviceCategories.length}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300 text-sm mb-2">
                      Showing {(currentPage - 1) * professionalsPerPage + 1} to{' '}
                      {Math.min(currentPage * professionalsPerPage, groupedProfessionals[selectedService]?.length || 0)} of{' '}
                      {groupedProfessionals[selectedService]?.length || 0}
                    </p>
                  </>
                )}
              </div>

              {/* Pagination Buttons */}
              <div className="flex justify-center items-center gap-4">
                <motion.button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                <div className="flex items-center gap-2 min-w-[160px] justify-center">
                  <span className="text-white font-semibold text-lg">
                    Page {currentPage} of {currentTotalPages}
                  </span>
                </div>

                <motion.button
                  onClick={handleNextPage}
                  disabled={currentPage === currentTotalPages || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}


        </motion.div>
      </div>
    </div>
  );
}
