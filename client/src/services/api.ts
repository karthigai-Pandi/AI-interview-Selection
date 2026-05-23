import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = rawApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawApiUrl.replace(/\/+$/, '')
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

if (typeof window !== 'undefined' && window.location && !window.location.hostname.includes('localhost') && rawApiUrl.includes('localhost')) {
  console.warn(
    '[AI Interview Selection] WARNING: The application is running in production, but VITE_API_URL points to localhost ("' + rawApiUrl + '"). ' +
    'This will cause login Network Errors. Please configure VITE_API_URL in your hosting provider (e.g. Vercel) environment variables and redeploy.'
  );
}

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
