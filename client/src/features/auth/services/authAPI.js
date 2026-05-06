// authAPI.js - Service
// API calls for authentication endpoints
// Status: Ready for implementation
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

export async function fetchServices({ query = '', limit = 8, offset = 0 } = {}) {
  const response = await apiClient.get('/api/services', {
    params: {
      q: query,
      limit,
      offset,
    },
  });

  return response.data;
}

export async function registerProfessional(profile) {
  const response = await apiClient.post('/api/professionals/register', profile);
  return response.data;
}

export async function fetchProfessionalsByService({ service = '', search = '', sort = 'top_rated', availableToday = false } = {}) {
  const response = await apiClient.get('/api/professionals', {
    params: {
      service,
      search,
      sort,
      availableToday,
    },
  });

  return response.data;
}

export async function login(email, password, role ) {
  // console.log('Attempting login with email:', email, 'role:', role, 'and password:', password ? '******' : '(empty)');
  const start = Date.now();
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
      role
    });
console.log('Login response received:', response.data);
    const duration = Date.now() - start;

    // Store tokens if provided
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    // attach simple metadata about request duration so UI can warn about slow networks
    const result = {
      ...response.data,
      _meta: {
        duration,
        slowNetwork: duration > 3000,
      },
    };

    return result;
  } catch (err) {
    console.error('Login error:', err);
    const isTimeout = err.code === 'ECONNABORTED';
    const isNetwork = !!err.isAxiosError && !err.response;
    const status = err.response?.status;

    const message =
      err.response?.data?.message ||
      (isTimeout ? 'Request timed out. Please check your connection.' : null) ||
      (isNetwork ? 'Network error. Please check your internet connection.' : 'Server error. Please try again later.');

    const errorToThrow = new Error(message);
    errorToThrow.isNetwork = isNetwork;
    errorToThrow.isTimeout = isTimeout;
    errorToThrow.status = status;
    errorToThrow.original = err;

    throw errorToThrow;
  }
}

export async function registerUser(userData) {
  const response = await apiClient.post('/api/auth/register/user', {
    name: userData.fullName,
    email: userData.email,
    password: userData.password,
    phone: userData.mobileNumber,
    address: userData.address || {},
  });

  // Store tokens if provided
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  if (response.data.refreshToken) {
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }

  return response.data;
}

export async function logout() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    // Make logout API call to clear token from database
    const response = await apiClient.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return response.data;
  } catch (err) {
    console.error('Logout error:', err);
    
    // Clear tokens from localStorage even if API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Throw error for component to handle
    const errorToThrow = new Error(err.response?.data?.message || 'Logout failed');
    errorToThrow.original = err;
    throw errorToThrow;
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    // Make change password API call
    const response = await apiClient.post(
      '/api/auth/change-password',
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    return response.data;
  } catch (err) {
    console.error('Change password error:', err);
    
    // Throw error for component to handle
    const errorToThrow = new Error(err.response?.data?.message || 'Failed to change password');
    errorToThrow.original = err;
    throw errorToThrow;
  }
}

export async function sendOTP(email) {
  try {
    const response = await apiClient.post('/api/auth/send-otp', {
      email,
    });
    
    return response.data;
  } catch (err) {
    console.error('Send OTP error:', err);
    
    const errorToThrow = new Error(err.response?.data?.message || 'Failed to send OTP');
    errorToThrow.original = err;
    throw errorToThrow;
  }
}

export async function verifyOTP(email, otp) {
  try {
    const response = await apiClient.post('/api/auth/verify-otp', {
      email,
      otp,
    });
    
    return response.data;
  } catch (err) {
    console.error('Verify OTP error:', err);
    
    const errorToThrow = new Error(err.response?.data?.message || 'Invalid or expired OTP');
    errorToThrow.original = err;
    throw errorToThrow;
  }
}