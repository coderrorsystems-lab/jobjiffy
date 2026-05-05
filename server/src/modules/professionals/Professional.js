import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['cleaning', 'beauty', 'repair', 'appliance', 'personalcare', 'other'],
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  desc: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const professionalSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  streetAddress: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String
  },
  zipCode: {
    type: String
  },
  collegeName: {
    type: String
  },
  department: {
    type: String
  },
  yearOfGraduation: {
    type: Number
  },
  collegeEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  collegeIdPhoto: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  services: {
    type: [serviceSchema],
    required: true,
    validate: [array => array.length > 0, 'At least one service required']
  },
  category: {
    type: String,
    enum: ['cleaning', 'beauty', 'repair', 'appliance', 'personalcare', 'other'],
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  kycDocuments: {
    aadhar: {
      type: String,
      required: true
    },
    pan: {
      type: String,
      required: true
    }
  },
  accountNumber: {
    type: String
  },
  accountHolderName: {
    type: String
  },
  ifscCode: {
    type: String
  },
  upiId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  refreshToken: {
    type: String,
    select: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

professionalSchema.index({ city: 1 });
professionalSchema.index({ status: 1 });
professionalSchema.index({ category: 1 });

professionalSchema.virtual('memberSince').get(function() {
  return this.createdAt;
});

professionalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

professionalSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

professionalSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

export default mongoose.model('Professional', professionalSchema);