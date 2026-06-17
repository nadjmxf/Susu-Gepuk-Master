import api from './api';

const penjualanService = {
  // Get all penjualan
  getAll: async () => {
    try {
      const response = await api.get('/penjualan');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mendapatkan data penjualan',
      };
    }
  },

  // Get today's penjualan for a rider
  getTodayByRider: async (riderId) => {
    try {
      const response = await api.get(`/penjualan/rider/${riderId}/today`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Belum ada data penjualan hari ini',
      };
    }
  },

  // Get latest penjualan for a rider
  getLatestByRider: async (riderId) => {
    try {
      const response = await api.get(`/penjualan/rider/${riderId}/latest`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Belum ada data penjualan',
      };
    }
  },

  // Get rider data for recap (includes menus and last recap)
  getRiderDataForRecap: async (riderId) => {
    try {
      const response = await api.get(`/penjualan/rider/${riderId}/data-recap`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mendapatkan data rider',
      };
    }
  },

  // Get penjualan history for rider
  getHistoryByRider: async (riderId, page = 1) => {
    try {
      const response = await api.get(`/penjualan/rider/${riderId}/history`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mendapatkan riwayat penjualan',
      };
    }
  },

  // Get menu items for rider
  getMenuForRider: async (riderId) => {
    try {
      const response = await api.get(`/penjualan/rider/${riderId}/menu`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mendapatkan data menu',
      };
    }
  },

  // Create penjualan
  createPenjualan: async (penjualanData) => {
    try {
      const response = await api.post('/penjualan', penjualanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menyimpan data penjualan',
      };
    }
  },

  // Create penjualan with file upload
  createPenjualanWithFile: async (formData) => {
    try {
      const response = await api.post('/penjualan/store-with-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menyimpan data penjualan dengan file',
      };
    }
  },

  // Update penjualan
  updatePenjualan: async (penjualanId, penjualanData) => {
    try {
      const response = await api.put(`/penjualan/${penjualanId}`, penjualanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal memperbarui data penjualan',
      };
    }
  },
};

export default penjualanService;
