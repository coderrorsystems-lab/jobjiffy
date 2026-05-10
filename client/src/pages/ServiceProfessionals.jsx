import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { useWindowScroll } from '@/hooks';

export default function ServiceProfessionals() {
  useWindowScroll(true);
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch professionals for this service
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/services/${serviceSlug}/professionals`);
        // const data = await response.json();
        // setProfessionals(data);
        setProfessionals([]);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [serviceSlug]);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <motion.div
        className="max-w-6xl mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white mb-2 capitalize"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {serviceSlug?.replace('-', ' ')} Professionals
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <p className="text-slate-400">Loading professionals...</p>
            </motion.div>
          </div>
        ) : professionals.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-slate-400 mb-4">No professionals found for this service.</p>
            <motion.button
              onClick={() => navigate('/professionals')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg"
            >
              View All Professionals
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {professionals.map((professional) => (
              <motion.div
                key={professional._id}
                whileHover={{ y: -4 }}
                className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-colors"
                onClick={() => navigate(`/professional/${professional._id}`)}
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">{professional.name?.[0]}</span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{professional.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{professional.title}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {professional.rating && (
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm">{professional.rating} ({professional.reviews})</span>
                      </div>
                    )}
                    {professional.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" />
                        <span className="text-slate-400 text-sm">{professional.location}</span>
                      </div>
                    )}
                    {professional.hourlyRate && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-400" />
                        <span className="text-slate-400 text-sm">${professional.hourlyRate}/hr</span>
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/professional/${professional._id}`);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    View Profile
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
