import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import ServiceSearch from '../components/home/ServiceSearch';
import CategoriesSection from '../components/home/CategoriesSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AppDownloadSection from '../components/home/AppDownloadSection';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export default function Home() {
  return (
    <motion.div
      className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
      </div>

      {/* Hero Section */}
      {/* <motion.section variants={itemVariants} className="relative z-10">
        <HeroSection />
      </motion.section> */}

      {/* Service Search */}
      <motion.section variants={itemVariants} className="relative z-10 py-8 px-4 md:py-12 bg-gradient-to-b from-slate-900/60 to-transparent">
        <ServiceSearch />
      </motion.section>

      {/* Categories */}
      <motion.section variants={itemVariants} className="relative z-10 py-12 md:py-16 bg-gradient-to-r from-slate-900/50 via-blue-950/20 to-slate-900/50">
        <CategoriesSection />
      </motion.section>

      {/* Why Choose Us */}
      <motion.section variants={itemVariants} className="relative z-10 py-12 md:py-16">
        <WhyChooseUs />
      </motion.section>

      {/* Testimonials */}
      <motion.section variants={itemVariants} className="relative z-10 py-12 md:py-16 bg-gradient-to-b from-slate-900/20 to-slate-950/70">
        <TestimonialsSection />
      </motion.section>

      {/* App Download */}
      <motion.section variants={itemVariants} className="relative z-10 py-12 md:py-16">
        <AppDownloadSection />
        
      </motion.section>
    </motion.div>
  );
}
