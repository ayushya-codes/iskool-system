import api from './client';

export const eventApi = {
  getAll: (params) => api.get('/events', { params }),
  getUpcoming: () => api.get('/events/upcoming'),
  create: (data) => api.post('/events', data),
  delete: (id) => api.delete(`/events/${id}`),
};
