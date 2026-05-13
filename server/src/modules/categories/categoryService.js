import Category from './Category.js';

export const getAllCategories = async () => {
  return Category.find({ isActive: true }).sort({ id: 1 });
};

export const getCategoryById = async (categoryId) => {
  return Category.findOne({ id: categoryId, isActive: true });
};

export const getCategoryByIds = async (categoryIds) => {
  return Category.find({ id: { $in: categoryIds }, isActive: true });
};

export const addServiceToCategory = async (categoryId, serviceData, professionalId) => {
  const category = await Category.findOne({ id: categoryId, isActive: true });
  if (!category) {
    throw new Error('Category not found');
  }

  category.services.push({
    serviceName: serviceData.serviceName,
    description: serviceData.description,
    price: serviceData.price,
    professionalId: professionalId
  });

  await category.save();
  return category;
};

export const removeServiceFromCategory = async (categoryId, serviceId, professionalId) => {
  const category = await Category.findOne({ id: categoryId, isActive: true });
  if (!category) {
    throw new Error('Category not found');
  }

  const serviceIndex = category.services.findIndex(
    s => s._id.toString() === serviceId && s.professionalId.toString() === professionalId
  );

  if (serviceIndex === -1) {
    throw new Error('Service not found');
  }

  category.services.splice(serviceIndex, 1);
  await category.save();
  return category;
};

export const getServicesByCategory = async (categoryId) => {
  const category = await Category.findOne({ id: categoryId, isActive: true });
  if (!category) {
    throw new Error('Category not found');
  }
  return category.services;
};