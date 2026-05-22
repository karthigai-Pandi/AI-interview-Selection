import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('token');
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Global response handler: on 401, clear token and signal UI
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {
        // ignore
      }
      window.dispatchEvent(new CustomEvent('ais:auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
