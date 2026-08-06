import api from './api';

const CART_BASE_URL = '/cart';

const cartService = {
  getCart: async () => {
    const response = await api.get(CART_BASE_URL);
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post(`${CART_BASE_URL}/add`, { productId, quantity });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`${CART_BASE_URL}/update`, { productId, quantity });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`${CART_BASE_URL}/remove/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete(`${CART_BASE_URL}/clear`);
    return response.data;
  },
};

export default cartService;