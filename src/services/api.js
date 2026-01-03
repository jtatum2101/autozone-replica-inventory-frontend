import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};

export default api;