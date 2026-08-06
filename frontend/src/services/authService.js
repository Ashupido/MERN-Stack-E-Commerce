import api from './api';

const AUTH_BASE_URL = '/auth';
const USER_BASE_URL = '/users';

const authService = {
  register: async (name, email, password) => {
    const response = await api.post(`${AUTH_BASE_URL}/register`, { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post(`${AUTH_BASE_URL}/login`, { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get(`${USER_BASE_URL}/profile`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put(`${USER_BASE_URL}/profile`, data);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;