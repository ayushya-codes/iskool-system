import api from './client';

export const academicApi = {
  getAllBatches: () => api.get('/academic/batches'),
  getActiveBatch: () => api.get('/academic/batches/active'),
  getAllClasses: () => api.get('/academic/classes'),
  getDivisionsByClass: (classId) => api.get(`/academic/divisions/class/${classId}`),
  getAllSubjects: () => api.get('/academic/subjects'),
};
