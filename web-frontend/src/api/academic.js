import api from './client';

export const academicApi = {
  // Batches
  getAllBatches: () => api.get('/academic/batches'),
  getActiveBatch: () => api.get('/academic/batches/active'),
  createBatch: (data) => api.post('/academic/batches', data),
  updateBatch: (id, data) => api.put(`/academic/batches/${id}`, data),
  deleteBatch: (id) => api.delete(`/academic/batches/${id}`),

  // Terms
  createTerm: (data) => api.post('/academic/terms', data),
  getTermsByBatch: (batchId) => api.get(`/academic/terms/batch/${batchId}`),
  deleteTerm: (id) => api.delete(`/academic/terms/${id}`),

  // Classes
  getAllClasses: () => api.get('/academic/classes'),
  createClass: (data) => api.post('/academic/classes', data),
  updateClass: (id, data) => api.put(`/academic/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/academic/classes/${id}`),

  // Divisions
  getDivisionsByClass: (classId) => api.get(`/academic/divisions/class/${classId}`),
  createDivision: (data) => api.post('/academic/divisions', data),
  deleteDivision: (id) => api.delete(`/academic/divisions/${id}`),

  // Subjects
  getAllSubjects: () => api.get('/academic/subjects'),
  createSubject: (data) => api.post('/academic/subjects', data),
  updateSubject: (id, data) => api.put(`/academic/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/academic/subjects/${id}`),
};
