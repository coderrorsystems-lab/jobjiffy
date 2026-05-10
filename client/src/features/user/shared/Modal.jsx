import { motion } from 'framer-motion';
import { useResetScroll, useModalScroll } from '@/hooks';

/**
 * Reusable Modal Component Template
 * Production-ready modal with scroll management
 * 
 * Features:
 * - Auto-resets scroll to top when opened
 * - Locks body scroll when open
 * - Smooth animations
 * - Keyboard escape support
 * - Click outside to close
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  closeOnBackdropClick = true,
  showCloseButton = true,
  footer,
}) {
  const modalRef = useResetScroll();
  useModalScroll(isOpen);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        ref={modalRef}
        className={`bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden ${sizeClasses[size]}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
