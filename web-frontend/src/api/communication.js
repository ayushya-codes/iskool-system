import api from './client';

export const communicationApi = {
  // Calendar Events
  createEvent: (data) => api.post('/communication/events', data),
  getAllEvents: () => api.get('/communication/events'),
  deleteEvent: (id) => api.delete(`/communication/events/${id}`),

  // Circulars
  createCircular: (data) => api.post('/communication/circulars', data),
  getAllCirculars: () => api.get('/communication/circulars'),
  deleteCircular: (id) => api.delete(`/communication/circulars/${id}`),

  // Announcements
  createAnnouncement: (data) => api.post('/communication/announcements', data),
  getAnnouncementsByDivision: (divisionId) => api.get(`/communication/announcements/division/${divisionId}`),
  deleteAnnouncement: (id) => api.delete(`/communication/announcements/${id}`),

  // Galleries
  createGallery: (data) => api.post('/communication/galleries', data),
  getAllGalleries: () => api.get('/communication/galleries'),
  getPendingGalleries: () => api.get('/communication/galleries/pending'),
  approveGallery: (id, approvedByUserId) => api.put(`/communication/galleries/${id}/approve?approvedByUserId=${approvedByUserId}`),
  deleteGallery: (id) => api.delete(`/communication/galleries/${id}`),

  // Assets
  uploadAsset: (data) => api.post('/communication/assets', data),
  getAssetsByGallery: (galleryId) => api.get(`/communication/assets/gallery/${galleryId}`),
  deleteAsset: (id) => api.delete(`/communication/assets/${id}`),
};
