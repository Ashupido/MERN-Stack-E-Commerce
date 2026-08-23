import api from './api';

const PRODUCT_BASE_URL = '/products';

const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get(PRODUCT_BASE_URL, { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`${PRODUCT_BASE_URL}/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post(PRODUCT_BASE_URL, productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`${PRODUCT_BASE_URL}/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`${PRODUCT_BASE_URL}/${id}`);
    return response.data;
  },
};

export default productService;
