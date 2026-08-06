import api from './api';

const PRODUCT_BASE_URL = '/products';

const productService = {
  getProducts: async () => {
    const response = await api.get(PRODUCT_BASE_URL);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`${PRODUCT_BASE_URL}/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    // productData should be FormData for image upload
    const response = await api.post(PRODUCT_BASE_URL, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`${PRODUCT_BASE_URL}/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`${PRODUCT_BASE_URL}/${id}`);
    return response.data;
  },
};

export default productService;