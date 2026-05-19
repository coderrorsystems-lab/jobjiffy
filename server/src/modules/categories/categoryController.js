import * as categoryService from './categoryService.js';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).default('price_asc'),
  available: z.coerce.boolean().default(true)
});

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(parseInt(id));
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const { id } = req.params;
    const services = await categoryService.getServicesByCategory(parseInt(id));
    res.json({ services });
  } catch (error) {
    next(error);
  }
};

export const getServicesWithProfessionals = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId) || categoryId < 101 || categoryId > 109) {
      return res.status(400).json({ message: 'Invalid category ID. Must be between 101 and 109.' });
    }

    const parseResult = querySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: parseResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    const { page, limit, sort, available } = parseResult.data;

    const result = await categoryService.getServicesWithProfessionals(categoryId, {
      page,
      limit,
      sort,
      available
    });

    res.json(result);
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ message: 'Category not found' });
    }
    next(error);
  }
};