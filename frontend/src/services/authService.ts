import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/auth';

// Créer une instance axios avec configuration par défaut
const apiClient = axios.create({
  timeout: 10000, // 10 secondes
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  async login(username: string, password: string) {
    const response = await apiClient.post(`${API_URL}/login`, { username, password });
    return response.data;
  },

  async register(username: string, password: string, name: string) {
    const response = await apiClient.post(`${API_URL}/register`, {
      username,
      password,
      name,
    });
    return response.data;
  },

  async getCurrentUser(token: string) {
    const response = await apiClient.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

