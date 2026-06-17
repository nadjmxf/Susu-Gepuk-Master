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
};

export default outletService;
