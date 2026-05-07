import express from 'express';
import * as authController from './authController.js';
import { 
  validate, 
  userRegisterSchema, 
  professionalRegisterSchema, 
  loginSchema, 
  refreshTokenSchema,
  sendOtpSchema
} from '../../utils/validators.js';

const router = express.Router();

// ==================== COMMON ====================

router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// ==================== AUTH ====================

router.post('/login', validate(loginSchema), authController.login);

// ==================== REGISTRATION ====================

router.post('/user/register', validate(userRegisterSchema), authController.registerUser);
router.post('/professional/register', validate(professionalRegisterSchema), authController.registerProfessional);

// ==================== EMAIL OTP VERIFICATION ====================

router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);

export default router;