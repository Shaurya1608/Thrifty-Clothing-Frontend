import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // This will use the proxy configuration from package.json
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      // Try to refresh token if this is not a refresh request
      if (!originalRequest._retry && !originalRequest.url.includes('/refresh-token')) {
        originalRequest._retry = true;
        
        try {
          const refreshResponse = await axios.post('/api/auth/refresh-token', {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (refreshResponse.data.token) {
            localStorage.setItem('token', refreshResponse.data.token);
            originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.log('Token refresh failed, clearing token and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if we're not already on login/register page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            window.location.href = '/login';
          }
        }
      } else {
        // Token refresh failed or this was a refresh request
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle HTML responses (server errors)
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
      console.error('Server returned HTML instead of JSON:', error.response.data.substring(0, 200));
      return Promise.reject(new Error('Server error - please try again later'));
    }
    
    return Promise.reject(error);
  }
);

export default api;

