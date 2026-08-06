import api from './api';

const PAYMENT_BASE_URL = '/payment';

const paymentService = {
  initializePayment: async (orderId) => {
    const response = await api.post(`${PAYMENT_BASE_URL}/initialize`, { orderId });
    return response.data;
  },

  verifyPayment: async (txRef) => {
    const response = await api.get(`${PAYMENT_BASE_URL}/verify/${txRef}`);
    return response.data;
  },
};

export default paymentService;
