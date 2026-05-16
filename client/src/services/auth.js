import axios from 'axios';
import { clearAuthData } from '../utils/authUtils';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 15000,
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and token expiration handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API] Response error from ${error.config?.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401) {
      console.warn('[API] Token expired or invalid. Clearing auth and redirecting to login...');
      clearAuthData();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ==================== SERVICES ====================

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

// ==================== PROFESSIONAL REGISTRATION & SEARCH ====================

export async function registerProfessional(profile) {
  const response = await apiClient.post('/api/auth/professional/register', profile);
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

// ==================== LOGIN & LOGOUT ====================

export async function login(email, password, role) {
  const start = Date.now();

  console.log('Login function called with email:', email, 'role:', role);
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
      role
    });
 
    const duration = Date.now() - start;
    
    // Store tokens and user data
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    localStorage.setItem('jobjiffy_is_authenticated', 'true');

    const result = {
      ...response.data,
      _meta: {
        duration,
        slowNetwork: duration > 3000,
      },
    };

    console.log('Login response received:', response.data);
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
  const normalizedPhone = (userData.mobileNumber || '').replace(/\s+/g, '');
  try {
    const response = await apiClient.post('/api/auth/user/register', {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: normalizedPhone,
      location: userData.address || {},
      otp: userData.otp
    });

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
  } catch (err) {
    console.error('Register user error details:', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      serverMessage: err.response?.data?.message,
      isAxiosError: err.isAxiosError,
      url: err.config?.url,
    });

    const isTimeout = err.code === 'ECONNABORTED';
    const isNetwork = !!err.isAxiosError && !err.response;
    const isConnectionRefused = err.code === 'ECONNREFUSED';

    let message = err.response?.data?.message || 'Failed to register';
    let helpText = '';

    if (isConnectionRefused) {
      message = 'Cannot connect to server';
      helpText = 'Make sure the backend server is running on the configured URL';
    } else if (isTimeout) {
      message = 'Request timed out';
      helpText = 'Server is not responding. Try again later.';
    } else if (isNetwork) {
      message = 'Network error - cannot reach server';
      helpText = 'Check your internet connection or try again later.';
    } else if (err.response?.status === 400) {
      message = err.response?.data?.message || 'Invalid input';
    } else if (err.response?.status === 500) {
      message = 'Server error - try again later';
      helpText = err.response?.data?.error || '';
    }

    const errorToThrow = new Error(`${message}${helpText ? '\n' + helpText : ''}`);
    errorToThrow.original = err;
    errorToThrow.isNetwork = isNetwork;
    errorToThrow.isTimeout = isTimeout;
    errorToThrow.isConnectionRefused = isConnectionRefused;
    errorToThrow.status = err.response?.status;
    throw errorToThrow;
  }
}

export async function logout() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await apiClient.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return response.data;
  } catch (err) {
    console.error('Logout error:', err);
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    const errorToThrow = new Error(err.response?.data?.message || 'Logout failed');
    errorToThrow.original = err;
    throw errorToThrow;
  }
}

// ==================== PASSWORD MANAGEMENT ====================

export async function changePassword(currentPassword, newPassword) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
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
    
    const errorToThrow = new Error(err.response?.data?.message || 'Failed to change password');
    errorToThrow.original = err;
    throw errorToThrow;
  }
}

// ==================== OTP MANAGEMENT ====================

export async function sendOTP(email) {
  try {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      throw new Error('Email is required');
    }

    if (!trimmedEmail.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    console.log('Sending OTP to:', trimmedEmail);
    console.log('API Base URL:', apiClient.defaults.baseURL);

    const response = await apiClient.post('/api/auth/send-otp', {
      email: trimmedEmail,
    });
    
    console.log('OTP sent successfully:', response.data);
    return response.data;
  } catch (err) {
    console.error('Send OTP error details:', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      statusText: err.response?.statusText,
      serverMessage: err.response?.data?.message,
      serverError: err.response?.data?.error,
      isNetworkError: !err.response,
      url: err.config?.url,
      baseURL: err.config?.baseURL,
      fullURL: err.config?.baseURL + err.config?.url,
    });
    
    const isTimeout = err.code === 'ECONNABORTED';
    const isNetwork = !!err.isAxiosError && !err.response;
    const isConnectionRefused = err.code === 'ECONNREFUSED';
    
    let message = err.response?.data?.message || 'Failed to send OTP';
    let helpText = '';
    
    if (isConnectionRefused) {
      message = 'Cannot connect to server';
      helpText = 'Make sure the server is running on http://localhost:5000';
    } else if (isTimeout) {
      message = 'Request timed out';
      helpText = 'Server is not responding. Check if it\'s running.';
    } else if (isNetwork) {
      message = 'Network error - cannot reach server';
      helpText = 'Check: 1) Is server running? 2) Is network connection active? 3) Check browser console for details';
    } else if (err.response?.status === 400) {
      message = err.response?.data?.message || 'Invalid email address';
    } else if (err.response?.status === 500) {
      message = 'Server error - check server logs';
      helpText = err.response?.data?.error || 'Check the server console for error details';
    }

    const errorToThrow = new Error(`${message}${helpText ? '\n' + helpText : ''}`);
    errorToThrow.original = err;
    errorToThrow.isNetwork = isNetwork;
    errorToThrow.isTimeout = isTimeout;
    errorToThrow.isConnectionRefused = isConnectionRefused;
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

export default apiClient;
