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

// Services API - Postes (Stations dans votre backend)
export const postesAPI = {
  getAll: (params) => api.get('/postes', { params }),
  getById: (id) => api.get(`/postes/${id}`),
  create: (data) => api.post('/postes', data),
  update: (id, data) => api.put(`/postes/${id}`, data),
  delete: (id) => api.delete(`/postes/${id}`),
  getStats: (id) => api.get(`/postes/${id}/stats`),
};

// Services API - Clients
export const clientsAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  search: (query) => api.get(`/clients/search/autocomplete?q=${query}`),
  getStats: (id) => api.get(`/clients/${id}/stats`),
};

// Services API - Sessions
export const sessionsAPI = {
  getAll: (params) => api.get('/sessions', { params }),
  getActive: () => api.get('/sessions/active/all'),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  close: (id, data) => api.post(`/sessions/${id}/close`, data),
  addService: (id, data) => api.post(`/sessions/${id}/services`, data),
  removeService: (sessionId, serviceId) => api.delete(`/sessions/${sessionId}/services/${serviceId}`),
};

// Services API - Tarifs
export const tarifsAPI = {
  getAll: (params) => api.get('/tarifs', { params }),
  getActive: () => api.get('/tarifs/active'),
};

// Services API - Services Additionnels
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getCategories: () => api.get('/services/categories/list'),
  addVente: (sessionId, data) => api.post(`/sessions/${sessionId}/services`, data),
};

// Services API - Statistiques/Reports
export const statsAPI = {
  getGlobal: (params) => api.get('/reports/stats', { params }),
  getDaily: (date) => api.get(`/reports/daily${date ? `?date=${date}` : ''}`),
  getMonthly: (year, month) => api.get(`/reports/monthly?year=${year}&month=${month}`),
  getCustom: (params) => api.get('/reports/custom', { params }),
};

export default api;