import jwt from 'jsonwebtoken';
import User from './model.js';
import { config } from '../../config/index.js';

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpire }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (data) => {
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
    role: 'user',
    address: data.address
  });

  await user.save();
  return user;
};

export const registerProfessional = async (data) => {
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
    role: 'professional',
    address: data.address,
    professionalDetails: {
      ...data.professionalDetails,
      status: 'pending',
      isAvailable: false
    }
  });

  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is disabled');
  }

  if (user.role === 'professional' && user.professionalDetails?.status !== 'approved') {
    throw new Error('Your account is pending approval');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new Error('Invalid refresh token');
    }

    const tokens = generateTokens(user);
    
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getAdminCredentials = () => {
  return {
    email: config.admin.email,
    password: config.admin.password
  };
};