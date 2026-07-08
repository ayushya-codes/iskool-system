import api from './client';

export const customizationApi = {
  // Public Theme (no auth)
  getPublicTheme: (subdomain) => api.get('/public/school/theme', { params: { subdomain } }),

  // Customization
  getCustomization: () => api.get('/school/customization'),
  updateCustomization: (data) => api.put('/school/customization', data),

  // Custom Labels
  upsertLabel: (data) => api.post('/school/labels', data),
  getAllLabels: () => api.get('/school/labels'),
  getLabelsByLanguage: (language) => api.get(`/school/labels/${language}`),
  deleteLabel: (id) => api.delete(`/school/labels/${id}`),

  // Assets
  uploadAsset: (formData) => api.post('/school/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAllAssets: () => api.get('/school/assets'),
  getAssetsByType: (assetType) => api.get(`/school/assets/type/${assetType}`),
  deleteAsset: (id) => api.delete(`/school/assets/${id}`),
};
