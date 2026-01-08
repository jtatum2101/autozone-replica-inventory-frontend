import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
      // Token expired or invalid - logout
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const inventoryAPI = {
  // Get all inventory
  getAllInventory: () => api.get('/inventory'),
  
  // Get items needing reorder
  getReorderItems: () => api.get('/inventory/reorder'),
  
  // Get low stock items
  getLowStockItems: () => api.get('/inventory/low-stock'),
  
  // Get inventory by store
  getInventoryByStore: (storeId) => api.get(`/inventory/store/${storeId}`),
  
  // Get all stores
  getAllStores: () => api.get('/stores'),
  
  // Get all parts
  getAllParts: () => api.get('/parts'),
  
  // Get all sales
  getAllSales: () => api.get('/sales'),
  
  // Get sales by store
  getSalesByStore: (storeId) => api.get(`/sales/store/${storeId}`),
  
  // Get top selling parts
  getTopSellingParts: (limit = 10) => api.get(`/sales/top-selling?limit=${limit}`),
};

export default api;