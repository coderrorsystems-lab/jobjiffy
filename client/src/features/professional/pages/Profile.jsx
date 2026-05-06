import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, X, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { ProfileCard } from '../components';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Fetch professional profile from backend
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/professionals/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const professional = response.data.professional;
      
      // Map backend response to UI format
      const profileData = {
        id: professional._id,
        fullname: professional.fullname,
        email: professional.email,
        phone: professional.phone,
        category: professional.category,
        experience: professional.experience,
        city: professional.city,
        bio: professional.bio,
        collegeName: professional.collegeName,
        department: professional.department,
        yearOfGraduation: professional.yearOfGraduation,
        collegeEmail: professional.collegeEmail,
        streetAddress: professional.streetAddress,
        state: professional.state,
        zipCode: professional.zipCode,
        collegeIdPhoto: professional.collegeIdPhoto,
        services: professional.services || [],
        status: professional.status,
        rating: professional.rating,
        totalReviews: professional.totalReviews,
        walletBalance: professional.walletBalance,
        totalEarnings: professional.totalEarnings,
        isAvailable: professional.isAvailable,
        createdAt: professional.createdAt
      };

      setProfile(profileData);
      setFormData(profileData);
      setPhotoPreview(professional.collegeIdPhoto || 'https://via.placeholder.com/150');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, collegeIdPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const updateData = {
        fullname: formData.fullname,
        bio: formData.bio,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        collegeName: formData.collegeName,
        department: formData.department,
        yearOfGraduation: formData.yearOfGraduation,
        collegeEmail: formData.collegeEmail,
        collegeIdPhoto: formData.collegeIdPhoto,
        experience: Number(formData.experience)
      };

      const response = await axios.put('/api/professionals/profile', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data.professional);
      setFormData(response.data.professional);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile');
      console.error('Profile update error:', err);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setPhotoPreview(profile.collegeIdPhoto || 'https://via.placeholder.com/150');
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Professional Profile</h2>
          {!isEditing && !loading && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-blue-600" size={32} />
            <span className="ml-3 text-slate-600 dark:text-slate-400">Loading profile...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Profile Content */}
        {!loading && profile && (
          <>
            {isEditing ? (
              // Edit Form
              <div className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-4">
                    College ID Photo
                  </label>
                  <div className="flex items-end gap-6">
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="College ID"
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
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
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

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      College Name
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Year of Graduation
                    </label>
                    <input
                      type="number"
                      name="yearOfGraduation"
                      value={formData.yearOfGraduation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      College Email
                    </label>
                    <input
                      type="email"
                      name="collegeEmail"
                      value={formData.collegeEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
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
                      maxLength="500"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500</p>
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
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-start gap-8">
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden flex-shrink-0">
                    {profile.collegeIdPhoto ? (
                      <img src={profile.collegeIdPhoto} alt="College ID" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile.fullname?.[0]?.toUpperCase()}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {profile.fullname}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 capitalize mb-4">
                      {profile.category}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.experience}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Years Exp.</p>
                      </div>
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{profile.rating.toFixed(1)}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Rating</p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{profile.totalReviews}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Reviews</p>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{profile.walletBalance}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Wallet</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">{profile.email}</p>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">{profile.phone}</p>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      City
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">{profile.city || 'Not provided'}</p>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      profile.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {profile.status?.charAt(0).toUpperCase() + profile.status?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* College Information */}
                <div className="p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">College Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">College Name</p>
                      <p className="text-slate-900 dark:text-white font-medium">{profile.collegeName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Department</p>
                      <p className="text-slate-900 dark:text-white font-medium">{profile.department || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Year of Graduation</p>
                      <p className="text-slate-900 dark:text-white font-medium">{profile.yearOfGraduation || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">College Email</p>
                      <p className="text-slate-900 dark:text-white font-medium text-sm">{profile.collegeEmail || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Services */}
                {profile.services && profile.services.length > 0 && (
                  <div className="p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Services</h3>
                    <div className="grid gap-3">
                      {profile.services.map((service, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{service.serviceName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{service.category}</p>
                          </div>
                          <p className="text-green-600 dark:text-green-400 font-semibold">₹{service.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Earnings */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 uppercase tracking-wide mb-2">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-400">₹{profile.totalEarnings?.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2">Wallet Balance</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">₹{profile.walletBalance?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
