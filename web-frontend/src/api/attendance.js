import api from './client';

export const attendanceApi = {
  // Attendance Records
  markSingle: (data) => api.post('/attendance/mark', data),
  markBulk: (data) => api.post('/attendance/mark-bulk', data),
  getByDivisionAndDate: (divisionId, date) => api.get(`/attendance/division/${divisionId}/date/${date}`),
  getByDivisionRange: (divisionId, from, to) => api.get(`/attendance/division/${divisionId}?from=${from}&to=${to}`),
  getByStudentRange: (studentId, from, to) => api.get(`/attendance/student/${studentId}?from=${from}&to=${to}`),

  // Student Leave
  applyStudentLeave: (data) => api.post('/attendance/student-leave', data),
  getStudentLeaves: (studentId) => api.get(`/attendance/student-leave/student/${studentId}`),
  getPendingStudentLeaves: () => api.get('/attendance/student-leave/pending'),
  approveStudentLeave: (leaveId, data) => api.put(`/attendance/student-leave/${leaveId}/approve`, data),

  // Faculty Leave
  applyFacultyLeave: (data) => api.post('/attendance/faculty-leave', data),
  getFacultyLeaves: (facultyId) => api.get(`/attendance/faculty-leave/faculty/${facultyId}`),
  getPendingFacultyLeaves: () => api.get('/attendance/faculty-leave/pending'),
  approveFacultyLeave: (leaveId, data) => api.put(`/attendance/faculty-leave/${leaveId}/approve`, data),
};
