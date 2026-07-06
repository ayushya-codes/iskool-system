import api from './client';

export const schoolApi = {
  getAll: () => api.get('/schools'),
  getById: (id) => api.get(`/schools/${id}`),
};
