import api from './api';

const managerService = {
  getDashboardSummary: async () => {
    const response = await api.get('/manager/dashboard/summary');
    return response.data;
  },

  getOrders: async (params) => {
    const response = await api.get('/manager/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/manager/orders/${orderId}/status`, { status });
    return response.data;
  },

  updateProductStock: async (productId, stock) => {
    const response = await api.put(`/manager/products/${productId}/stock`, { stock });
    return response.data;
  },
};

export default managerService;