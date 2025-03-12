import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Création de l'instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Services des appareils
export const deviceService = {
  getAllDevices: () => api.get('/devices'),
  getDevice: (id) => api.get(`/devices/${id}`),
  createDevice: (deviceData) => api.post('/devices', deviceData),
  updateDevice: (id, deviceData) => api.put(`/devices/${id}`, deviceData),
  deleteDevice: (id) => api.delete(`/devices/${id}`),
};

// Services de localisation
export const locationService = {
  getDeviceLocations: (deviceId) => api.get(`/locations/${deviceId}/history`),
  getLastLocation: (deviceId) => api.get(`/locations/${deviceId}/last`),
  recordLocation: (deviceId, locationData) => api.post(`/locations/${deviceId}`, locationData),
};

export default api; 