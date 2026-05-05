import * as adminService from './adminService.js';

export const getProfile = async (req, res, next) => {
  try {
    const admin = await adminService.getAdminById(req.user.userId);
    if (!admin) {
      throw new Error('Admin not found');
    }
    res.json({ admin });
  } catch (error) {
    next(error);
  }
};

export const getAllProfessionals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }
    const professionals = await adminService.getAllProfessionals(query);
    res.json({ professionals });
  } catch (error) {
    next(error);
  }
};

export const getProfessionalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professional = await adminService.getProfessionalById(id);
    if (!professional) {
      throw new Error('Professional not found');
    }
    res.json({ professional });
  } catch (error) {
    next(error);
  }
};

export const approveProfessional = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professional = await adminService.approveProfessional(id);
    if (!professional) {
      throw new Error('Professional not found');
    }
    res.json({
      message: 'Professional approved successfully',
      professional
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProfessional = async (req, res, next) => {
  try {
    const { id } = req.params;
    const professional = await adminService.rejectProfessional(id);
    if (!professional) {
      throw new Error('Professional not found');
    }
    res.json({
      message: 'Professional rejected',
      professional
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    const users = await adminService.getAllUsers(query);
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await adminService.blockUser(id, isActive);
    if (!user) {
      throw new Error('User not found');
    }
    res.json({
      message: isActive ? 'User unblocked' : 'User blocked',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};