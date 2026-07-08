import api from './client';

export const schoolApi = {
  getAll: () => api.get('/schools'),
  getById: (id) => api.get(`/schools/${id}`),
  getBySubdomain: (subdomain) => api.get(`/schools/subdomain/${subdomain}`),
  create: (data) => api.post('/schools', data),
  update: (id, data) => api.put(`/schools/${id}`, data),
  delete: (id) => api.delete(`/schools/${id}`),
};
