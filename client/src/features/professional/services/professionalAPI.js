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

export async function fetchProfessionalsByService({ service = '', search = '', sort = 'top_rated', availableToday = false } = {}) {
  try {
    const response = await apiClient.get('/api/professionals', {
      params: {
        service,
        search,
        sort,
        availableToday,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch professionals');
  }
}

// ==================== SERVICES ====================

export async function fetchServices({ query = '', limit = 8, offset = 0 } = {}) {
  try {
    const response = await apiClient.get('/api/services', {
      params: {
        q: query,
        limit,
        offset,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
}

export default apiClient;
