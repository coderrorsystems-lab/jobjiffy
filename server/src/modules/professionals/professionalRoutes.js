import express from 'express';
import * as professionalController from './professionalController.js';
import { logoutProfessional } from '../auth/authController.js';
import { 
  validate, 
  professionalUpdateProfileSchema, 
  professionalChangePasswordSchema,
  addServiceSchema,
  updateServiceSchema
} from './validators.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/all-services', professionalController.getAllServices);
router.get('/:serviceId', professionalController.getProfessionalsByService);

// Protected routes (authentication required)
router.use(authenticate);

router.get('/profile', professionalController.getProfile);
router.put('/profile', validate(professionalUpdateProfileSchema), professionalController.updateProfile);
router.post('/change-password', validate(professionalChangePasswordSchema), professionalController.changePassword);

router.get('/services', professionalController.getServices);
router.post('/services', validate(addServiceSchema), professionalController.addService);
router.put('/services/:id', validate(updateServiceSchema), professionalController.updateService);
router.delete('/services/:id', professionalController.deleteService);

router.post('/availability', professionalController.toggleAvailability);
router.get('/wallet', professionalController.getWallet);
router.get('/bookings', professionalController.getBookings);
router.post('/logout', logoutProfessional);

export default router;