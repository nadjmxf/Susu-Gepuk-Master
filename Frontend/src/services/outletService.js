import api from './api';

const outletService = {
  // Get all outlets
  getAllOutlets: async () => {
    try {
      const response = await api.get('/outlet');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data outlet',
      };
    }
  },

  // Get outlet by ID
  getOutletById: async (outletId) => {
    try {
      const response = await api.get(`/outlet/${outletId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data outlet',
      };
    }
  },

  // Create outlet
  createOutlet: async (payload) => {
    try {
      const response = await api.post('/outlet', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menambahkan outlet',
      };
    }
  },

  // Update outlet
  updateOutlet: async (outletId, payload) => {
    try {
      const response = await api.put(`/outlet/${outletId}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal memperbarui outlet',
      };
    }
  },

  // Delete outlet
  deleteOutlet: async (outletId) => {
    try {
      const response = await api.delete(`/outlet/${outletId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menghapus outlet',
      };
    }
  },
};

export default outletService;
