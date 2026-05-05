import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import User from '../modules/users/User.js';
import Professional from '../modules/professionals/Professional.js';
import Admin from '../modules/admin/Admin.js';

const getModelByRole = (role) => {
  switch (role) {
    case 'user':
      return User;
    case 'professional':
      return Professional;
    case 'admin':
      return Admin;
    default:
      return null;
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const Model = getModelByRole(decoded.role);
    if (!Model) {
      return res.status(401).json({ message: 'Invalid role in token' });
    }

    const user = await Model.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: decoded.role,
      model: decoded.model
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const Model = getModelByRole(decoded.role);
    if (Model) {
      const user = await Model.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          email: user.email,
          role: decoded.role,
          model: decoded.model
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
};