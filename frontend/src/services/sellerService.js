import api from './api';

const sellerService = {
  getProducts: async (params) => {
    const response = await api.get('/seller/products', { params });
    return response.data;
  },

  createProduct: async (formData) => {
    const response = await api.post('/seller/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, formData) => {
    const response = await api.put(`/seller/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/seller/products/${id}`);
    return response.data;
  },

  getOrders: async (params) => {
    const response = await api.get('/seller/orders', { params });
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/seller/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/seller/settings', data);
    return response.data;
  },
};

export default sellerService;