import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../../services/serviceAPI';

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

const defaultPopularServices = [
  { id: 'default-1', icon: '🔧', name: 'AC Repair & Service', count: '2.5K+' },
  { id: 'default-2', icon: '🚿', name: 'Plumbing', count: '3.2K+' },
  { id: 'default-3', icon: '🧹', name: 'Home Cleaning', count: '4.8K+' },
  { id: 'default-4', icon: '💇', name: 'Beauty & Salon', count: '5.1K+' },
  { id: 'default-5', icon: '📱', name: 'Electronics Repair', count: '1.9K+' },
  { id: 'default-6', icon: '🏠', name: 'Painting', count: '2.3K+' },
  { id: 'default-7', icon: '⚡', name: 'Electrical', count: '2.7K+' },
  { id: 'default-8', icon: '🛏️', name: 'Furniture Repair', count: '1.4K+' },
];

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

  const loadPopularServices = async ({ query = '', limit = 8 } = {}) => {
    setLoading(true);
    setError('');

    try {
      const result = await fetchServices({ query, limit });
      setPopularServices(result?.data || []);
    } catch (err) {
      setError('Services load nahi ho pa rahi. Thodi der baad try karo.');
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

    await loadPopularServices({ query, limit: showingAll ? 100 : 8 });
  };

  const handleViewAll = async () => {
    setShowingAll(true);
    await loadPopularServices({ query: searchQuery.trim(), limit: 100 });
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
        const result = await fetchServices({ query, limit: 6 });
        setSuggestions(result?.data || []);
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
                placeholder="Search for services, professionals, or anything..."
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
                  suggestions.map((service) => (
                    <motion.button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        navigate(`/services/${toServiceSlug(service.name)}`);
                      }}
                      className="w-full px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-xl">{service.icon || '🛠'}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {service.count} professionals
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div className="max-w-2xl mx-auto text-sm text-red-300 bg-red-900/30 border border-red-600/30 rounded-lg px-4 py-3" variants={itemVariants}>
            {error}
          </motion.div>
        )}

        {/* Popular Services Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="col-span-full text-center text-slate-400 py-6">Loading services...</div>
          ) : (
            popularServices.map((service) => (
            <motion.button
              key={service.id}
              type="button"
              onClick={() => navigate(`/services/${toServiceSlug(service.name)}`)}
              className="group relative p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 text-center"
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
              }}
            >
              <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
                {service.icon || '🛠'}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm md:text-base">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {service.count} pros
              </p>

              {/* Gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                aria-hidden="true"
              />
            </motion.button>
            ))
          )}
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" variants={itemVariants}>
          <button
            type="button"
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            {showingAll ? 'All Services Loaded' : 'View All Services'}
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
