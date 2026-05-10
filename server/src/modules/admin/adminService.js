import Admin from './Admin.js';
import User from '../users/User.js';
import Professional from '../professionals/Professional.js';

export const getAdminById = async (adminId) => {
  return Admin.findById(adminId);
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

export const getAllUsers = async (query = {}) => {
  return User.find(query).select('-password -refreshToken');
};

export const blockUser = async (userId, isActive) => {
  return User.findByIdAndUpdate(userId, { isActive }, { new: true });
};

export const getDashboardStats = async () => {
  // TODO: Replace with actual aggregation queries when bookings module is implemented
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalProfessionals = await Professional.countDocuments({ isActive: true });
  const approvedProfessionals = await Professional.countDocuments({ status: 'approved', isActive: true });
  const pendingProfessionals = await Professional.countDocuments({ status: 'pending' });
  
  return {
    totalUsers,
    totalProfessionals,
    approvedProfessionals,
    pendingProfessionals,
    totalBookings: 0, // TODO: Implement with bookings module
    totalRevenue: 0  // TODO: Implement with payments module
  };
};

export const getProfessionalsByStatus = async (status) => {
  return Professional.find({ status }).select('-password -refreshToken');
};

export const getProfessionalById = async (professionalId) => {
  return Professional.findById(professionalId).select('-password -refreshToken');
};

export const getUserById = async (userId) => {
  return User.findById(userId).select('-password -refreshToken');
};

export const deleteUser = async (userId) => {
  return User.findByIdAndDelete(userId);
};

export const resetUserPassword = async (userId) => {
  // TODO: Implement password reset email flow
  // For now, generate a temporary password and send via email
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  // In a real implementation, you'd generate a reset token and send email
  return {
    userId: user._id,
    email: user.email,
    message: 'Password reset email would be sent to user'
  };
};