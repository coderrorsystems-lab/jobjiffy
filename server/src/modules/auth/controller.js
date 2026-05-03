import bcrypt from 'bcryptjs';
import * as authService from './service.js';
import User from './model.js';
import { config } from '../../config/index.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    console.log('Registering user with data:', { name, email, phone, address });
    const user = await authService.registerUser({ name, email, password, phone, address });
    const tokens = authService.generateTokens(user);
   console.log('Generated tokens:', tokens);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const registerProfessional = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, professionalDetails } = req.body;
    const user = await authService.registerProfessional({
      name,
      email,
      password,
      phone,
      address,
      professionalDetails
    });

    res.status(201).json({
      message: 'Professional registered successfully. Pending admin approval.',
      user: {
        ...user.toJSON(),
        status: user.professionalDetails?.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Attempting login for email in backend:', email, password);
    const user = await authService.loginUser(email, password);
    const tokens = authService.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      user,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    
    res.json({
      message: 'Token refreshed successfully',
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.userId);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminConfig = authService.getAdminCredentials();

    if (email !== adminConfig.email) {
      throw new Error('Invalid admin credentials');
    }

    const isMatch = await bcrypt.compare(password, adminConfig.password);
    if (!isMatch) {
      throw new Error('Invalid admin credentials');
    }

    const admin = await User.findOne({ email, role: 'admin' });
    
    if (!admin) {
      const newAdmin = new User({
        name: 'Admin',
        email,
        phone: '+911234567890',
        password: adminConfig.password,
        role: 'admin',
        isActive: true,
        isEmailVerified: true
      });
      await newAdmin.save();
      
      const tokens = authService.generateTokens(newAdmin);
      return res.json({
        message: 'Admin login successful',
        user: newAdmin,
        ...tokens
      });
    }

    const tokens = authService.generateTokens(admin);
    admin.refreshToken = tokens.refreshToken;
    await admin.save();

    res.json({
      message: 'Admin login successful',
      user: admin,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, address, profilePhoto } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (address) updates.address = address;
    if (profilePhoto) updates.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};