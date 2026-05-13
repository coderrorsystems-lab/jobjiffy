import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../users/User.js';
import Professional from '../professionals/Professional.js';
import Admin from '../admin/Admin.js';
import Category from '../categories/Category.js';
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
      console.log('Admin login attempt with email:', email);
      const adminConfig = getAdminCredentials();
      if (email !== adminConfig.email) {
        throw new Error('Invalid credentials');
      }
      // const isMatch = await bcrypt.compare(password, adminConfig.password);
      // if (!isMatch) {
      //   throw new Error('Invalid credentials');
      // }
      let admin = await Admin.findOne({ email });
      const hashedPassword = await bcrypt.hash(adminConfig.password, 10);
      if (!admin) {
        // console.log('Admin not found in database, creating new admin with default credentials');
        admin = new Admin({
          name: 'Admin',
          email,
          phone: '+911234567890',
          password: hashedPassword,
          isActive: true,
          isSuperAdmin: true,
          permissions: [
  'users:read',
  'users:write',
  'users:delete',
  'professionals:read',
  'professionals:write',
  'professionals:approve',
  'bookings:read',
  'bookings:write',
  'bookings:delete',
  'categories:read',
  'categories:write',
  'banners:read',
  'banners:write',
  'reports:read',
  'settings:write'
]
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
  console.log('[Auth Service] registerUser started for email:', data.email);
  
  const otpResult = verifyOTP(data.email, otp);
  if (!otpResult.valid) {
    console.error('[Auth Service] OTP verification failed:', otpResult.error);
    throw new Error(otpResult.error);
  }

  console.log('[Auth Service] OTP verified successfully');

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

  console.log('[Auth Service] Creating new user with email:', data.email);
  
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
  console.log('[Auth Service] ✅ User created successfully:', user._id);
  return user;
};

export const registerProfessional = async (data, otp) => {
  console.log('[Auth Service] registerProfessional started for email:', data.email);
  
  const otpResult = verifyOTP(data.email, otp);
  if(!otpResult.valid) {
    console.error('[Auth Service] OTP verification failed:', otpResult.error);
    throw new Error(otpResult.error);
  }
  
  console.log('[Auth Service] OTP verified successfully for professional');
  
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

  console.log('[Auth Service] Creating new professional with email:', data.email);

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
    categories: data.categories,
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

  console.log('[Auth Service] Professional created with ID:', professional._id);
  console.log('[Auth Service] Categories assigned:', data.categories);
  console.log('[Auth Service] Services to add:', data.services);

  if (data.categories && data.categories.length > 0) {
    for (const catId of data.categories) {
      const category = await Category.findOne({ id: catId });
      if (category) {
        console.log('[Auth Service] Found category:', catId, '-', category.name);
      } else {
        console.warn('[Auth Service] Category not found:', catId);
      }
    }
  }

  if (data.services && data.services.length > 0) {
    for (const service of data.services) {
      const result = await Category.updateOne(
        { id: service.categoryId },
        { $push: { services: { serviceName: service.serviceName, description: service.description || service.desc, price: service.price, professionalId: professional._id } } }
      );
      console.log('[Auth Service] Added service to category', service.categoryId, ':', result.modifiedCount > 0 ? 'success' : 'failed');
    }
  }
  console.log('[Auth Service] ✅ Professional created successfully:', professional._id);
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