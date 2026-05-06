import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Calendar, MessageSquare, Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { getProfessionalByIdParam } from '../data/professionals';
import { isAuthenticated } from '../utils/authUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProfessionalDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const professional = getProfessionalByIdParam(userId);
  const [activeTab, setActiveTab] = useState('pricing');
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    service: '',
    description: '',
    budget: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  if (!professional) {
    return (
      <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/professionals')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
          >
            <ArrowLeft size={20} />
            Back to Professionals
          </button>
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold">Professional Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const platformDuration = () => {
    const joinDate = new Date(professional.joinDate);
    const today = new Date();
    const months = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return 'Less than 1 month';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      type: file.type,
      file: file,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  // Handler to check authentication before allowing request creation
  const handleCreateRequest = () => {
    if (!isAuthenticated()) {
    
      navigate('/login');
      return;
    }
    setShowRequestModal(true);
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon size={16} className="text-blue-400" />;
    if (fileType === 'application/pdf') return <File size={16} className="text-red-400" />;
    return <File size={16} className="text-slate-400" />;
  };

  const handleSendRequest = () => {
    if (!requestForm.service || !requestForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    // Handle request submission
    console.log('Request submitted:', { ...requestForm, files: uploadedFiles });
    // Reset form
    setRequestForm({ service: '', description: '', budget: '' });
    setUploadedFiles([]);
    setShowRequestModal(false);
    alert('Request sent successfully!');
  };

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 py-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/professionals')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          Back to Professionals
        </motion.button>

        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left: Photo and Basic Info */}
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <motion.div
                  className="text-9xl mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {professional.photo}
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">{professional.fullName}</h1>
                <p className="text-xl text-blue-400 font-semibold mb-4">{professional.serviceName}</p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(professional.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-white">{professional.rating}</span>
                </div>

                <div className="text-slate-400 mb-6">
                  <p className="text-sm">{professional.reviewCount} reviews</p>
                </div>

                {/* Platform Info */}
                <div className="space-y-3 text-sm text-slate-400 mb-8 w-full">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar size={16} className="text-blue-400" />
                    <span>On platform for {platformDuration()}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Joined {new Date(professional.joinDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Create Request Button */}
                <motion.button
                  onClick={handleCreateRequest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  Create Request
                </motion.button>
              </div>

              {/* Right: Bio and Details */}
              <div className="md:col-span-2">
                {/* Bio */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-3">About</h2>
                  <p className="text-slate-300 leading-relaxed">{professional.bio}</p>
                </div>

                {/* Professional ID */}
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Professional ID</h3>
                  <div className="inline-block px-4 py-2 bg-slate-700/50 rounded-lg">
                    <code className="text-lg font-mono text-blue-400">{professional.userId}</code>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-xl">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">{professional.rating}</p>
                    <p className="text-xs text-slate-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">{professional.reviewCount}</p>
                    <p className="text-xs text-slate-400">Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400">100%</p>
                    <p className="text-xs text-slate-400">Completion</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs: Pricing and Reviews */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-slate-700">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'pricing'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare size={18} />
                Reviews ({professional.reviews.length})
              </button>
            </div>

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-6">Service Pricing</h3>
                {Object.entries(professional.pricing).map(([service, price], idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{service}</p>
                      <p className="text-xs text-slate-400 mt-1">Negotiable prices</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400">{price}</p>
                      <p className="text-xs text-slate-400">Starting price</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-6">User Reviews</h3>
                {professional.reviews.map((review, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-white">{review.reviewer}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
                            />
                          ))}
                          <span className="text-sm text-slate-400 ml-2">{review.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{review.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Create Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full my-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Create Request</h2>
            <p className="text-slate-300 mb-6">
              You are requesting work from <span className="font-bold text-blue-400">{professional.fullName}</span>
            </p>

            {/* Service Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Select Service</label>
              <select 
                value={requestForm.service}
                onChange={(e) => setRequestForm({ ...requestForm, service: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a service...</option>
                {Object.keys(professional.pricing).map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Project Details</label>
              <textarea
                value={requestForm.description}
                onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                placeholder="Describe your project requirements..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none h-24"
              />
            </div>

            {/* Budget */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Budget (Optional)</label>
              <input
                type="text"
                value={requestForm.budget}
                onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                placeholder="e.g., ₹500 - ₹1500"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">Upload Files (Optional)</label>
              <p className="text-xs text-slate-400 mb-3">You can upload images (PNG, JPG) or PDF files</p>
              
              <div className="space-y-3">
                {/* Image Upload */}
                <div>
                  <label htmlFor="image-upload" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-dashed border-slate-600 rounded-lg cursor-pointer transition-colors">
                    <ImageIcon size={18} className="text-blue-400" />
                    <span className="text-sm text-slate-300">Upload Images</span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* PDF Upload */}
                <div>
                  <label htmlFor="pdf-upload" className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-dashed border-slate-600 rounded-lg cursor-pointer transition-colors">
                    <File size={18} className="text-red-400" />
                    <span className="text-sm text-slate-300">Upload PDF</span>
                  </label>
                  <input
                    id="pdf-upload"
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-slate-400 font-semibold">Attached Files ({uploadedFiles.length})</p>
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between gap-2 p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{file.size} KB</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => removeFile(file.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 hover:bg-red-600/20 rounded transition-colors flex-shrink-0"
                      >
                        <X size={16} className="text-red-400" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestForm({ service: '', description: '', budget: '' });
                  setUploadedFiles([]);
                }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 font-semibold hover:bg-slate-700/50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSendRequest}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Send Request
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
