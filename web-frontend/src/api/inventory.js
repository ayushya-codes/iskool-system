import api from './client';

export const inventoryApi = {
  // Items
  createItem: (data) => api.post('/inventory/items', data),
  getAllItems: (params) => api.get('/inventory/items', { params }),
  getItemsByCategory: (category) => api.get(`/inventory/items?category=${category}`),
  getMyAssignedItems: (facultyUserId) => api.get(`/inventory/items/my-assigned?facultyUserId=${facultyUserId}`),
  updateItem: (id, data) => api.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/items/${id}`),

  // Indents
  createIndent: (data) => api.post('/inventory/indents', data),
  getIndentsByFaculty: (facultyId) => api.get(`/inventory/indents/faculty/${facultyId}`),
  getIndentsByStatus: (status) => api.get(`/inventory/indents/status/${status}`),
  updateIndentStatus: (id, status) => api.put(`/inventory/indents/${id}/status?status=${status}`),

  // Faculty Assignments
  assignFaculty: (data) => api.post('/inventory/assignments', data),
  getAllAssignments: () => api.get('/inventory/assignments'),
  removeAssignment: (facultyUserId, category) => api.delete(`/inventory/assignments?facultyUserId=${facultyUserId}&category=${category}`),
  getMyCategories: (facultyUserId) => api.get(`/inventory/assignments/my-categories?facultyUserId=${facultyUserId}`),
};
