import express from 'express';
import * as authController from './authController.js';
import { 
  validate, 
  userRegisterSchema, 
  professionalRegisterSchema, 
  loginSchema, 
  refreshTokenSchema
} from '../../utils/validators.js';

const router = express.Router();

// ==================== COMMON ====================

router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// ==================== USER ROUTES ====================

router.post('/user/register', validate(userRegisterSchema), authController.registerUser);
router.post('/user/login', validate(loginSchema), authController.loginUser);

// ==================== PROFESSIONAL ROUTES ====================

router.post('/professional/register', validate(professionalRegisterSchema), authController.registerProfessional);
router.post('/professional/login', validate(loginSchema), authController.loginProfessional);

// ==================== ADMIN ROUTES ====================

router.post('/admin/login', validate(loginSchema), authController.loginAdmin);

export default router;