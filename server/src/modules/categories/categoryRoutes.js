import express from 'express';
import * as categoryController from './categoryController.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.get('/:id/services', categoryController.getServices);

export default router;