import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080/api';

async function getHeaders() {
  const token = await AsyncStorage.getItem('iskool_token');
  const schoolId = await AsyncStorage.getItem('iskool_school_id');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (schoolId) headers['X-School-ID'] = schoolId;
  return headers;
}

export async function apiRequest(method, path, { params, body } = {}) {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }
  const headers = await getHeaders();
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    await AsyncStorage.removeItem('iskool_token');
    await AsyncStorage.removeItem('iskool_user');
    throw new Error('Session expired');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get: (path, opts) => apiRequest('GET', path, opts),
  post: (path, body, opts) => apiRequest('POST', path, { ...opts, body }),
  put: (path, body, opts) => apiRequest('PUT', path, { ...opts, body }),
  delete: (path, opts) => apiRequest('DELETE', path, opts),
};
