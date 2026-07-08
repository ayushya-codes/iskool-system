import api from './client';

export const helpdeskApi = {
  // Tickets
  createTicket: (data) => api.post('/helpdesk/tickets', data),
  getTicketsByStudent: (studentId) => api.get(`/helpdesk/tickets/student/${studentId}`),
  getTicketsByStatus: (status) => api.get(`/helpdesk/tickets/status/${status}`),
  assignTicket: (id, assignedToUserId) => api.put(`/helpdesk/tickets/${id}/assign?assignedToUserId=${assignedToUserId}`),
  resolveTicket: (id) => api.put(`/helpdesk/tickets/${id}/resolve`),

  // Replies
  addReply: (data) => api.post('/helpdesk/replies', data),
  getReplies: (ticketId) => api.get(`/helpdesk/tickets/${ticketId}/replies`),
};
