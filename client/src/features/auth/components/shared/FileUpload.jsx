import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useState } from 'react';

/**
 * Reusable FileUpload Component
 * Handles file input with preview support
 * Used in Professional Register and other forms
 */
export default function FileUpload({
  label,
  name,
  value,
  onChange,
  placeholder = 'Click to upload file',
  accept = 'image/*',
  required,
  error,
  variants,
  preview
}) {
  return (
    <motion.div variants={variants} className="group">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
        <div className="flex flex-col items-center justify-center">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover mb-2"
              />
              <p className="text-sm text-cyan-400 font-medium">Click to change</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">{placeholder}</p>
            </>
          )}
        </div>
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept={accept}
          className="hidden"
          required={required}
        />
      </label>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </motion.div>
  );
}
