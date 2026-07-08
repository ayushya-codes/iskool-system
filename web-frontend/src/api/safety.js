import api from './client';

export const safetyApi = {
  // Gate Passes
  createGatePass: (data) => api.post('/safety/gate-passes', data),
  verifyGatePass: (passCode, validDate) => api.post(`/safety/gate-passes/verify?passCode=${passCode}&validDate=${validDate}`),
  getGatePassesByStudent: (studentId) => api.get(`/safety/gate-passes/student/${studentId}`),

  // Proxy Pickups
  createProxyPickup: (data) => api.post('/safety/proxy-pickups', data),
  getProxyPickupsByDate: (validDate) => api.get(`/safety/proxy-pickups/date/${validDate}`),
  getProxyPickupsByStudent: (studentId) => api.get(`/safety/proxy-pickups/student/${studentId}`),
};
