import express from 'express';
import * as authController from './controller.js';
import { validate, userRegisterSchema, professionalRegisterSchema, loginSchema, refreshTokenSchema } from '../../utils/validators.js';
import { authenticate } from '../../middlewares/auth.js';
                                          
const router = express.Router();

router.post('/register/user', validate(userRegisterSchema), authController.register);
router.post('/register/professional', validate(professionalRegisterSchema), authController.registerProfessional);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

router.post('/admin/login', validate(loginSchema), authController.adminLogin);

router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

export default router;                                   
