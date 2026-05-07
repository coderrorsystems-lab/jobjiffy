import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../users/User.js';
import Professional from '../professionals/Professional.js';
import Admin from '../admin/Admin.js';
import { config } from '../../config/index.js';
import { verifyOTP } from '../../utils/otp.js';

export const generateTokens = (user, role, model) => {
  const accessToken = jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role,
      model
    },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpire }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role, model },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );

  return { accessToken, refreshToken };
};

// ==================== LOGIN (Single Endpoint) ====================

export const login = async (email, password, role) => {
  switch (role) {
    case 'user': {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials');
      }
      if (!user.isActive) {
        throw new Error('Account is disabled');
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      user.lastLogin = new Date();
      await user.save();
      return { user, role: 'user', model: 'User' };
    }

    case 'professional': {
      const professional = await Professional.findOne({ email }).select('+password');
      if (!professional) {
        throw new Error('Invalid credentials');
      }
      if (!professional.isActive) {
        throw new Error('Account is disabled');
      }
      if (professional.status !== 'approved') {
        throw new Error('Account pending approval');
      }
      const isMatch = await professional.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      professional.lastLogin = new Date();
      await professional.save();
      return { user: professional, role: 'professional', model: 'Professional' };
    }

    case 'admin': {
      const adminConfig = getAdminCredentials();
      if (email !== adminConfig.email) {
        throw new Error('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, adminConfig.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      let admin = await Admin.findOne({ email });
      if (!admin) {
        admin = new Admin({
          name: 'Admin',
          email,
          phone: '+911234567890',
          password: adminConfig.password,
          isActive: true,
          isSuperAdmin: true,
          permissions: ['*']
        });
        await admin.save();
      }
      admin.lastLogin = new Date();
      await admin.save();
      return { user: admin, role: 'admin', model: 'Admin' };
    }

    default:
      throw new Error('Invalid role');
  }
};

// ==================== REGISTRATION ====================

export const registerUser = async (data, otp) => {
  const otpResult = verifyOTP(data.email, otp);
  if (!otpResult.valid) {
    throw new Error(otpResult.error);
  }

  const existingUser = await User.findOne({ 
    $or: [{ email: data.email }, { phone: data.phone }] 
  });
  
  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new Error('Email already registered');
    }
    if (existingUser.phone === data.phone) {
      throw new Error('Phone number already registered');
    }
  }

  const user = new User({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    img: data.img,
    bio: data.bio,
    location: data.location,
    isEmailVerified: true
  });

  await user.save();
  return user;
};

export const registerProfessional = async (data, otp) => {
  const otpResult = verifyOTP(data.email, otp);
  if (!otpResult.valid) {
    throw new Error(otpResult.error);
  }

  const existingProfessional = await Professional.findOne({ 
    $or: [{ email: data.email }, { phone: data.phone }] 
  });
  
  if (existingProfessional) {
    if (existingProfessional.email === data.email) {
      throw new Error('Email already registered');
    }
    if (existingProfessional.phone === data.phone) {
      throw new Error('Phone number already registered');
    }
  }

  const professional = new Professional({
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    password: data.password,
    streetAddress: data.streetAddress,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    collegeName: data.collegeName,
    department: data.department,
    yearOfGraduation: data.yearOfGraduation,
    collegeEmail: data.collegeEmail,
    collegeIdPhoto: data.collegeIdPhoto,
    bio: data.bio,
    services: data.services,
    category: data.category,
    experience: data.experience,
    kycDocuments: data.kycDocuments,
    accountNumber: data.accountNumber,
    accountHolderName: data.accountHolderName,
    ifscCode: data.ifscCode,
    upiId: data.upiId,
    status: 'pending',
    isAvailable: false,
    isEmailVerified: true
  });

  await professional.save();
  return professional;
};

// ==================== TOKEN REFRESH ====================

export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    
    let Model;
    switch (decoded.model) {
      case 'User':
        Model = User;
        break;
      case 'Professional':
        Model = Professional;
        break;
      case 'Admin':
        Model = Admin;
        break;
      default:
        throw new Error('Invalid token model');
    }

    const user = await Model.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new Error('Invalid refresh token');
    }

    const tokens = generateTokens(user, decoded.role, decoded.model);
    
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// ==================== LOGOUT ====================

export const logout = async (userId, model) => {
  let Model;
  switch (model) {
    case 'User':
      Model = User;
      break;
    case 'Professional':
      Model = Professional;
      break;
    case 'Admin':
      Model = Admin;
      break;
    default:
      return;
  }
  await Model.findByIdAndUpdate(userId, { refreshToken: null });
};

// ==================== ADMIN ====================

export const getAdminCredentials = () => {
  return {
    email: config.admin.email,
    password: config.admin.password
  };
};