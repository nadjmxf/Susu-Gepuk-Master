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
  getRiderActivity: async (riderId, month = null, year = null) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const response = await api.get(`/rider/${riderId}/activity`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data aktivitas',
      };
    }
  },

  // Create a new rider
  createRider: async (payload) => {
    try {
      const isFormData = payload instanceof FormData;
      const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await api.post('/rider', payload, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menambahkan data rider',
      };
    }
  },

  // Update rider details
  updateRider: async (riderId, payload) => {
    try {
      const isFormData = payload instanceof FormData;
      let response;
      if (isFormData) {
        payload.append('_method', 'PUT');
        response = await api.post(`/rider/${riderId}`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.put(`/rider/${riderId}`, payload);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal memperbarui data rider',
      };
    }
  },

  // Store rider attendance/absensi
  storeAbsensi: async (riderId, payload) => {
    try {
      const response = await api.post(`/rider/${riderId}/activity`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menyimpan data kehadiran',
      };
    }
  },

  // Get SOTR locations
  getSotrLocations: async () => {
    try {
      const response = await api.get('/sotr/locations');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data lokasi SOTR',
      };
    }
  },
};

export default riderService;
