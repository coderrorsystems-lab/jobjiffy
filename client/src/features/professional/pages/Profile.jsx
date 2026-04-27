import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, X } from 'lucide-react';
import { ProfileCard } from '../components';

const INITIAL_PROFILE = {
  name: 'Rohan Mehta',
  photo: 'https://via.placeholder.com/150',
  skill: 'AC Repair & Service',
  experience: '8 years',
  city: 'Delhi',
  price: '₹499 - ₹1,299',
  bio: 'Professional AC repair and maintenance specialist with 8 years of experience. Quick, reliable, and affordable service.',
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [formData, setFormData] = useState(profile);
  const [photoPreview, setPhotoPreview] = useState(profile.photo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setPhotoPreview(profile.photo);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          // Edit Form
          <div className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-4">
                Profile Photo
              </label>
              <div className="flex items-end gap-6">
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                  <label className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click camera icon to upload a new photo
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Skill / Category
                </label>
                <input
                  type="text"
                  name="skill"
                  value={formData.skill}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Short Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Display Profile
          <ProfileCard profile={profile} isEditing={false} />
        )}
      </motion.div>
    </div>
  );
}
