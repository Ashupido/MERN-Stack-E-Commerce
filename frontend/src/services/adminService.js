import api from './api'; // Assuming your axios instance is exported as 'api' from this path

const adminService = {
  /**
   * Fetches dashboard summary statistics.
   * @returns {Promise<object>} - { totalUsers, totalProducts, totalOrders, paidOrders, pendingOrders, totalRevenue }
   */
  getDashboard: async (params = {}) => {
    const response = await api.get('/admin/dashboard/summary', { params });
    return response.data;
  },

  /**
   * Fetches a list of orders with optional filters and pagination.
   * @param {object} params - Query parameters (status, search, page, limit, sort)
   * @returns {Promise<object>} - { totalOrders, currentPage, totalPages, orders: [] }
   */
  getOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  /**
   * Updates the status of a specific order.
   * @param {string} id - Order ID
   * @param {string} status - New status (e.g., 'shipped', 'delivered')
   * @returns {Promise<object>} - Updated order object
   */
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },
};

export default adminService;