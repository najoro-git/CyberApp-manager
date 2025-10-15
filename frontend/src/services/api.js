import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Health Check
export const healthCheck = () => api.get('/health');

// Services API - Postes
export const postesAPI = {
  getAll: () => api.get('/postes'),
  getById: (id) => api.get(`/postes/${id}`),
  create: (data) => api.post('/postes', data),
  update: (id, data) => api.put(`/postes/${id}`, data),
  delete: (id) => api.delete(`/postes/${id}`),
  updateStatus: (id, status) => api.patch(`/postes/${id}/status`, { statut: status }),
};

// Services API - Clients
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  search: (query) => api.get(`/clients/search?q=${query}`),
};

// Services API - Sessions
export const sessionsAPI = {
  getAll: () => api.get('/sessions'),
  getActive: () => api.get('/sessions/active'),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  end: (id, data) => api.post(`/sessions/${id}/end`, data),
};

// Services API - Tarifs
export const tarifsAPI = {
  getAll: () => api.get('/tarifs'),
  getActive: () => api.get('/tarifs/active'),
};

// Services API - Services Additionnels
export const servicesAPI = {
  getAll: () => api.get('/services'),
  addVente: (data) => api.post('/services/vente', data),
};

// Services API - Statistiques
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getRevenue: (period) => api.get(`/stats/revenue?period=${period}`),
};

export default api;