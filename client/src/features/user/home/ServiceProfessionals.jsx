import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader, Star, MapPin, AlertCircle } from 'lucide-react';
import { fetchProfessionalsByServiceId } from '../services/homeAPI';

export default function ServiceProfessionals() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfessionals();
  }, [serviceId]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const data = await fetchProfessionalsByServiceId(serviceId);
      setProfessionals(data.professionals || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError(err.message);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      {/* Fixed Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
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
            Available Professionals
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose from {professionals.length} verified professionals for this service
          </p>
        </motion.div>

        {/* Content */}
        {error ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 bg-red-500/10 border border-red-500/20 rounded-lg p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-red-400 text-lg mb-6">{error}</p>
            <motion.button
              onClick={fetchProfessionals}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : professionals.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 bg-slate-800/50 border border-slate-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-400 text-lg">No professionals found for this service</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {professionals.map((professional) => (
              <motion.div
                key={professional._id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                {/* Professional Name */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{professional.fullname}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400">
                        {professional.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      ({professional.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm text-slate-400">
                  <p className="truncate">📧 {professional.email}</p>
                  <p>📱 {professional.phone}</p>
                  {professional.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{professional.city}{professional.state ? `, ${professional.state}` : ''}</span>
                    </div>
                  )}
                </div>

                {/* Services */}
                {professional.services && professional.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-300 mb-2">Services:</p>
                    <div className="space-y-1">
                      {professional.services.slice(0, 2).map((service, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs bg-slate-900/50 p-2 rounded">
                          <span className="text-slate-300">{service.serviceName}</span>
                          <span className="text-blue-400 font-semibold">₹{service.price}</span>
                        </div>
                      ))}
                      {professional.services.length > 2 && (
                        <p className="text-xs text-slate-500 pt-1">
                          +{professional.services.length - 2} more services
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {professional.bio && (
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {professional.bio}
                  </p>
                )}

                {/* CTA Button */}
                <motion.button
                  onClick={() => navigate(`/professional/${professional._id}`)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Profile
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
