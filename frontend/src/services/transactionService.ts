import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || '/api'}/transactions`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const transactionService = {
  async getAllTransactions(filters?: {
    type?: 'INCOME' | 'EXPENSE';
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(
      `${API_URL}?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  async createTransaction(data: {
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    description: string;
    category?: string;
  }) {
    const response = await axios.post(API_URL, data, getAuthHeaders());
    return response.data;
  },

  async updateTransaction(
    id: string,
    data: {
      type?: 'INCOME' | 'EXPENSE';
      amount?: number;
      description?: string;
      category?: string;
    }
  ) {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
    return response.data;
  },

  async deleteTransaction(id: string) {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  async getStats() {
    const response = await axios.get(`${API_URL}/stats/summary`, getAuthHeaders());
    return response.data;
  },
};

