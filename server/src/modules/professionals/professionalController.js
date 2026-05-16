import * as professionalService from './professionalService.js';

export const getProfile = async (req, res, next) => {
  try {
    const professional = await professionalService.getProfessionalById(req.user.userId);
    if (!professional) {
      throw new Error('Professional not found');
    }
    res.json({ professional });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'fullname', 'bio', 'streetAddress', 'city', 'state', 'zipCode',
      'collegeName', 'department', 'yearOfGraduation', 'collegeEmail', 'collegeIdPhoto',
      'accountNumber', 'accountHolderName', 'ifscCode', 'upiId'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const professional = await professionalService.updateProfessional(req.user.userId, updates);

    res.json({
      message: 'Profile updated successfully',
      professional
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await professionalService.changePassword(req.user.userId, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const professional = await professionalService.getProfessionalById(req.user.userId);
    if (!professional) {
      throw new Error('Professional not found');
    }
    res.json({ services: professional.services });
  } catch (error) {
    next(error);
  }
};

export const addService = async (req, res, next) => {
  try {
    const { category, serviceName, desc, price } = req.body;
    const professional = await professionalService.addService(req.user.userId, {
      category,
      serviceName,
      desc,
      price
    });
    res.json({
      message: 'Service added successfully',
      services: professional.services
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professional = await professionalService.updateService(req.user.userId, id, req.body);
    if (!professional) {
      throw new Error('Service not found');
    }
    res.json({
      message: 'Service updated successfully',
      services: professional.services
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professional = await professionalService.deleteService(req.user.userId, id);
    res.json({
      message: 'Service deleted successfully',
      services: professional.services
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const professional = await professionalService.toggleAvailability(req.user.userId);
    res.json({
      message: `Availability ${professional.isAvailable ? 'enabled' : 'disabled'}`,
      isAvailable: professional.isAvailable
    });
  } catch (error) {
    next(error);
  }
};

export const getWallet = async (req, res, next) => {
  try {
    const wallet = await professionalService.getWallet(req.user.userId);
    res.json({ wallet });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await professionalService.getAssignedBookings(req.user.userId);
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const services = await professionalService.getAllServices();
    res.json({ services });
  } catch (error) {
    next(error);
  }
};

export const getProfessionalsByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const professionals = await professionalService.getProfessionalsByServiceId(serviceId);
    
    if (!professionals || professionals.length === 0) {
      return res.status(404).json({ 
        message: 'No professionals found for this service',
        professionals: [] 
      });
    }
    
    res.json({ professionals });
  } catch (error) {
    next(error);
  }
};