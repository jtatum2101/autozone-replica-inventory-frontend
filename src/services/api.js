import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://autozone-replica-inventory-management-system-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const inventoryAPI = {
  getAllInventory: () => api.get('/inventory'),
  getReorderItems: () => api.get('/inventory/reorder'),
  getLowStockItems: () => api.get('/inventory/low-stock'),
  getInventoryByStore: (storeId) => api.get(`/inventory/store/${storeId}`),
  getAllStores: () => api.get('/stores'),
  getAllParts: () => api.get('/parts'),
  getAllSales: () => api.get('/sales'),
  getSalesByStore: (storeId) => api.get(`/sales/store/${storeId}`),
  getTopSellingParts: (limit = 10) => api.get(`/sales/top-selling?limit=${limit}`),
};

export default api;