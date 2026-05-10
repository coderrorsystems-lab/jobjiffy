import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  Star,
  Zap,
  Users,
  CreditCard,
} from 'lucide-react';

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

const features = [
  {
    icon: Shield,
    title: 'Verified Professionals',
    description:
      'All professionals are background checked and verified for quality assurance',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    description:
      '98% on-time rate. Real-time tracking of your professional arrival',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Star,
    title: 'Quality Guaranteed',
    description:
      'Transparent ratings and reviews from verified Users like you',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Booking',
    description:
      'Book a professional in just 3 clicks with instant confirmation',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description:
      'Skilled professionals with years of experience in their field',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: CreditCard,
    title: 'Transparent Pricing',
    description:
      'No hidden charges. Clear pricing upfront with flexible payment options',
    color: 'from-cyan-500 to-cyan-600',
  },
];

export default function WhyChooseUs() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        className="space-y-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div className="text-center max-w-3xl mx-auto" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Experience the difference with our premium marketplace. Trusted by thousands,
            built for your convenience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className="relative group"
                variants={itemVariants}
              >
                {/* Card Background with gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>

                {/* Card Content */}
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 h-full border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all duration-300">
                  {/* Icon Container */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Icon size={32} />
                  </motion.div>

                  {/* Text Content */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl w-0 group-hover:w-full transition-all duration-500`}
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="relative rounded-3xl overflow-hidden py-12 md:py-16 px-6 md:px-12"
          variants={itemVariants}
        >
          {/* Background with animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600 to-orange-500 dark:from-blue-900 dark:via-blue-900 dark:to-orange-900"></div>

          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px',
            }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-blue-50 mb-8 text-lg">
              Book your first service today and experience premium quality at your doorstep.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold hover:shadow-xl transition-all duration-300 active:scale-95 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Service Now
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
