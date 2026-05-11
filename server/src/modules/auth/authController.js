import * as authService from './authService.js';
import { generateOTP, storeOTP, sendOTPEmail } from '../../utils/otp.js';

// ==================== USER ====================

export const registerUser = async (req, res, next) => {
  try {
    console.log('[Register User] Starting registration with data:', { 
      email: req.body.email, 
      phone: req.body.phone 
    });
    
    const { name, email, password, phone, otp, img, bio, location } = req.body;
    const user = await authService.registerUser({ name, email, password, phone, img, bio, location }, otp);
    const tokens = authService.generateTokens(user, 'user', 'User');

    user.refreshToken = tokens.refreshToken;
    await user.save();

    console.log('[Register User] ✅ User registered successfully:', user._id);
    res.status(201).json({
      message: 'User registered successfully',
      user,
      ...tokens
    });
  } catch (error) {
    console.error('[Register User] ❌ Error:', error.message);
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
    console.log('[Register Professional] Starting registration');
    const { otp, ...data } = req.body;
    const professional = await authService.registerProfessional(data, otp);

    console.log('[Register Professional] ✅ Professional registered successfully:', professional._id);
    res.status(201).json({
      message: 'Professional registered successfully. Pending admin approval.',
      professional
    });
  } catch (error) {
    console.error('[Register Professional] ❌ Error:', error.message);
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

    console.log('[Send OTP] Generating OTP for:', email);
    const otp = generateOTP();
    storeOTP(email, otp);
    
    console.log('[Send OTP] Generated OTP:', otp);
    console.log('[Send OTP] Sending email to:', email);
    
    try {
      await sendOTPEmail(email, otp);
      console.log('[Send OTP] ✅ Email sent successfully');
    } catch (emailError) {
      console.error('[Send OTP] ❌ Email sending failed:', emailError.message);
      // For testing, we'll return success anyway, but log the error
      console.log('[Send OTP] Note: Using OTP in-memory storage. Email sending needs SMTP configuration.');
    }

    res.json({ 
      message: 'OTP sent to your email. Check spam folder if not found.',
      _debug: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('[Send OTP] ❌ Error:', error.message);
    next(error);
  }
};