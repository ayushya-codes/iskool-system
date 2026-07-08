import api from './client';

export const facultyApi = {
  // CRUD
  getAll: () => api.get('/faculty'),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),

  // Class Assignments
  assignClass: (facultyId, data) => api.post(`/faculty/${facultyId}/assignments`, data),
  getAssignments: (facultyId) => api.get(`/faculty/${facultyId}/assignments`),
  removeAssignment: (assignmentId) => api.delete(`/faculty/assignments/${assignmentId}`),

  // Attendance (Clock-in/out)
  clockIn: (facultyId, data) => api.post(`/faculty/${facultyId}/clock-in`, data),
  clockOut: (facultyId, data) => api.post(`/faculty/${facultyId}/clock-out`, data),
  getAttendance: (facultyId, from, to) => api.get(`/faculty/${facultyId}/attendance?from=${from}&to=${to}`),

  // Availability
  setAvailability: (facultyId, data) => api.post(`/faculty/${facultyId}/availability`, data),
  getAvailability: (facultyId) => api.get(`/faculty/${facultyId}/availability`),
  removeAvailability: (availabilityId) => api.delete(`/faculty/availability/${availabilityId}`),
};
