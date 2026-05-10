import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Loader } from 'lucide-react';
import { professionals as dummyProfessionals } from "../../../data/professionals";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AllProfessionalsPage() {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating-high'); // rating-high, rating-low, name
  const [currentPage, setCurrentPage] = useState(1);
  const professionalsPerPage = 12;

  // Load and sort professionals
  useEffect(() => {
    loadAndSortProfessionals();
  }, [sortBy]);

  const loadAndSortProfessionals = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    let sorted = [...dummyProfessionals];

    if (sortBy === 'rating-high') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'rating-low') {
      sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    setProfessionals(sorted);
    setCurrentPage(1);
    setLoading(false);
  };

  // Get professionals for current page
  const getCurrentPageProfessionals = () => {
    const startIndex = (currentPage - 1) * professionalsPerPage;
    const endIndex = startIndex + professionalsPerPage;
    return professionals.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(professionals.length / professionalsPerPage);
  const currentProfessionals = getCurrentPageProfessionals();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
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
            All Professionals
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover top-rated professionals for your projects ({professionals.length} available)
          </p>
        </motion.div>

        {/* Sorting Controls */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sort By:
            </p>
            <div className="flex gap-3 flex-wrap">
              <motion.button
                onClick={() => setSortBy('rating-high')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  sortBy === 'rating-high'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⭐ Rating (High)
              </motion.button>
              <motion.button
                onClick={() => setSortBy('rating-low')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  sortBy === 'rating-low'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⭐ Rating (Low)
              </motion.button>
              <motion.button
                onClick={() => setSortBy('name')}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  sortBy === 'name'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                A-Z Name
              </motion.button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">
                {(currentPage - 1) * professionalsPerPage + 1}
              </span> to{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(currentPage * professionalsPerPage, professionals.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-900 dark:text-white">{professionals.length}</span>
            </p>
          </div>
        </motion.div>

        {/* Professionals Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentProfessionals.map((prof) => (
              <motion.button
                key={prof._id}
                onClick={() => navigate(`/professional/${prof.userId || prof._id}`)}
                className="group relative h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 p-6"
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.2)',
                }}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Avatar */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {prof.photo || '👤'}
                    </div>
                  </div>

                  {/* Name and ID */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center line-clamp-2 mb-2">
                    {prof.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 text-center mb-3">
                    ID: {prof.userId || prof._id}
                  </p>

                  {/* Service */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4 line-clamp-2 flex-grow">
                    {prof.serviceName}
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-3" />

                  {/* Rating and Reviews */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.round(prof.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {prof.rating || 4.5}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      ({prof.reviewCount || 0} reviews)
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                    <motion.div
                      className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      → View Profile
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex flex-col items-center gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
                  {totalPages}
                </span>
              </div>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
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
