import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Add Authorization header to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== USER PROFILE ====================

/**
 * Get user profile
 * GET /api/users/profile
 */
export async function getUserProfile() {
  try {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
}

/**
 * Update user profile
 * PUT /api/users/profile
 */
export async function updateUserProfile(profileData) {
  try {
    const response = await apiClient.put('/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
}

/**
 * Change user password
 * POST /api/users/change-password
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    const response = await apiClient.post('/api/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
}


/**
 * Logout user
 * POST /api/users/logout
 */
export async function logoutUser() {
  try {
    const response = await apiClient.post('/api/users/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error(error.response?.data?.message || 'Failed to logout');
  }
}

// ==================== PROFESSIONAL PROFILE ====================

/**
 * Get professional profile
 * GET /api/professionals/profile
 */
export async function getProfessionalProfile() {
  try {
    const response = await apiClient.get('/api/professionals/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching professional profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch professional profile');
  }
}

/**
 * Update professional profile
 * PUT /api/professionals/profile
 */
export async function updateProfessionalProfile(profileData) {
  try {
    const response = await apiClient.put('/api/professionals/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating professional profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update professional profile');
  }
}

/**
 * Change professional password
 * POST /api/professionals/change-password
 */
export async function changeProfessionalPassword(currentPassword, newPassword) {
  try {
    const response = await apiClient.post('/api/professionals/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error changing professional password:', error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
}

/**
 * Get professional services
 * GET /api/professionals/services
 */
export async function getProfessionalServices() {
  try {
    const response = await apiClient.get('/api/professionals/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching professional services:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
}

/**
 * Add professional service
 * POST /api/professionals/services
 */
export async function addProfessionalService(serviceData) {
  try {
    const response = await apiClient.post('/api/professionals/services', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error adding service:', error);
    throw new Error(error.response?.data?.message || 'Failed to add service');
  }
}

/**
 * Update professional service
 * PUT /api/professionals/services/:id
 */
export async function updateProfessionalService(serviceId, serviceData) {
  try {
    const response = await apiClient.put(`/api/professionals/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error(error.response?.data?.message || 'Failed to update service');
  }
}

/**
 * Delete professional service
 * DELETE /api/professionals/services/:id
 */
export async function deleteProfessionalService(serviceId) {
  try {
    const response = await apiClient.delete(`/api/professionals/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete service');
  }
}

/**
 * Toggle professional availability
 * POST /api/professionals/availability
 */
export async function toggleProfessionalAvailability() {
  try {
    const response = await apiClient.post('/api/professionals/availability');
    return response.data;
  } catch (error) {
    console.error('Error toggling availability:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle availability');
  }
}

/**
 * Get professional wallet info
 * GET /api/professionals/wallet
 */
export async function getProfessionalWallet() {
  try {
    const response = await apiClient.get('/api/professionals/wallet');
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch wallet info');
  }
}

/**
 * Get professional bookings
 * GET /api/professionals/bookings
 */
export async function getProfessionalBookings() {
  try {
    const response = await apiClient.get('/api/professionals/bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching professional bookings:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
}

/**
 * Logout professional
 * POST /api/professionals/logout
 */
export async function logoutProfessional() {
  try {
    const response = await apiClient.post('/api/professionals/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error(error.response?.data?.message || 'Failed to logout');
  }
}
