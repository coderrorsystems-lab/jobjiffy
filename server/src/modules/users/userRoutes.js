import express from 'express';
import * as userController from './userController.js';
import { logoutUser } from '../auth/authController.js';
import { validate, userUpdateProfileSchema, userChangePasswordSchema } from './validators.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(userUpdateProfileSchema), userController.updateProfile);
router.post('/change-password', validate(userChangePasswordSchema), userController.changePassword);
router.get('/bookings', userController.getBookings);
router.get('/reviews', userController.getReviews);
router.post('/logout', logoutUser);

export default router;