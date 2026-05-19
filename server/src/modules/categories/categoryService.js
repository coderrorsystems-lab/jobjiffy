import Category from './Category.js';
import Professional from '../professionals/Professional.js';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map();

const getCacheKey = (categoryId, options) => {
  return `category:${categoryId}:${JSON.stringify(options)}`;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

// Run cleanup every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000);

export const getAllCategories = async () => {
  return Category.find({ isActive: true }).sort({ id: 1 });
};

export const getCategoryById = async (categoryId) => {
  return Category.findOne({ id: categoryId, isActive: true });
};

export const getCategoryByIds = async (categoryIds) => {
  return Category.find({ id: { $in: categoryIds }, isActive: true });
};

export const getServicesWithProfessionals = async (categoryId, options = {}) => {
  const { page = 1, limit = 20, sort = 'price_asc', available = true } = options;
  const cacheKey = getCacheKey(categoryId, { page, limit, sort, available });

  // Check cache first
  const cachedResult = getCache(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // Validate category exists
  const category = await Category.findOne({ id: categoryId, isActive: true });
  if (!category) {
    throw new Error('Category not found');
  }

  // Extract all professional IDs from services
  const professionalIds = [...new Set(
    category.services
      .filter(s => s.professionalId)
      .map(s => s.professionalId)
  )];

  // Build professional filter
  const professionalFilter = {
    _id: { $in: professionalIds },
    status: 'approved'
  };
  if (available) {
    professionalFilter.isAvailable = true;
  }

  // Fetch professionals
  const professionals = await Professional.find(professionalFilter).select('_id fullname rating');
  const professionalMap = new Map(
    professionals.map(p => [p._id.toString(), { name: p.fullname, rating: p.rating }])
  );

  // Build services with professional info
  let servicesWithProfessionals = category.services
    .filter(s => s.professionalId && professionalMap.has(s.professionalId.toString()))
    .map(s => ({
      serviceId: s._id.toString(),
      serviceName: s.serviceName,
      description: s.description,
      price: s.price,
      professional: {
        id: s.professionalId.toString(),
        name: professionalMap.get(s.professionalId.toString()).name,
        rating: professionalMap.get(s.professionalId.toString()).rating
      },
      createdAt: s._id.getTimestamp()
    }));

  // Apply sorting
  switch (sort) {
    case 'price_asc':
      servicesWithProfessionals.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      servicesWithProfessionals.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      servicesWithProfessionals.sort((a, b) => b.professional.rating - a.professional.rating);
      break;
    case 'newest':
      servicesWithProfessionals.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      servicesWithProfessionals.sort((a, b) => a.price - b.price);
  }

  // Pagination
  const totalServices = servicesWithProfessionals.length;
  const totalPages = Math.ceil(totalServices / limit);
  const skip = (page - 1) * limit;
  const paginatedServices = servicesWithProfessionals.slice(skip, skip + limit);

  const result = {
    categoryId: category.id,
    categoryName: category.name,
    totalServices,
    totalPages,
    currentPage: page,
    perPage: limit,
    services: paginatedServices.map(({ serviceId, serviceName, description, price, professional }) => ({
      serviceId,
      serviceName,
      description,
      price,
      professional
    }))
  };

  // Cache the result
  setCache(cacheKey, result);

  return result;
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

  // Invalidate cache for this category
  for (const key of cache.keys()) {
    if (key.startsWith(`category:${categoryId}:`)) {
      cache.delete(key);
    }
  }

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

  // Invalidate cache for this category
  for (const key of cache.keys()) {
    if (key.startsWith(`category:${categoryId}:`)) {
      cache.delete(key);
    }
  }

  return category;
};

export const getServicesByCategory = async (categoryId) => {
  const category = await Category.findOne({ id: categoryId, isActive: true });
  if (!category) {
    throw new Error('Category not found');
  }
  return category.services;
};