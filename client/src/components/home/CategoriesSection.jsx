import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const categories = [
  {
    id: 1,
    name: 'AC Repair & Service',
    count: 25,
    icon: '❄️',
    color: 'from-blue-500 to-blue-600',
    image:
      'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
  },
  {
    id: 2,
    name: 'Beauty & Salon',
    count: 51,
    icon: '💇',
    color: 'from-pink-500 to-pink-600',
    image:
      'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))',
  },
  {
    id: 3,
    name: 'Electronics Repair',
    count: 19,
    icon: '📱',
    color: 'from-purple-500 to-purple-600',
    image:
      'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.05))',
  },
  {
    id: 4,
    name: 'Electrical',
    count: 27,
    icon: '⚡',
    color: 'from-amber-500 to-amber-600',
    image:
      'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
  },
  {
    id: 5,
    name: 'Home Cleaning',
    count: 48,
    icon: '🧹',
    color: 'from-green-500 to-green-600',
    image:
      'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
  },
  {
    id: 6,
    name: 'Plumbing',
    count: 32,
    icon: '🚿',
    color: 'from-cyan-500 to-cyan-600',
    image:
      'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(34, 211, 238, 0.05))',
  },
  {
    id: 7,
    name: 'Painting',
    count: 23,
    icon: '🏠',
    color: 'from-orange-500 to-orange-600',
    image:
      'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))',
  },
  {
    id: 8,
    name: 'Furniture Repair',
    count: 14,
    icon: '🛏️',
    color: 'from-indigo-500 to-indigo-600',
    image:
      'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))',
  },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  const toServiceSlug = (serviceName) =>
    String(serviceName || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

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
            Browse by Category
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore our wide range of professional services
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => navigate(`/services/${toServiceSlug(category.name)}`)}
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
                style={{ background: category.image }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                {/* Icon and Title */}
                <div className="text-left">
                  <motion.div
                    className={`text-4xl md:text-5xl mb-4 inline-block`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white text-left">
                    {category.name}
                  </h3>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs md:text-sm font-semibold">
                    {category.count} services
                  </span>
                  <motion.div
                    className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
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
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div className="flex justify-center" variants={categoryVariants}>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 group">
            Explore All Categories
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
