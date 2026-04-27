import { motion } from 'framer-motion';

/**
 * Reusable FormField Component
 * Handles text inputs, email, tel, number with icon support
 * Used across all auth forms for consistency
 */
export default function FormField({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  type = 'text',
  placeholder,
  icon: Icon,
  required,
  error,
  variants,
  className = ''
}) {
  return (
    <motion.div variants={variants} className={`group ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all ${
            error ? 'border-red-600 focus:border-red-600 focus:ring-red-500/30' : ''
          }`}
          required={required}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </motion.div>
  );
}
