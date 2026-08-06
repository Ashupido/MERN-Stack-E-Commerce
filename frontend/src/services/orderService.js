import api from './api';

const ORDER_BASE_URL = '/orders';

const orderService = {
  getMyOrders: async () => {
    const response = await api.get(`${ORDER_BASE_URL}/my-orders`);
    return response.data;
  },

  checkout: async (cart) => {
    const response = await api.post(`${ORDER_BASE_URL}/checkout`, { items: cart });
    return response.data;
  },

  getOrderTracking: async (orderId) => {
    const response = await api.get(`${ORDER_BASE_URL}/tracking/${orderId}`);
    return response.data;
  },

  // New method to fetch a single order by ID
  getOrder: async (orderId) => {
    const response = await api.get(`${ORDER_BASE_URL}/${orderId}`);
    return response.data;
  },
};

export default orderService;