import api from './api';

const menuService = {
  // Get all active or all menus
  getAllMenus: async (showAll = false) => {
    try {
      const response = await api.get('/menu', { params: { all: showAll } });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data menu',
      };
    }
  },

  // Get menu by ID
  getMenuById: async (menuId) => {
    try {
      const response = await api.get(`/menu/${menuId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal mengambil data menu',
      };
    }
  },

  // Create menu
  createMenu: async (payload) => {
    try {
      const isFormData = payload instanceof FormData;
      const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const response = await api.post('/menu', payload, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menambahkan menu',
      };
    }
  },

  // Update menu
  updateMenu: async (menuId, payload) => {
    try {
      const isFormData = payload instanceof FormData;
      let response;
      if (isFormData) {
        payload.append('_method', 'PUT');
        response = await api.post(`/menu/${menuId}`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.put(`/menu/${menuId}`, payload);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal memperbarui menu',
      };
    }
  },

  // Delete menu
  deleteMenu: async (menuId) => {
    try {
      const response = await api.delete(`/menu/${menuId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: 'Gagal menghapus menu',
      };
    }
  },
};

export default menuService;
