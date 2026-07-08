import api from './client';

export const notificationApi = {
  send: (data) => api.post('/notifications', data),
  getByUser: (userId) => api.get(`/notifications/user/${userId}`),
  getUnreadByUser: (userId) => api.get(`/notifications/user/${userId}/unread`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put(`/notifications/user/${userId}/read-all`),
};
