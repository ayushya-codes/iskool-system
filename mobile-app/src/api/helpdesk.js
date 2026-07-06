import { api } from './client';

export const helpdeskApi = {
  getTicketsByStatus: (status) => api.get(`/helpdesk/tickets/status/${status}`),
  assignTicket: (id, assignedToUserId) =>
    api.put(`/helpdesk/tickets/${id}/assign`, null, { params: { assignedToUserId } }),
  resolveTicket: (id) => api.put(`/helpdesk/tickets/${id}/resolve`),
  getReplies: (ticketId) => api.get(`/helpdesk/tickets/${ticketId}/replies`),
  addReply: (ticketId, repliedByUserId, message) =>
    api.post('/helpdesk/replies', { ticketId, repliedByUserId, message }),
};
