import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (skip = 0, limit = 100) => 
    apiClient.get('/products/', { params: { skip, limit } }),
  getById: (id) => 
    apiClient.get(`/products/${id}`),
  create: (data) => 
    apiClient.post('/products/', data),
  update: (id, data) => 
    apiClient.put(`/products/${id}`, data),
  delete: (id) => 
    apiClient.delete(`/products/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: (skip = 0, limit = 100) => 
    apiClient.get('/customers/', { params: { skip, limit } }),
  getById: (id) => 
    apiClient.get(`/customers/${id}`),
  create: (data) => 
    apiClient.post('/customers/', data),
  update: (id, data) => 
    apiClient.put(`/customers/${id}`, data),
  delete: (id) => 
    apiClient.delete(`/customers/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (skip = 0, limit = 100) => 
    apiClient.get('/orders/', { params: { skip, limit } }),
  getById: (id) => 
    apiClient.get(`/orders/{id}`),
  create: (data) => 
    apiClient.post('/orders/', data),
  delete: (id) => 
    apiClient.delete(`/orders/${id}`),
};

export default apiClient;
