import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('iskool_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const selectedSchoolId = localStorage.getItem('iskool_selected_school_id');
  if (selectedSchoolId) {
    config.headers['X-School-ID'] = selectedSchoolId;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('iskool_token');
      localStorage.removeItem('iskool_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
