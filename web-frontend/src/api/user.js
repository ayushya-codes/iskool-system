import api from './client';

export const userApi = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
};
