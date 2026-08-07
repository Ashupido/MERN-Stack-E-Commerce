import api from './api';

const sellerService = {
  getProducts: async (params) => {
    const response = await api.get('/seller/products', { params });
    return response.data;
  },
};

export default sellerService;