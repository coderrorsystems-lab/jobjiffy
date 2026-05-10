import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Phone, Mail, Lock, Briefcase, Award, DollarSign, MapPin, FileText,
  Upload, Landmark, Eye, EyeOff, ArrowRight, ArrowLeft, Loader, CheckCircle,
  AlertCircle, Plus, Trash2, Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWindowScroll } from '@/hooks';
import { registerProfessional, sendOTP } from '../services/authAPI';
import { verifyOTP } from '../services/authAPI';
import { serviceTypes as SERVICE_CATEGORIES } from '../../../data/serivceTypes'; 
const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Your contact details' },
  { id: 2, title: 'Address & Professional Details', description: 'Location and services' },
  { id: 3, title: 'Services & Experience', description: 'Your offerings and background' },
  { id: 4, title: 'Identity Verification', description: 'KYC Documents' },
  { id: 5, title: 'Banking Details', description: 'Payment information' }
];



const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export default function ProfessionalRegister() {
  useWindowScroll(true);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // OTP states (same flow as user registration)
  const [otpData, setOtpData] = useState({ otp: '', isOtpSent: false, otpLoading: false });
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Step 2: Address & Professional Category
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    professionalDetails: {
      category: '',
      bio: '',
      collegeName: '',
      department: '',
      year: '',
      collegeGmail: '',
      kycDocuments: {
        collegeId: null
      },
      bankDetails: {
        accountNumber: '',
        ifsc: '',
        accountHolderName: '',
        upiId: ''
      }
    }
  });

  const [newService, setNewService] = useState({ name: '', description: '', price: '', category: '' });
  const [services, setServices] = useState([]);
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

  // Validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const isValidPhone = (phone) => /^\+\d{1,3}\d{6,14}$/.test(phone.replace(/\s/g, ''));
  
  const isValidIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  
  const isValidAccountNumber = (acc) => /^\d{9,18}$/.test(acc);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const parts = name.split('.');
      const updated = { ...prev };

      if (parts.length === 1) {
        updated[name] = value;
        return updated;
      }

      let current = updated;

      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = { ...current[parts[i]] };
        current = current[parts[i]];
      }

      current[parts[parts.length - 1]] = value;
      return updated;
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleProfessionalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      professionalDetails: { ...prev.professionalDetails, [name]: value }
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      professionalDetails: {
        ...prev.professionalDetails,
        bankDetails: { ...prev.professionalDetails.bankDetails, [name]: value }
      }
    }));
  };

  const handleAddService = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!newService.name || !newService.description || !newService.price || !newService.category) {
      setError('Please fill all service details including category');
      return;
    }
    if (Number(newService.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }
    setServices(prev => [...prev, { ...newService, price: Number(newService.price), id: Date.now() }]);
    setNewService({ name: '', description: '', price: '', category: '' });
    setError('');
  };

  const handleRemoveService = (e, index) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const validateFile = (file) => {
    if (!file) return { valid: false, message: 'File is required' };
    if (file.size > MAX_FILE_SIZE) return { valid: false, message: 'File size must be less than 5MB' };
    if (!ALLOWED_FILE_TYPES.includes(file.type)) return { valid: false, message: 'Only JPEG, PNG, WEBP, or PDF files are allowed' };
    return { valid: true };
  };

  const handleFileChange = (e, docType) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError('');

    // update formData with file
    setFormData(prev => ({
      ...prev,
      professionalDetails: {
        ...prev.professionalDetails,
        kycDocuments: {
          ...prev.professionalDetails.kycDocuments,
          [docType]: file
        }
      }
    }));

    // update preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({
        ...prev,
        [docType]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };
  const validateStep = () => {
    setError('');

    const trim = (v) => (typeof v === 'string' ? v.trim() : v);

    if (currentStep === 1) {
      const name = trim(formData.name);
      const email = trim(formData.email);
      const phone = trim(formData.phone);
      const password = formData.password;
      const confirm = formData.confirmPassword;

      if (!name) {
        setError('Full name is required');
        return false;
      }
      if (name.length < 2) {
        setError('Name must be at least 2 characters');
        return false;
      }
      if (!email) {
        setError('Email is required');
        return false;
      }
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (!phone) {
        setError('Phone is required');
        return false;
      }
      if (!isValidPhone(phone)) {
        setError('Phone must be in E.164 format (e.g., +919999999999)');
        return false;
      }
      if (!password) {
        setError('Password is required');
        return false;
      }
      if (password !== confirm) {
        setError('Passwords do not match');
        return false;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }

    if (currentStep === 2) {
      const { address } = formData;
      if (!trim(address.street) || !trim(address.city) || !trim(address.state) || !trim(address.zipCode)) {
        setError('Please fill all address fields (street, city, state, zip)');
        return false;
      }
    }

    if (currentStep === 3) {
      const { professionalDetails } = formData;
      if (!trim(professionalDetails.collegeName)) {
        setError('College name is required');
        return false;
      }
      if (!trim(professionalDetails.department)) {
        setError('Department is required');
        return false;
      }
      if (!trim(professionalDetails.year)) {
        setError('Please select your year of graduation');
        return false;
      }
      if (!trim(professionalDetails.bio)) {
        setError('Please write a short bio');
        return false;
      }
      if (services.length === 0) {
        setError('Please add at least one service');
        return false;
      }
      const yearNum = Number(professionalDetails.year);
      if (Number.isNaN(yearNum) || yearNum < 1980 || yearNum > new Date().getFullYear() + 5) {
        setError('Please enter a valid year of graduation');
        return false;
      }
      if (professionalDetails.bio.length > 500) {
        setError('Bio must be less than 500 characters');
        return false;
      }
    }

    if (currentStep === 4) {
      const { collegeGmail, kycDocuments } = formData.professionalDetails;
      if (!kycDocuments.collegeId) {
        setError('Please upload your College ID');
        return false;
      }
      if (!trim(collegeGmail)) {
        setError('Please enter your College Gmail');
        return false;
      }
      if (!isValidEmail(trim(collegeGmail))) {
        setError('Please enter a valid college email address');
        return false;
      }
    }

    if (currentStep === 5) {
      const { bankDetails } = formData.professionalDetails;
      const acc = trim(bankDetails.accountNumber || '');
      const ifsc = trim(bankDetails.ifsc || '');
      const holder = trim(bankDetails.accountHolderName || '');

      // Make bank details optional. If any field is provided, require all and validate.
      if (acc || ifsc || holder) {
        if (!acc || !ifsc || !holder) {
          setError('Please complete all banking details or leave them all empty');
          return false;
        }
        if (!isValidAccountNumber(acc)) {
          setError('Bank account number must be 9-18 digits');
          return false;
        }
        if (!isValidIFSC(ifsc)) {
          setError('IFSC code format is invalid (e.g., SBIN0000001)');
          return false;
        }
      }
    }

    return true;
  };

  const handleGetOTP = async () => {
    setOtpError('');
    setOtpSuccess('');

    const email = (formData.email || '').trim();
    if (!email) {
      setOtpError('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      setOtpError('Please enter a valid email address');
      return;
    }

    setOtpData(prev => ({ ...prev, otpLoading: true }));
    try {
      await sendOTP(email);
      setOtpSuccess('OTP sent to your email! Check your inbox and spam folder.');
      setOtpData(prev => ({ ...prev, isOtpSent: true, otpLoading: false, otp: '' }));
      setTimeout(() => setOtpSuccess(''), 5000);
    } catch (err) {
      console.error('Get OTP error:', err);
      let errorMsg = err.message || 'Failed to send OTP. Please try again.';
      if (err.isNetwork) errorMsg += ' (Network issue)';
      if (err.isTimeout) errorMsg += ' (Server not responding)';
      setOtpError(errorMsg);
      setOtpData(prev => ({ ...prev, otpLoading: false }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      setError('');
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
        // Normalize services to server-allowed values so server enums match
        const serverAllowed = ['cleaning','beauty','repair','appliance','personalcare','other'];
        const normalizedServices = services.map(({ id, ...service }) => {
          const raw = (service.category || '').toString().trim().toLowerCase();
          const direct = serverAllowed.find(a => a === raw);
          if (direct) return { category: direct, serviceName: service.name, desc: service.description, price: Number(service.price) };
          if (raw.includes('clean')) return { category: 'cleaning', serviceName: service.name, desc: service.description, price: Number(service.price) };
          if (raw.includes('beaut') || raw.includes('makeup') || raw.includes('salon')) return { category: 'beauty', serviceName: service.name, desc: service.description, price: Number(service.price) };
          if (raw.includes('repair') || raw.includes('fix') || raw.includes('appliance')) return { category: 'repair', serviceName: service.name, desc: service.description, price: Number(service.price) };
          if (raw.includes('personal') || raw.includes('care') || raw.includes('tutor')) return { category: 'personalcare', serviceName: service.name, desc: service.description, price: Number(service.price) };
          return { category: 'other', serviceName: service.name, desc: service.description, price: Number(service.price) };
        });

      // Backend expects flat JSON format
      const submitData = {
        // Basic Info
        fullname: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        
        // Address - flat fields
        streetAddress: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zipCode: formData.address.zipCode,
        
        // College Information - flat fields
        collegeName: formData.professionalDetails.collegeName,
        department: formData.professionalDetails.department,
        yearOfGraduation: Number(formData.professionalDetails.year),
        collegeEmail: formData.professionalDetails.collegeGmail,
        
        // Bio
        bio: formData.professionalDetails.bio,

        // Services and derived top-level category
        services: normalizedServices,
        category: (normalizedServices[0] && normalizedServices[0].category) || 'other',
        
        // Bank Details - flat fields
        accountNumber: formData.professionalDetails.bankDetails.accountNumber,
        accountHolderName: formData.professionalDetails.bankDetails.accountHolderName,
        ifscCode: formData.professionalDetails.bankDetails.ifsc,
        upiId: formData.professionalDetails.bankDetails.upiId,
        
        // KYC Documents - send filename only (avoid large base64 payload)
        kycDocuments: {
          collegeId: formData.professionalDetails.kycDocuments?.collegeId?.name || ''
        }
      };

      // Ensure OTP is present and verified by server as part of registration
      if (!otpData.isOtpSent) {
        setError('Please get OTP first');
        setLoading(false);
        return;
      }
      if (!otpData.otp || !otpData.otp.trim()) {
        setError('Please enter the OTP from your email');
        setLoading(false);
        return;
      }

      // Include OTP in submit payload (keeps flow consistent with user registration)
      submitData.otp = otpData.otp;

      const response = await registerProfessional(submitData);
      
      if (response?.professional?.status === 'pending') {
        // Show success message and redirect
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Your account is pending admin approval. You will be notified once verified.',
            type: 'pending'
          } 
        });
      } else {
        navigate('/login');
      }
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
        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="John Doe"
            minLength="2"
            maxLength="100"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
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

      {/* OTP Section for Professional registration (same UX as user flow) */}
      <motion.div variants={itemVariants} className="space-y-3 border-t border-slate-700/50 pt-4">
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={handleGetOTP}
            disabled={otpData.otpLoading}
            whileHover={{ scale: !otpData.otpLoading ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 flex-1 rounded-xl border border-cyan-400/50 bg-cyan-500/10 py-2.5 px-3 font-medium text-cyan-400 transition disabled:cursor-not-allowed disabled:opacity-50 disabled:border-slate-600 disabled:text-slate-500 disabled:bg-slate-800/30"
          >
            {otpData.otpLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending OTP...
              </>
            ) : otpData.isOtpSent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                OTP Sent - Resend?
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Get OTP
              </>
            )}
          </motion.button>
        </div>

        {otpData.isOtpSent && (
          <motion.div className="space-y-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="group">
              <label className="mb-2 block text-sm font-medium text-slate-200">Enter OTP</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={otpData.otp}
                  onChange={(e) => { setOtpData(prev => ({ ...prev, otp: e.target.value })); setOtpError(''); }}
                  placeholder="Enter OTP from email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  maxLength="6"
                />
              </div>
            </div>
          </motion.div>
        )}

        {otpSuccess && (
          <div className="rounded-lg border border-green-500/40 bg-green-950/40 p-3 text-sm text-green-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {otpSuccess}
          </div>
        )}

        {otpError && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {otpError}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number (E.164) *</label>
        <div className="relative">
          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="+919999999999"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Format: +[country code][number] (e.g., +919999999999)</p>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Password (Min 8 chars) *</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            minLength="8"
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
        <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password *</label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            minLength="8"
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

  // Step 2: Address & Professional Category
  const Step2 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Street Address *</label>
        <div className="relative">
          <Home className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            placeholder="123 Main Street"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-sm font-medium text-slate-300 mb-2">City *</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              onKeyDown={handleKeyDown}
              placeholder="Delhi"
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              required
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            placeholder="Delhi"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-sm font-medium text-slate-300 mb-2">ZIP Code *</label>
          <input
            type="text"
            name="zipCode"
            value={formData.address.zipCode}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            placeholder="110001"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={formData.address.country}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            placeholder="India"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          />
        </div>
      </motion.div>

    
    </motion.div>
  );

  // Step 3: Services & Experience
  const Step3 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">College Name *</label>
        <input
          type="text"
          name="collegeName"
          value={formData.professionalDetails.collegeName}
          onChange={handleProfessionalDetailsChange}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Delhi University, IIT Delhi"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
        <div className="relative">
          <select
            name="department"
            value={formData.professionalDetails.department}
            onChange={handleProfessionalDetailsChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer pr-10 relative z-20"
            required
          >
            <option value="" className="bg-slate-900 text-white">Select department</option>
            <option value="B.Tech" className="bg-slate-900 text-white">B.Tech</option>
            <option value="M.Tech" className="bg-slate-900 text-white">M.Tech</option>
            <option value="MBA" className="bg-slate-900 text-white">MBA</option>
            <option value="MBS" className="bg-slate-900 text-white">MBS</option>
            <option value="Pharmacy" className="bg-slate-900 text-white">Pharmacy</option>
            <option value="LLB" className="bg-slate-900 text-white">LLB</option>
            <option value="B.Sc" className="bg-slate-900 text-white">B.Sc</option>
            <option value="M.Sc" className="bg-slate-900 text-white">M.Sc</option>
            <option value="Other" className="bg-slate-900 text-white">Other</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Year of Graduation *</label>
        <div className="relative">
          <select
            name="year"
            value={formData.professionalDetails.year}
            onChange={handleProfessionalDetailsChange}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer pr-10 relative z-20"
            required
          >
            <option value="" className="bg-slate-900 text-white">Select year of graduation</option>
            {Array.from({ length: 9 }, (_, i) => 2022 + i).map(year => (
              <option key={year} value={year} className="bg-slate-900 text-white">
                {year}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Bio (Max 500 chars) *</label>
        <textarea
          name="bio"
          value={formData.professionalDetails.bio}
          onChange={handleProfessionalDetailsChange}
          placeholder="Tell us about your experience and expertise..."
          rows="4"
          maxLength="500"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
          required
        />
        <p className="text-xs text-slate-500 mt-1">{formData.professionalDetails.bio.length}/500</p>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Add Services *</label>
        <div className="space-y-3 bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="space-y-2">
            <div className="relative">
              <select
                value={newService.category}
                onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer pr-8 relative z-20"
              >
                <option value="" className="bg-slate-900 text-white">Select service category</option>
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="Service name"
              maxLength="100"
              value={newService.name}
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <textarea
              placeholder="Service description"
              maxLength="300"
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              rows="2"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  placeholder="Price in INR"
                  min="50"
                  step="10"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full pl-8 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddService(e);
                }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {services.length > 0 && (
            <div className="border-t border-slate-600 pt-3 space-y-2">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-700 p-3 rounded-lg flex justify-between items-start gap-3"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-cyan-400 mb-1">{service.category}</p>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-sm text-slate-400 line-clamp-1">{service.description}</p>
                    <p className="text-cyan-400 font-semibold text-sm">₹ {service.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveService(e, index);
                    }}
                    className="p-2 hover:bg-red-600/30 rounded-lg text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Services added: {services.length}
        </p>
      </motion.div>
    </motion.div>
  );
const Step4 = () => (
  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
    
    <motion.div variants={itemVariants} className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 flex gap-3">
      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-300">
        Please upload your College ID and provide your College Gmail for verification.
      </p>
    </motion.div>

    {/* College ID */}
    <motion.div variants={itemVariants} className="group">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        College ID *
      </label>

      <label className="flex flex-col items-center justify-center w-full px-4 py-6 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
        <div className="flex flex-col items-center justify-center">

          {previews.collegeId ? (
            <>
              <img src={previews.collegeId} alt="Preview" className="w-20 h-12 rounded object-cover mb-2" />
              <p className="text-sm text-cyan-400 font-medium">Click to change</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">Upload your College ID</p>
            </>
          )}

        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => handleFileChange(e, 'collegeId')}
          className="hidden"
          required
        />
      </label>
    </motion.div>

    {/* College Gmail */}
    <motion.div variants={itemVariants} className="group">
      <label className="block text-sm font-medium text-slate-300 mb-2">College Gmail *</label>
      <div className="relative">
        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type="email"
          name="collegeGmail"
          value={formData.professionalDetails.collegeGmail}
          onChange={handleProfessionalDetailsChange}
          onKeyDown={handleKeyDown}
          placeholder="your.email@college.ac.in"
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">Must be your official college email address</p>
    </motion.div>

    <motion.div variants={itemVariants} className="bg-amber-900/30 border border-amber-800 rounded-lg p-3 flex gap-3">
      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-300">
        Your College ID will be verified by admin. You'll receive status updates via email.
      </p>
    </motion.div>

  </motion.div>
);
  // Step 5: Banking Details
  const Step5 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="bg-green-900/30 border border-green-800 rounded-lg p-3 flex gap-3">
        <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-300">Your banking details are encrypted and stored securely</p>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Bank Account Number (9-18 digits) *</label>
        <div className="relative">
          <Landmark className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            name="accountNumber"
            value={formData.professionalDetails.bankDetails.accountNumber}
            onChange={handleBankDetailsChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter account number"
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">IFSC Code (Format: SBIN0000001) *</label>
        <input
          type="text"
          name="ifsc"
          value={formData.professionalDetails.bankDetails.ifsc}
          onChange={handleBankDetailsChange}
          onKeyDown={handleKeyDown}
          placeholder="SBIN0000001"
          maxLength="11"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all uppercase"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">Account Holder Name *</label>
        <input
          type="text"
          name="accountHolderName"
          value={formData.professionalDetails.bankDetails.accountHolderName}
          onChange={handleBankDetailsChange}
          onKeyDown={handleKeyDown}
          placeholder="John Doe"
          maxLength="100"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID (Optional)</label>
        <input
          type="text"
          name="upiId"
          value={formData.professionalDetails.bankDetails.upiId}
          onChange={handleBankDetailsChange}
          onKeyDown={handleKeyDown}
          placeholder="john.doe@okhdfcbank"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
        />
        <p className="text-xs text-slate-500 mt-1">Format: username@bankname (optional)</p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">Please review all information before submitting. Ensure bank account details are accurate.</p>
      </motion.div>
    </motion.div>
  );

  const steps = [Step1, Step2, Step3, Step4, Step5];
  // Call the step function to return JSX instead of rendering it as a component
  // This avoids changing component identity and prevents remounts which cause focus loss
  const renderCurrentStep = () => steps[currentStep - 1]();

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

        {/* Step Content - Wrapped in form to prevent default submission */}
        <form
          className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep === STEPS.length) {
              handleSubmit(e);
            }
            return false;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              e.stopPropagation();
              if (currentStep === STEPS.length) {
                handleSubmit(e);
              } else {
                handleNext();
              }
            }
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">{STEPS[currentStep - 1].title}</h2>
            <p className="text-sm text-slate-400">{STEPS[currentStep - 1].description}</p>
          </div>

          {renderCurrentStep()}

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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrev();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-300 border-2 border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            <motion.button
              type={currentStep === STEPS.length ? 'submit' : 'button'}
              onClick={(e) => {
                if (currentStep !== STEPS.length) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }
              }}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {currentStep === STEPS.length ? 'Submitting...' : 'Processing...'}
                </>
              ) : (
                <>
                  {currentStep === STEPS.length ? 'Complete Registration' : 'Next Step'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </form>

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
