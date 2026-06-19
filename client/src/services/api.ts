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
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('token');
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    const errorMessage = error?.message || '';
    
    // Handle timeout
    if (error?.code === 'ECONNABORTED') {
      const timeoutError = new Error('Request timeout. The server is not responding. Please check if your backend is running.');
      (timeoutError as any).isNetworkError = true;
      return Promise.reject(timeoutError);
    }
    
    // Handle network errors
    if (
      errorMessage.includes('NetworkError') ||
      error?.code === 'ERR_NETWORK' ||
      !error?.response
    ) {
      const networkError = new Error('Network Error: Unable to connect to the backend server. Check your internet connection and VITE_API_URL configuration.');
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    }
    
    // Suppress errors from browser extensions 
    if (
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('extension')
    ) {
      console.debug('[API] Browser extension network issue (suppressed)');
    }
    
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
