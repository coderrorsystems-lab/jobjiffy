import axios from 'axios';
import { getAuthToken, clearAuthData } from '../../../utils/authUtils';

const API = axios.create({ 
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin',
  timeout: 15000 
});

// Add auth token to every request
API.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[Admin API] ${config.method?.toUpperCase()} ${config.url}`, { token: token ? '***' : 'none' });
  return config;
}, error => Promise.reject(error));

// Log responses and errors + Handle token expiration
API.interceptors.response.use(
  response => {
    console.log(`[Admin API] Response ${response.status}`, response.data);
    return response;
  },
  error => {
    console.error(`[Admin API] Error:`, {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.message
    });

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401) {
      console.warn('[Admin API] Token expired or invalid. Clearing auth and redirecting to login...');
      clearAuthData();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ==================== PROFESSIONAL MANAGEMENT ====================

export const fetchProfessionals = async () => {
  const res = await API.get('/professionals');
  return res.data;
};

export const fetchProfessional = async (id) => {
  const res = await API.get(`/professionals/${id}`);
  return res.data;
};

export const approveProfessional = async (id) => {
  const res = await API.put(`/professionals/${id}/approve`);
  return res.data;
};

// ==================== USER MANAGEMENT ====================

export const fetchUsers = async () => {
  const res = await API.get('/users');
  return res.data;
};

export const fetchUser = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

export const blockUser = async (id, isActive) => {
  const res = await API.put(`/users/${id}/block`, { isActive });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

export const resetUserPassword = async (id) => {
  const res = await API.post(`/users/${id}/reset-password`);
  return res.data;
};

export default API;
