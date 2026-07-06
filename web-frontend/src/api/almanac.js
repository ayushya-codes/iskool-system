import api from './client';

export const almanacApi = {
  getRemarksByStudent: (studentId) => api.get(`/almanac/remarks/student/${studentId}`),
  addRemark: (data) => api.post('/almanac/remarks', data),
  getAllPrayers: () => api.get('/almanac/prayers'),
  createPrayer: (data) => api.post('/almanac/prayers', data),
  deletePrayer: (id) => api.delete(`/almanac/prayers/${id}`),
};
