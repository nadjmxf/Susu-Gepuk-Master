import api from './api';

const authService = {
  // Login Admin
  loginAdmin: async (username, password) => {
    try {
      const response = await api.post('/login/admin', {
        username,
        password,
      });
      
      if (response.data.success) {
        // Simpan token dan data user ke localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('role', 'admin');
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Terjadi kesalahan pada server',
      };
    }
  },

  // Login Rider
  loginRider: async (username, password) => {
    try {
      const response = await api.post('/login/rider', {
        username,
        password,
      });
      
      if (response.data.success) {
        // Simpan token dan data user ke localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('role', 'rider');
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Terjadi kesalahan pada server',
      };
    }
  },

  // Logout — invalidate token on server
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Even if server logout fails, clear local data
      console.warn('Server logout failed:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('role');
  },

  // Check if user is authenticated (has token)
  isAuthenticated: () => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  },

  // Verify token is still valid by calling /me endpoint
  verifyToken: async () => {
    try {
      const response = await api.get('/me');
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
