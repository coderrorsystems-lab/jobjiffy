import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const ServiceGrid = ({
  services = [],
  onServiceClick = () => {},
  containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  gridClass = 'grid grid-cols-2 md:grid-cols-4 gap-4',
  loading = false,
}) => {
  return (
    <motion.div
      className={gridClass}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loading ? (
        <div className="col-span-full text-center text-slate-400 py-6">Loading services...</div>
      ) : (
        services.map((service) => (
          <motion.button
            key={service.id || service.name}
            type="button"
            onClick={() => onServiceClick(service)}
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
            <p className="text-xs text-slate-500 dark:text-slate-400">{service.count || '—'} pros</p>

            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"
              aria-hidden="true"
            />

            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
              <ArrowRight size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
          </motion.button>
        ))
      )}
    </motion.div>
  );
};

export default ServiceGrid;
