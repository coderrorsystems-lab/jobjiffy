import { motion } from 'framer-motion';
import { Star, Users, Zap, Shield } from 'lucide-react';
import { useWindowScroll } from '@/hooks';

export default function About() {
  useWindowScroll(true);
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Professionals',
      description: 'Thousands of verified professionals ready to help you',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Quick & Easy',
      description: 'Book services in minutes with just a few clicks',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'All transactions are secure with buyer protection',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Top Rated',
      description: 'Work with highly-rated professionals only',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Hero Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">JobJiffy</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              JobJiffy is your trusted platform for connecting with professional service providers. Whether you need home repair, beauty services, or any professional help, we've got you covered.
            </p>
            <p className="text-slate-400 mb-6">
              Our mission is to make it easy and affordable for everyone to access quality professional services right at their doorstep.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-slate-700"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-cyan-400">1K+</div>
                <div className="text-slate-300">Professional Service Providers</div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-blue-400">5K+</div>
                <div className="text-slate-300">Happy Customers</div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-cyan-400">10K+</div>
                <div className="text-slate-300">Services Completed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Why Choose JobJiffy?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-blue-500 transition-all duration-300"
              whileHover={{ y: -8 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-cyan-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { number: '1', title: 'Search', desc: 'Browse services or search for what you need' },
            { number: '2', title: 'Select', desc: 'Choose from verified professionals' },
            { number: '3', title: 'Book', desc: 'Schedule at your convenient time' },
            { number: '4', title: 'Enjoy', desc: 'Get quality service at your doorstep' },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-12 border border-slate-700 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to find the right professional?</h3>
          <p className="text-slate-300 mb-8">Explore our wide range of services and book your next appointment today.</p>
        </div>
      </motion.div>
    </div>
  );
}
