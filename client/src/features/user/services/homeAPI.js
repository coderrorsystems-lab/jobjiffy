import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Add Authorization header to requests
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

// ==================== SERVICES ====================

// Fetch all services from backend
export async function fetchAllServices() {
  try {
    const response = await apiClient.get('/api/prof/allservices');
    return response.data;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch all services');
  }
}

// ==================== PROFESSIONALS SEARCH & BROWSE ====================


export async function fetchProfessionalsByServiceId(serviceId) {
  try {
    const response = await apiClient.get(`/api/prof/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professionals by service ID:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch professionals');
  }
}

export async function fetchProfessionals({ service = '', search = '', sort = 'top_rated', availableToday = false } = {}) {
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

export async function searchProfessionals(query) {
  try {
    const response = await apiClient.get('/api/professionals/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching professionals:', error);
    throw new Error(error.response?.data?.message || 'Failed to search professionals');
  }
}

export async function searchProfessionalByUserId(userId) {
  try {
    const response = await apiClient.get('/api/professionals/search', {
      params: { userId: userId.toUpperCase() },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching professional by userId:', error);
    throw new Error(error.response?.data?.message || 'Professional not found');
  }
}

export default apiClient;
