import api from './api';

const riderService = {
  // Get all riders
  getAllRiders: async () => {
    try {
      const response = await api.get('/rider');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data rider',
      };
    }
  },

  // Get rider by ID
  getRiderById: async (riderId) => {
    try {
      const response = await api.get(`/rider/${riderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data rider',
      };
    }
  },

  // Get rider location
  getRiderLocation: async (riderId) => {
    try {
      const response = await api.get(`/rider/${riderId}/location`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data lokasi',
      };
    }
  },

  // Update rider location with coordinates
  updateRiderLocation: async (riderId, statusLiveLocation, latitude = null, longitude = null) => {
    try {
      const payload = {
        status_live_location: statusLiveLocation,
      };
      
      // Add coordinates jika tersedia
      if (latitude !== null && longitude !== null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }
      
      const response = await api.put(`/rider/${riderId}/location`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal memperbarui lokasi',
      };
    }
  },

  // Get rider activity
  getRiderActivity: async (riderId) => {
    try {
      const response = await api.get(`/rider/${riderId}/activity`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data aktivitas',
      };
    }
  },
};

export default riderService;
