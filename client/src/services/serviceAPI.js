import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
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
