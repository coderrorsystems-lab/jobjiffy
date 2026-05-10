import { motion } from 'framer-motion';
import { Search, Sparkles, User, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../../../features/auth/services/authAPI';
import { serviceTypes as defaultPopularServices } from '../../../data/serivceTypes';
import ServiceGrid from './ServiceGrid';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

// service types moved to src/data/serivceTypes.js and imported as defaultPopularServices

export default function ServiceSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularServices, setPopularServices] = useState(defaultPopularServices);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [showingAll, setShowingAll] = useState(false);

  const toServiceSlug = (serviceName) =>
    String(serviceName || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const isUserIdSearch = (query) => /^JJ\d{4}$/i.test(query.trim());

  const searchProfessionalByUserId = async (userId) => {
    try {
      // This will need backend endpoint: GET /api/professionals/search?userId=JJ0001
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/professionals/search?userId=${userId.toUpperCase()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Professional not found');
      const data = await response.json();
      return data.data || data;
    } catch (err) {
      console.error('Error searching professional:', err);
      return null;
    }
  };

  const loadPopularServices = async ({ query = '', limit = 8 } = {}) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Filter from default services based on query
      let filtered = defaultPopularServices;
      if (query.trim()) {
        filtered = defaultPopularServices.filter(service =>
          service.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Limit results
      const result = filtered.slice(0, limit);
      setPopularServices(result.length > 0 ? result : defaultPopularServices);
    } catch (err) {
      setError('Unable to load services. Please try again.');
      setPopularServices(defaultPopularServices);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = async () => {
    const query = searchQuery.trim();
    if (!query && !showingAll) {
      setPopularServices(defaultPopularServices);
      return;
    }

    // Normalize query to lowercase for case-insensitive search
    const normalizedQuery = query.toLowerCase();
    
    // Filter services based on normalized query
    const filtered = defaultPopularServices.filter(service =>
      service.name.toLowerCase().includes(normalizedQuery)
    );

    if (filtered.length === 0 && query) {
      setError('No services found. Try another search.');
      setPopularServices(defaultPopularServices);
      return;
    }

    await loadPopularServices({ query: normalizedQuery, limit: showingAll ? 100 : 8 });
  };

  const handleViewAll = async () => {
    // Navigate to all services page
    navigate('/services');
  };

  const handleViewAllProfessionals = () => {
    // Navigate to all professionals page
    navigate('/professionals');
  };

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        // Check if searching by user ID
        if (isUserIdSearch(query)) {
          // For now, return empty as we don't have professional data locally
          setSuggestions([]);
        } else {
          // Search by service name using local dummy data
          const queryLower = query.toLowerCase();
          const servicesData = defaultPopularServices
            .filter(service =>
              service.name.toLowerCase().includes(queryLower)
            )
            .slice(0, 6)
            .map(service => ({
              ...service,
              type: 'service'
            }));
          setSuggestions(servicesData);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Section Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-sm font-semibold mb-4">
            <Sparkles size={16} />
            Popular Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What are you looking for?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browse our most popular services or search for something specific
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div className="relative max-w-2xl mx-auto" variants={itemVariants}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-blue-600 rounded-xl blur opacity-0 group-focus-within:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center gap-3 px-5 py-3 md:py-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Search
                size={20}
                className="text-slate-400 dark:text-slate-500 flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Search services, or find professionals (e.g., JJ0001)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                className="flex-1 outline-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base"
              />
            </div>

            {/* Suggestions Dropdown */}
            {(suggestions.length > 0 || searchLoading) && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {searchLoading ? (
                  <div className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">Searching...</div>
                ) : (
                  suggestions.map((item) => (
                    <motion.button
                      key={item.id || item._id}
                      type="button"
                      onClick={() => {
                        if (item.type === 'professional') {
                          navigate(`/professional/${item.userId || item._id}`);
                        } else {
                          navigate(`/services/${toServiceSlug(item.name)}`);
                        }
                      }}
                      className="w-full px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                      whileHover={{ x: 4 }}
                    >
                      {item.type === 'professional' ? (
                        <>
                          <User className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {item.userId || item.id}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {item.fullName || 'Professional'} • {item.serviceName || 'Service Professional'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-xl">{item.icon || '🛠'}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {item.count} professionals
                            </div>
                          </div>
                        </>
                      )}
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </div>

          {/* Search Hint */}
          {searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2"
            >
              {isUserIdSearch(searchQuery) ? (
                <>
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  Searching for professional ID
                </>
              ) : (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                  Searching for services or use format: JJ0001-JJ9999
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.div className="max-w-2xl mx-auto text-sm text-red-300 bg-red-900/30 border border-red-600/30 rounded-lg px-4 py-3" variants={itemVariants}>
            {error}
          </motion.div>
        )}

        {/* Popular Services Grid */}
        <ServiceGrid
          services={popularServices}
          onServiceClick={(s) => navigate(`/services/${toServiceSlug(s.name)}`)}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          loading={loading}
        />

        {/* CTA */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" variants={itemVariants}>
          <button
            type="button"
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            View All Services
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={handleViewAllProfessionals}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            View All Professionals
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
