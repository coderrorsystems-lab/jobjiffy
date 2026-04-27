import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Reusable PasswordInput Component
 * Handles password input with show/hide toggle
 * Used in Login, Register, Professional Register
 */
export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  placeholder = '••••••••',
  required,
  error,
  variants
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div variants={variants} className="group">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all ${
            error ? 'border-red-600 focus:border-red-600 focus:ring-red-500/30' : ''
          }`}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-400 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </motion.div>
  );
}
