import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Save } from 'lucide-react';

export default function Availability() {
  const [availability, setAvailability] = useState({
    availableToday: true,
    startTime: '08:00',
    endTime: '18:00',
    holidayMode: false,
  });

  const [formData, setFormData] = useState(availability);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    setAvailability(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Availability</h2>

        <div className="space-y-6">
          {/* Available Today */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Available Today
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Toggle to show or hide from customer search
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="availableToday"
                  checked={formData.availableToday}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              Working Hours
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm">
              ℹ️ Your working hours: {formData.startTime} to {formData.endTime}
            </div>
          </div>

          {/* Holiday Mode */}
          <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Holiday Mode
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enable to pause all bookings temporarily
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="holidayMode"
                  checked={formData.holidayMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600" />
              </label>
            </div>

            {formData.holidayMode && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                ⚠️ You are in holiday mode. New bookings are paused.
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>

          {/* Current Status */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✓ Your availability has been saved successfully
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
