import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    title: 'Business Owner',
    image: '👩‍💼',
    rating: 5,
    text: 'Amazing service! The plumbing issue was fixed within 2 hours. Professional and courteous staff. Highly recommended!',
    service: 'Plumbing Service',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    title: 'Home Owner',
    image: '👨‍💻',
    rating: 5,
    text: 'Best service for AC repair. No hidden charges, transparent pricing. The technician was very knowledgeable and efficient.',
    service: 'AC Repair',
    date: '1 week ago',
  },
  {
    id: 3,
    name: 'Anjali Patel',
    title: 'Apartment Manager',
    image: '👩‍🏫',
    rating: 5,
    text: 'Excellent cleaning service. They were on time, thorough, and left my home spotless. Great value for money!',
    service: 'Home Cleaning',
    date: '3 days ago',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    title: 'Marketing Manager',
    image: '👨‍💼',
    rating: 5,
    text: 'Booked an electrician for home wiring. Very professional, completed work on schedule. Would definitely book again.',
    service: 'Electrical Work',
    date: '5 days ago',
  },
  {
    id: 5,
    name: 'Neha Gupta',
    title: 'Software Engineer',
    image: '👩‍💻',
    rating: 5,
    text: 'The beauty salon service at home was fantastic. Skilled beautician, fresh products, and amazing experience overall.',
    service: 'Beauty Service',
    date: '1 week ago',
  },
  {
    id: 6,
    name: 'Arjun Desai',
    title: 'Startup Founder',
    image: '👨‍🔧',
    rating: 5,
    text: 'Electronics repair was quick and affordable. No fuss, transparent pricing, and the repair quality is excellent.',
    service: 'Electronics Repair',
    date: '10 days ago',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setAutoPlay(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setAutoPlay(false);
  };

  // Auto play carousel
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, totalSlides]);

  const startIdx = currentIndex * itemsPerPage;
  const visibleTestimonials = testimonials.slice(
    startIdx,
    startIdx + itemsPerPage
  );

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
        <motion.div className="text-center" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Thousands of satisfied Users share their positive experiences with our platform
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div className="relative" variants={itemVariants}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={currentIndex}
          >
            {visibleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                className="group relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Card Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-orange-200 dark:from-blue-900 dark:to-orange-900 rounded-2xl opacity-0 group-hover:opacity-50 transition-all duration-300 blur-sm"></div>

                {/* Card Content */}
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all duration-300 h-full flex flex-col">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-700 dark:text-slate-300 mb-6 flex-1 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* Divider */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mb-4" />

                  {/* User Info */}
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {testimonial.title}
                      </p>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 w-fit">
                          {testimonial.service}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {testimonial.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <motion.button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft
                size={20}
                className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {[...Array(totalSlides)].map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setAutoPlay(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-blue-600 dark:bg-blue-400'
                      : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.button
              onClick={handleNext}
              className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight
                size={20}
                className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { label: 'User Reviews', value: '1K+' },
            { label: 'Avg. Rating', value: '4.8⭐' },
            { label: 'Satisfaction', value: '98%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 dark:to-orange-950 border border-slate-200 dark:border-slate-700"
              variants={itemVariants}
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
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
