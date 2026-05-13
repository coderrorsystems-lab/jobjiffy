import * as categoryService from './categoryService.js';

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