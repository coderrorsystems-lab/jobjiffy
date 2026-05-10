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

export async function updateUserProfile(profileData) {
  try {
    const response = await apiClient.put('/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
}

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

// ==================== PROFESSIONAL PROFILE ====================

export async function updateProfessionalProfile(profileData) {
  try {
    const response = await apiClient.put('/api/professionals/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating professional profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update professional profile');
  }
}

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
