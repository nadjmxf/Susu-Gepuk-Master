import api from './api';

const menuService = {
  // Get all active menus
  getAllMenus: async () => {
    try {
      const response = await api.get('/menu');
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
};

export default menuService;
