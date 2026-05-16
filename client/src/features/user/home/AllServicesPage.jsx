import { motion } from 'framer-motion';
import { ArrowLeft, Loader, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAllServices, fetchProfessionalsByServiceId } from '../services/homeAPI';
import { serviceTypes as frontendServiceTypes } from '../../../data/serivceTypes';

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

export default function AllServicesPage() {
  const navigate = useNavigate();
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [profLoading, setProfLoading] = useState(false);

  // Fetch all services on mount
  useEffect(() => {
    loadAllServices();
  }, []);

  const loadAllServices = async () => {
    setLoading(true);
    setError('');
    try {
      const backendData = await fetchAllServices();
      const backendServices = backendData.services || backendData.data || [];
      
      // Merge frontend serviceTypes with backend services
      const mergedServices = [
        // Frontend service types first
        ...frontendServiceTypes.map(service => ({
          ...service,
          source: 'frontend',
          type: 'frontend',
        })),
        // Backend services
        ...backendServices.map(service => ({
          id: service._id || service.id,
          name: service.name || service.serviceName,
          icon: service.dp || service.image, // Using dp (profile image) instead of icon
          count: service.count || service.professionalsCount || '0',
          source: 'backend',
          type: 'backend',
          serviceId: service._id || service.id,
        })),
      ];

      setAllServices(mergedServices);
    } catch (err) {
      console.error('Error loading services:', err);
      setError(err.message || 'Failed to load services');
      // Fallback to frontend services only
      setAllServices(frontendServiceTypes.map(s => ({ ...s, source: 'frontend' })));
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = async (service) => {
    setSelectedService(service);
    
    // If it's a backend service, fetch professionals for it
    if (service.source === 'backend' && service.serviceId) {
      setProfLoading(true);
      try {
        const data = await fetchProfessionalsByServiceId(service.serviceId);
        setProfessionals(data.professionals || data.data || []);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setProfessionals([]);
        setError(err.message || 'Failed to fetch professionals');
      } finally {
        setProfLoading(false);
      }
    } else if (service.source === 'frontend') {
      // For frontend services, navigate to service page
      const serviceSlug = service.name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/services/${serviceSlug}`, { state: { service } });
    }
  };

  const closeModal = () => {
    setSelectedService(null);
    setProfessionals([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white mb-4 transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All Services
            </h1>
            <p className="text-slate-400 text-lg">
              Browse {allServices.length} services and connect with professionals
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-900/30 border border-red-600/30 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allServices.map((service, index) => (
            <motion.button
              key={`${service.source}-${service.id}-${index}`}
              onClick={() => handleServiceClick(service)}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500 transition-all duration-300"
            >
              {/* Service Image/Icon */}
              <div className="flex items-center justify-center h-24 mb-3 bg-slate-900 rounded-lg overflow-hidden">
                {service.icon && service.source === 'backend' ? (
                  <img
                    src={service.icon}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <span className="text-4xl">{service.icon || '🛠️'}</span>
                )}
              </div>

              {/* Service Info */}
              <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                {service.name}
              </h3>
              <p className="text-xs text-slate-400">
                {service.count || '0'} professionals
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Service Details Modal */}
        {selectedService && selectedService.source === 'backend' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{selectedService.name}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {profLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 text-orange-500 animate-spin" />
                  </div>
                ) : professionals.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-slate-300 mb-4">
                      {professionals.length} professional{professionals.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {professionals.map((prof) => (
                        <motion.div
                          key={prof._id || prof.id}
                          whileHover={{ y: -4 }}
                          className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-orange-500 transition cursor-pointer"
                          onClick={() => {
                            navigate(`/professional/${prof._id || prof.id}`);
                            closeModal();
                          }}
                        >
                          <div className="flex gap-3">
                            {prof.dp && (
                              <img
                                src={prof.dp}
                                alt={prof.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            )}
                            <div className="flex-1 text-left">
                              <h4 className="font-semibold text-white">
                                {prof.name || prof.fullName}
                              </h4>
                              <p className="text-xs text-slate-400">
                                {prof.rating ? `⭐ ${prof.rating}` : 'No rating yet'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">
                    No professionals found for this service
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
