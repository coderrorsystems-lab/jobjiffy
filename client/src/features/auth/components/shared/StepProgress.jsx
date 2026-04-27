import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

/**
 * Reusable StepProgress Component
 * Displays progress for multi-step forms
 * Used in Professional Register and other multi-step flows
 */
export default function StepProgress({ steps, currentStep }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep >= step.id ? 1 : 0.9,
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                currentStep >= step.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {currentStep > step.id ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                step.id
              )}
            </motion.div>
            <p className="text-xs font-medium text-slate-400 text-center hidden sm:block">
              {step.title}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
        />
      </div>
    </motion.div>
  );
}
