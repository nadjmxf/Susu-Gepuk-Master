import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't intercept login endpoints - let the login page handle the error
      const requestUrl = error.config?.url || '';
      const isLoginRequest = requestUrl.includes('/login/');
      
      // Only redirect if user was actually logged in (had a token)
      // Public pages (Landing, Menu, Outlet) should NOT trigger redirect
      const hadToken = localStorage.getItem('token');
      
      if (!isLoginRequest && hadToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect based on current role
        const role = localStorage.getItem('role');
        localStorage.removeItem('role');
        if (role === 'rider') {
          window.location.href = '/rider/login';
        } else {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
