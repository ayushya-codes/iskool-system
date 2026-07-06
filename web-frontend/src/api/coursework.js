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
};
