import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioAPI = {
  simulate: async (portfolio, days = 252, simulations = 1000) => {
    const response = await api.post('/simulate', {
      portfolio,
      days,
      simulations,
    });
    return response.data;
  },
  
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;