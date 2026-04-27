import { motion } from 'framer-motion';
import { Apple, Download } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function AppDownloadSection() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Main Section */}
        <motion.div className="rounded-3xl overflow-hidden" variants={itemVariants}>
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
            {/* Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M0 0h40v40H0z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '40px 40px',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 md:py-24 px-6 md:px-12">
              {/* Left Content */}
              <motion.div className="flex flex-col justify-center" variants={itemVariants}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Download Our Mobile App
                </h2>

                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                  Get instant access to premium services on the go. Book, track, and manage
                  your services with our intuitive mobile app. Available on iOS and Android.
                </p>

                {/* Key Features */}
                <div className="space-y-4 mb-10">
                  {[
                    'Real-time service tracking',
                    'One-click booking experience',
                    'Exclusive app-only discounts',
                    'Push notifications for updates',
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-blue-50 text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Download Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { icon: Apple, label: 'Download for iOS', color: 'from-white to-slate-200' },
                    { icon: Download, label: 'Download for Android', color: 'from-orange-400 to-orange-500' },
                  ].map((btn, idx) => {
                    const Icon = btn.icon;
                    return (
                      <motion.button
                        key={idx}
                        className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${btn.color} text-slate-900 font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 group`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variants={itemVariants}
                      >
                        <Icon
                          size={24}
                          className="group-hover:scale-110 transition-transform duration-300"
                        />
                        <span>{btn.label}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* Right Side - Phone Mockup */}
              <motion.div
                className="flex items-center justify-center"
                variants={itemVariants}
              >
                <motion.div
                  className="relative w-full max-w-xs"
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Phone Background */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-8 border-slate-900 shadow-2xl overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-10"></div>

                    {/* Screen Content */}
                    <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6">
                      <motion.div
                        className="text-5xl mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📱
                      </motion.div>
                      <div className="text-center text-white">
                        <p className="font-bold text-lg mb-2">Explore Premium Services</p>
                        <p className="text-sm opacity-80">Anytime, Anywhere</p>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute -inset-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl blur-2xl opacity-30"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { number: '5M+', label: 'Downloads', icon: '⬇️' },
            { number: '4.9★', label: 'App Rating', icon: '⭐' },
            { number: '150K+', label: 'Daily Active Users', icon: '👥' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 border border-slate-200 dark:border-slate-700 text-center group"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="text-5xl mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
