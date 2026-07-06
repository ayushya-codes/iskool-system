import api from './client';

export const holidayApi = {
  getAll: (start, end) => {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    return api.get('/holidays', { params });
  },
  create: (data) => api.post('/holidays', data),
  bulkCreate: (holidays) => api.post('/holidays/bulk', { holidays }),
  delete: (id) => api.delete(`/holidays/${id}`),
};
