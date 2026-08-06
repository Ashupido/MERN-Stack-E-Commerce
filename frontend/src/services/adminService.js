import API from './api';

export const adminService = {
  // Get admin dashboard metrics summary
  getDashboard: async () => {
    const res = await API.get('/admin/dashboard');
    return res.data;
  },

  // Get all registered users
  getUsers: async () => {
    const res = await API.get('/admin/users');
    return res.data;
  },

  // Update a user's role (user, seller, admin)
  updateUserRole: async (userId, role) => {
    const res = await API.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  // Delete a user
  deleteUser: async (userId) => {
    const res = await API.delete(`/admin/users/${userId}`);
    return res.data;
  },

  // Get all orders (with optional status filter)
  getOrders: async (status = '') => {
    const params = status && status !== 'all' ? { status } : {};
    const res = await API.get('/admin/orders', { params });
    return res.data;
  },

  // Update order status (pending, confirmed, shipped, delivered, cancelled)
  updateOrderStatus: async (orderId, status) => {
    const res = await API.put(`/admin/orders/${orderId}/status`, { status });
    return res.data;
  },

  // Get admin activity logs
  getLogs: async () => {
    const res = await API.get('/admin/logs');
    return res.data;
  },

  // Product management endpoints
  getProducts: async () => {
    const res = await API.get('/products');
    return res.data;
  },

  createProduct: async (formData) => {
    const res = await API.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateProduct: async (id, formData) => {
    const res = await API.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await API.delete(`/products/${id}`);
    return res.data;
  },
};

export default adminService;
