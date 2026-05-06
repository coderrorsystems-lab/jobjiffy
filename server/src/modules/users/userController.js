import * as userService from './userService.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, img, location } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (img) updates.img = img;
    if (location) updates.location = location;

    const user = await userService.updateUser(req.user.userId, updates);

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user.userId, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await userService.getUserBookings(req.user.userId);
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await userService.getUserReviews(req.user.userId);
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};