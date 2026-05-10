import * as authService from './authService.js';
import { generateOTP, storeOTP, sendOTPEmail } from '../../utils/otp.js';

// ==================== USER ====================

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, otp, img, bio, location } = req.body;
    const user = await authService.registerUser({ name, email, password, phone, img, bio, location }, otp);
    const tokens = authService.generateTokens(user, 'user', 'User');

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

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const { user, role: userRole, model } = await authService.login(email, password, role);
    const tokens = authService.generateTokens(user, userRole, model);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      user,
      role: userRole,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await authService.logout(req.user.userId, 'User');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// ==================== PROFESSIONAL ====================

export const registerProfessional = async (req, res, next) => {
  try {
    const { otp, ...data } = req.body;
    const professional = await authService.registerProfessional(data, otp);

    res.status(201).json({
      message: 'Professional registered successfully. Pending admin approval.',
      professional
    });
  } catch (error) {
    next(error);
  }
};

export const logoutProfessional = async (req, res, next) => {
  try {
    await authService.logout(req.user.userId, 'Professional');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN ====================

export const logoutAdmin = async (req, res, next) => {
  try {
    await authService.logout(req.user.userId, 'Admin');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

// ==================== COMMON ====================

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

// ==================== EMAIL OTP VERIFICATION ====================

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);

    res.json({ 
      message: 'OTP sent to your email'
    });
  } catch (error) {
    next(error);
  }
};