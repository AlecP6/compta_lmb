import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/auth';

export const authService = {
  async login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  },

  async register(username: string, password: string, name: string) {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
      name,
    });
    return response.data;
  },

  async getCurrentUser(token: string) {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

