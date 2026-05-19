import express from 'express';
import * as categoryController from './categoryController.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.get('/:id/services', categoryController.getServices);
router.get('/:id/services-with-professionals', categoryController.getServicesWithProfessionals);

export default router;