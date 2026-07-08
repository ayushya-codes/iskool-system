import api from './client';

export const examApi = {
  // Exams
  create: (data) => api.post('/exams', data),
  getByBatch: (batchId) => api.get(`/exams/batch/${batchId}`),
  getByDivision: (divisionId) => api.get(`/exams/division/${divisionId}`),
  delete: (id) => api.delete(`/exams/${id}`),

  // Portions
  setPortion: (data) => api.post('/exams/portions', data),
  getPortions: (examId) => api.get(`/exams/${examId}/portions`),

  // Results
  enterResult: (data) => api.post('/exams/results', data),
  getResultsByExam: (examId) => api.get(`/exams/${examId}/results`),
  getResultsByStudent: (examId, studentId) => api.get(`/exams/${examId}/results/student/${studentId}`),

  // Grading Schemes
  createGradingScheme: (data) => api.post('/exams/grading-schemes', data),
  getAllGradingSchemes: () => api.get('/exams/grading-schemes'),
  deleteGradingScheme: (id) => api.delete(`/exams/grading-schemes/${id}`),

  // Ranks
  setRank: (data) => api.post('/exams/ranks', data),
  getRankList: (examId) => api.get(`/exams/${examId}/ranks`),

  // Report Cards
  generateReportCard: (data) => api.post('/exams/report-cards', data),
  approveReportCard: (id, approvedByUserId) => api.put(`/exams/report-cards/${id}/approve?approvedByUserId=${approvedByUserId}`),
  getReportCardsByBatch: (batchId) => api.get(`/exams/report-cards/batch/${batchId}`),
};
