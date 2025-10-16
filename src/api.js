import axios from 'axios';

// API Base URL - use relative path for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Sightings API
export const sightingsAPI = {
  getSightings: (params) => api.get('/sightings', { params }),
  createSighting: (data) => api.post('/sightings', data),
  getSighting: (id) => api.get(`/sightings/${id}`),
  deleteSighting: (id) => api.delete(`/sightings/${id}`),
  verifySighting: (id) => api.post(`/sightings/${id}/verify`),
  deactivateSighting: (id) => api.post(`/sightings/${id}/deactivate`),
};

// Chat API
export const chatAPI = {
  getMessages: (params) => api.get('/chat/messages', { params }),
  sendMessage: (data) => api.post('/chat/messages', data),
  deleteMessage: (id) => api.delete(`/chat/messages/${id}`),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  suspendUser: (id) => api.post(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.post(`/admin/users/${id}/activate`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getSubscriptions: () => api.get('/admin/subscriptions'),
  getStats: () => api.get('/admin/stats'),
  getMessages: () => api.get('/admin/messages'),
  moderateMessage: (id) => api.post(`/admin/messages/${id}/moderate`),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
};

export default api;

