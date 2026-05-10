import express from 'express';
import * as adminController from './adminController.js';
import { logoutAdmin } from '../auth/authController.js';
import { validate, approveRejectSchema, blockUserSchema } from './validators.js';
import { authenticate, authorize } from '../../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/profile', adminController.getProfile);

router.get('/professionals', adminController.getAllProfessionals);
router.get('/professionals/:id', adminController.getProfessionalById);
router.put('/professionals/:id/approve', adminController.approveProfessional);
router.put('/professionals/:id/reject', adminController.rejectProfessional);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/block', validate(blockUserSchema), adminController.blockUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

router.get('/dashboard', adminController.getDashboard);
router.post('/logout', logoutAdmin);

export default router;