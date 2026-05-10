import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandIntroOverlay() {
  const videoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeIntro = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem('jobjiffy_intro_shown', 'true');
  }, []);

  useEffect(() => {
    sessionStorage.removeItem('jobjiffy_intro_shown');
    const introShown = sessionStorage.getItem('jobjiffy_intro_shown');
    
    if (!introShown) {
      setIsOpen(true);
      // Auto-close after 8 seconds
      const timer = setTimeout(() => closeIntro(), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] overflow-hidden bg-black"
          role="dialog"
          aria-modal="true"
        >
          {/* Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={closeIntro}
          >
            <source src="/jobjiffy-intro.mp4" type="video/mp4" />
          </video>

          {/* Fallback Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-slate-900"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            style={{ backgroundSize: '200% 200%' }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          {/* Animated Circles */}
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-8 md:px-10 z-10"
          >
            <h1 className="font-black text-2xl md:text-3xl text-white">JOBJIFFY</h1>
            <motion.button
              onClick={closeIntro}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white px-6 py-2 text-xs font-black uppercase text-white hover:bg-white/20 rounded-full transition-all"
            >
              Skip
            </motion.button>
          </motion.div>

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="mx-auto mb-12 w-24 h-24 border-4 border-white/30 border-t-white rounded-full"
              />
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-6xl font-black text-white mb-4"
              >
                JOBJIFFY
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl md:text-2xl text-white/90 font-semibold mb-2"
              >
                Trusted Professionals
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-white/70"
              >
                Premium Home Services
              </motion.p>
            </motion.div>
          </div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.button
              onClick={closeIntro}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white px-12 py-4 text-lg font-black text-slate-900 rounded-full hover:bg-slate-100"
            >
              ENTER APP
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
