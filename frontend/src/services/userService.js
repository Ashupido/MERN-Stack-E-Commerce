import api from './api'; // Assuming your axios instance is exported as 'api' from this path

const userService = {
  /**
   * Fetches a list of users with optional search, filters, pagination, and sorting.
   * @param {object} params - Query parameters (search, role, status, page, limit, sort)
   * @returns {Promise<object>} - { totalUsers, currentPage, totalPages, users: [] }
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Fetches a single user's details.
   * @param {string} id - User ID
   * @returns {Promise<object>} - User object
   */
  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Creates a new user.
   * @param {object} userData - User data (name, email, password, role, status, etc.)
   * @returns {Promise<object>} - Created user object
   */
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  /**
   * Updates an existing user's details.
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user object
   */
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  /**
   * Deletes a user.
   * @param {string} id - User ID
   * @returns {Promise<object>} - Confirmation message
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export default userService;