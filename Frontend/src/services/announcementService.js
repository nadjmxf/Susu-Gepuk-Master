import api from './api';

const announcementService = {
  // Get all announcements
  getAllAnnouncements: async () => {
    try {
      const response = await api.get('/announcement');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data pengumuman',
      };
    }
  },

  // Get announcement by ID
  getAnnouncementById: async (announcementId) => {
    try {
      const response = await api.get(`/announcement/${announcementId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data pengumuman',
      };
    }
  },

  // Create announcement
  createAnnouncement: async (payload) => {
    try {
      const response = await api.post('/announcement', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menambahkan pengumuman',
      };
    }
  },

  // Update announcement
  updateAnnouncement: async (announcementId, payload) => {
    try {
      const response = await api.put(`/announcement/${announcementId}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal memperbarui pengumuman',
      };
    }
  },

  // Delete announcement
  deleteAnnouncement: async (announcementId) => {
    try {
      const response = await api.delete(`/announcement/${announcementId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menghapus pengumuman',
      };
    }
  },
};

export default announcementService;
