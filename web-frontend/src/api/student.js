import api from './client';

export const studentApi = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  getDetail: (id) => api.get(`/students/${id}/detail`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),

  // Medical
  upsertMedical: (id, data) => api.put(`/students/${id}/medical`, data),

  // Enrollments
  enroll: (id, data) => api.post(`/students/${id}/enrollments`, data),
  getEnrollments: (id) => api.get(`/students/${id}/enrollments`),

  // Emergency Contacts
  addEmergencyContact: (id, data) => api.post(`/students/${id}/emergency-contacts`, data),
  getEmergencyContacts: (id) => api.get(`/students/${id}/emergency-contacts`),
  deleteEmergencyContact: (contactId) => api.delete(`/students/emergency-contacts/${contactId}`),

  // Siblings
  addSibling: (id, data) => api.post(`/students/${id}/siblings`, data),
  getSiblings: (id) => api.get(`/students/${id}/siblings`),
  removeSibling: (linkId) => api.delete(`/students/siblings/${linkId}`),

  // Timeline
  addTimelineEvent: (id, data) => api.post(`/students/${id}/timeline`, data),
  getTimeline: (id) => api.get(`/students/${id}/timeline`),

  // Parent
  getMyChild: () => api.get('/students/my-child'),
  getMyChildren: () => api.get('/students/my-children'),
};
