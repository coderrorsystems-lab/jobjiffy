import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Phone, Mail, Lock, Briefcase, Award, DollarSign, MapPin, FileText,
  Upload, Landmark, Eye, EyeOff, ArrowRight, ArrowLeft, Loader, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';
import { registerProfessional } from '../../../services/serviceAPI';

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Your contact details' },
  { id: 2, title: 'Professional Details', description: 'Services you offer' },
  { id: 3, title: 'Identity Verification', description: 'KYC Documents' },
  { id: 4, title: 'Banking Details', description: 'Payment information' }
];

export default function ProfessionalRegister() {
  useWindowScroll(true);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2
    category: '',
    skills: '',
    experience: '',
    servicesOffered: [],
    pricePerService: '',
    serviceArea: '',
    profileDescription: '',
    profilePhoto: null,
    // Step 3
    aadharCard: null,
    addressProof: null,
    // Step 4
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: ''
  });

  const [previews, setPreviews] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const handleChange = (e) => {
    // Prevent any event bubbling
    e.preventDefault?.();
    
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        servicesOffered: checked
          ? [...prev.servicesOffered, value]
          : prev.servicesOffered.filter(s => s !== value)
      }));
    } else if (type === 'file') {
      // File input - don't update here
      return;
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyDown = (e) => {
    // Prevent form submission on Enter key in text inputs (except textarea)
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.password) {
        setError('Please fill all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.category || !formData.experience || !formData.pricePerService || !formData.serviceArea) {
        setError('Please fill all required fields');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.aadharCard || !formData.addressProof) {
        setError('Please upload all required documents');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName) {
        setError('Please fill all required banking details');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      await registerProfessional({
        fullName: formData.fullName,
        email: formData.email,
        category: formData.category,
        experience: formData.experience,
        servicesOffered: formData.servicesOffered,
        pricePerService: formData.pricePerService,
        serviceArea: formData.serviceArea,
      });
      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Basic Info
  const Step1 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="John Doe"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number</label>
        <div className="relative">
          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="+91 98765 43210"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="john@example.com"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-400"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Step 2: Professional Details
  const Step2 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Service Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        >
          <option value="" className="bg-slate-900 text-white">Select a category</option>
          <option value="ac_repair" className="bg-slate-900 text-white">AC Repair & Service</option>
          <option value="plumbing" className="bg-slate-900 text-white">Plumbing</option>
          <option value="electrical" className="bg-slate-900 text-white">Electrical</option>
          <option value="beauty" className="bg-slate-900 text-white">Beauty & Grooming</option>
          <option value="cleaning" className="bg-slate-900 text-white">Home Cleaning</option>
          <option value="carpentry" className="bg-slate-900 text-white">Carpentry</option>
          <option value="appliance" className="bg-slate-900 text-white">Appliance Repair</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Experience (in years)</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="5"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Services Offered (Select all)</label>
        <div className="space-y-2">
          {['Basic Service', 'Premium Service', 'Installation', 'Repair & Maintenance'].map(service => (
            <label key={service} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value={service}
                checked={formData.servicesOffered.includes(service)}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-800"
              />
              <span className="text-slate-300">{service}</span>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Starting Price (₹)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="number"
            name="pricePerService"
            value={formData.pricePerService}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="500"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Service Area (City/Locality)</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Delhi - South Delhi"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Profile Description (Bio)</label>
        <textarea
          name="profileDescription"
          value={formData.profileDescription}
          onChange={handleChange}
          placeholder="Tell us about your experience and expertise..."
          rows="4"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
        <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
          <div className="flex flex-col items-center justify-center">
            {previews.profilePhoto ? (
              <>
                <img src={previews.profilePhoto} alt="Preview" className="w-16 h-16 rounded-lg object-cover mb-2" />
                <p className="text-sm text-cyan-400 font-medium">Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-sm text-slate-400">Click to upload photo</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'profilePhoto')}
            className="hidden"
          />
        </label>
      </motion.div>
    </motion.div>
  );

  // Step 3: KYC Documents
  const Step3 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">Upload clear photos of your documents for verification</p>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Aadhar Card / PAN Card *</label>
        <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
          <div className="flex flex-col items-center justify-center">
            {previews.aadharCard ? (
              <>
                <img src={previews.aadharCard} alt="Preview" className="w-20 h-12 rounded object-cover mb-2" />
                <p className="text-sm text-cyan-400 font-medium">Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-sm text-slate-400">Upload Aadhar or PAN Card</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'aadharCard')}
            className="hidden"
            required
          />
        </label>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Address Proof *</label>
        <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
          <div className="flex flex-col items-center justify-center">
            {previews.addressProof ? (
              <>
                <img src={previews.addressProof} alt="Preview" className="w-20 h-12 rounded object-cover mb-2" />
                <p className="text-sm text-cyan-400 font-medium">Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-sm text-slate-400">Upload Address Proof</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'addressProof')}
            className="hidden"
            required
          />
        </label>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-300">Admin approval required. You'll be notified once verified.</p>
      </motion.div>
    </motion.div>
  );

  // Step 4: Banking Details
  const Step4 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="bg-green-900/30 border border-green-800 rounded-lg p-3 flex gap-3">
        <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-300">Your banking details are encrypted and secure</p>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Bank Account Number</label>
        <div className="relative">
          <Landmark className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="1234567890"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">IFSC Code</label>
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="SBIN0000001"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Account Holder Name</label>
        <input
          type="text"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID (Optional)</label>
        <input
          type="text"
          name="upiId"
          value={formData.upiId}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="john@upi"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
        />
      </motion.div>
    </motion.div>
  );

  const steps = [Step1, Step2, Step3, Step4];
  const CurrentStep = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 mx-auto shadow-lg shadow-cyan-500/50">
            <span className="text-2xl font-bold text-white">JF</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Professional Registration</h1>
          <p className="text-slate-400">Join JobJiffy as a service professional</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => (
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
                  {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.id}
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
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
            />
          </div>
        </motion.div>

        {/* Step Content - Wrapped in div to prevent form submission on Enter */}
        <div
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8"
          onKeyDown={(e) => {
            // Prevent any form submission behavior completely
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              // Return false to make sure nothing else happens
              return false;
            }
          }}
          onKeyPress={(e) => {
            // Also handle keypress
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">{STEPS[currentStep - 1].title}</h2>
            <p className="text-sm text-slate-400">{STEPS[currentStep - 1].description}</p>
          </div>

          <CurrentStep />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm mt-4"
            >
              {error}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-300 border-2 border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            <motion.button
              type="button"
              onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {currentStep === STEPS.length ? 'Submitting...' : 'Loading...'}
                </>
              ) : (
                <>
                  {currentStep === STEPS.length ? 'Complete Registration' : 'Next Step'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-400 mt-6"
        >
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
