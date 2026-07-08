import api from './client';

export const courseworkApi = {
  // Timetables
  createTimetable: (data) => api.post('/coursework/timetables', data),
  getTimetablesByBatch: (batchId) => api.get(`/coursework/timetables/batch/${batchId}`),
  publishTimetable: (id) => api.put(`/coursework/timetables/${id}/publish`),

  // Slots
  createSlot: (data) => api.post('/coursework/slots', data),
  getSlotsByDivision: (divisionId) => api.get(`/coursework/slots/division/${divisionId}`),
  getSlotsByTimetable: (timetableId) => api.get(`/coursework/slots/timetable/${timetableId}`),
  getFacultySlotsByDay: (facultyId, dayOfWeek) => api.get(`/coursework/slots/faculty/${facultyId}/day/${dayOfWeek}`),
  deleteSlot: (id) => api.delete(`/coursework/slots/${id}`),

  // Rooms
  createRoom: (data) => api.post('/coursework/rooms', data),
  getAllRooms: () => api.get('/coursework/rooms'),
  deleteRoom: (id) => api.delete(`/coursework/rooms/${id}`),

  // Period Requirements
  createPeriodRequirement: (data) => api.post('/coursework/period-requirements', data),
  getPeriodRequirements: (batchId, divisionId) => api.get(`/coursework/period-requirements/batch/${batchId}/division/${divisionId}`),
  deletePeriodRequirement: (id) => api.delete(`/coursework/period-requirements/${id}`),

  // Assignments
  createAssignment: (data) => api.post('/coursework/assignments', data),
  getAssignmentsByDivision: (divisionId) => api.get(`/coursework/assignments/division/${divisionId}`),
  getAssignmentsForParent: (parentUserId) => api.get(`/coursework/assignments/parent/${parentUserId}`),
  getAssignmentsByFaculty: (facultyId) => api.get(`/coursework/assignments/faculty/${facultyId}`),
  deleteAssignment: (id) => api.delete(`/coursework/assignments/${id}`),

  // Submissions
  submitAssignment: (data) => api.post('/coursework/submissions', data),
  getSubmissionsByAssignment: (assignmentId) => api.get(`/coursework/submissions/assignment/${assignmentId}`),
  getSubmissionsByStudent: (studentId) => api.get(`/coursework/submissions/student/${studentId}`),
  gradeSubmission: (id) => api.put(`/coursework/submissions/${id}/grade`),

  // Syllabus Logs
  createSyllabusLog: (data) => api.post('/coursework/syllabus', data),
  getSyllabusLogs: (divisionId, subjectId) => api.get(`/coursework/syllabus/division/${divisionId}/subject/${subjectId}`),
  getSyllabusForParent: (parentUserId) => api.get(`/coursework/syllabus/parent/${parentUserId}`),

  // Generation Requests
  createGenerationRequest: (data) => api.post('/coursework/generation-requests', data),
  getGenerationRequests: (batchId) => api.get(`/coursework/generation-requests/batch/${batchId}`),
  updateGenerationStatus: (id, status, responsePayload, errorMessage) => {
    const params = { status };
    if (responsePayload) params.responsePayload = responsePayload;
    if (errorMessage) params.errorMessage = errorMessage;
    return api.put(`/coursework/generation-requests/${id}/status`, null, { params });
  },
};
