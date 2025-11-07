import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || '/api'}/admin`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminService = {
  async getDeletionLogs() {
    const response = await axios.get(`${API_URL}/deletion-logs`, getAuthHeaders());
    return response.data;
  },

  async getWeeklyStats() {
    const response = await axios.get(`${API_URL}/weekly-stats`, getAuthHeaders());
    return response.data;
  },
};

