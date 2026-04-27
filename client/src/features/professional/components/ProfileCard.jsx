import { motion } from 'framer-motion';

export default function ProfileCard({ profile, isEditing = false }) {
  if (isEditing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-32 h-32 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {profile.name}
          </h3>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">
            {profile.skill}
          </p>
          <p className="text-slate-600 dark:text-slate-400">{profile.bio}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Experience</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {profile.experience}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">City</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {profile.city}
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg md:col-span-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Price Range</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {profile.price}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
