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
        // Simpan data user ke localStorage
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

  // Logout
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
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

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
};

export default authService;
