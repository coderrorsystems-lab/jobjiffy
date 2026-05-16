import Professional from './Professional.js';

export const getProfessionalById = async (professionalId) => {
  return Professional.findById(professionalId);
};

export const updateProfessional = async (professionalId, updates) => {
  return Professional.findByIdAndUpdate(professionalId, updates, { new: true });
};

export const changePassword = async (professionalId, currentPassword, newPassword) => {
  const professional = await Professional.findById(professionalId).select('+password');
  
  if (!professional) {
    throw new Error('Professional not found');
  }

  const isMatch = await professional.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  professional.password = newPassword;
  await professional.save();
};

export const addService = async (professionalId, service) => {
  return Professional.findByIdAndUpdate(
    professionalId,
    { $push: { services: service } },
    { new: true }
  );
};

export const updateService = async (professionalId, serviceId, updates) => {
  return Professional.findOneAndUpdate(
    { _id: professionalId, 'services._id': serviceId },
    { $set: { 'services.$': { ...updates, _id: serviceId } } },
    { new: true }
  );
};

export const deleteService = async (professionalId, serviceId) => {
  return Professional.findByIdAndUpdate(
    professionalId,
    { $pull: { services: { _id: serviceId } } },
    { new: true }
  );
};

export const toggleAvailability = async (professionalId) => {
  const professional = await Professional.findById(professionalId);
  if (!professional) {
    throw new Error('Professional not found');
  }
  professional.isAvailable = !professional.isAvailable;
  await professional.save();
  return professional;
};

export const getWallet = async (professionalId) => {
  const professional = await Professional.findById(professionalId);
  if (!professional) {
    throw new Error('Professional not found');
  }
  return {
    walletBalance: professional.walletBalance,
    totalEarnings: professional.totalEarnings,
    rating: professional.rating,
    totalReviews: professional.totalReviews
  };
};

export const getAssignedBookings = async (professionalId) => {
  // TODO: Implement with bookings module
  // For now, return empty array as placeholder
  return [];
};

export const getAllProfessionals = async (query = {}) => {
  return Professional.find(query).select('-password -refreshToken');
};

export const approveProfessional = async (professionalId) => {
  return Professional.findByIdAndUpdate(
    professionalId,
    { status: 'approved', isAvailable: true },
    { new: true }
  );
};

export const rejectProfessional = async (professionalId) => {
  return Professional.findByIdAndUpdate(
    professionalId,
    { status: 'rejected', isAvailable: false },
    { new: true }
  );
};

export const getProfessionalsByStatus = async (status) => {
  return Professional.find({ status }).select('-password -refreshToken');
};

export const getAllServices = async () => {
  const professionals = await Professional.find({ status: 'approved' }).select('services');
  const allServices = [];
  
  professionals.forEach(prof => {
    if (prof.services && prof.services.length > 0) {
      allServices.push(...prof.services);
    }
  });
  
  return allServices;
};

export const getProfessionalsByServiceId = async (serviceId) => {
  return Professional.find(
    { 
      status: 'approved',
      'services._id': serviceId 
    },
    {
      password: 0,
      refreshToken: 0
    }
  );
};