import * as authService from './authService.js';

// ==================== USER ====================

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, img, bio, location } = req.body;
    const user = await authService.registerUser({ name, email, password, phone, img, bio, location });
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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    const tokens = authService.generateTokens(user, 'user', 'User');

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
    const professional = await authService.registerProfessional(req.body);

    res.status(201).json({
      message: 'Professional registered successfully. Pending admin approval.',
      professional
    });
  } catch (error) {
    next(error);
  }
};

export const loginProfessional = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const professional = await authService.loginProfessional(email, password);
    const tokens = authService.generateTokens(professional, 'professional', 'Professional');

    professional.refreshToken = tokens.refreshToken;
    await professional.save();

    res.json({
      message: 'Login successful',
      professional,
      ...tokens
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

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await authService.loginAdmin(email, password);
    const tokens = authService.generateTokens(admin, 'admin', 'Admin');

    admin.refreshToken = tokens.refreshToken;
    await admin.save();

    res.json({
      message: 'Admin login successful',
      admin,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

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