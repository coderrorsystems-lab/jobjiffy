import User from './User.js';

export const getUserById = async (userId) => {
  return User.findById(userId);
};

export const updateUser = async (userId, updates) => {
  return User.findByIdAndUpdate(userId, updates, { new: true });
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
};

export const getUserBookings = async (userId) => {
  // TODO: Implement with bookings module
  // For now, return empty array as placeholder
  return [];
};

export const getUserReviews = async (userId) => {
  // TODO: Implement with reviews module
  // For now, return empty array as placeholder
  return [];
};

export const getAllUsers = async (query = {}) => {
  return User.find(query).select('-password -refreshToken');
};

export const blockUser = async (userId, isActive) => {
  return User.findByIdAndUpdate(userId, { isActive }, { new: true });
};