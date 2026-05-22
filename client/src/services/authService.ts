import { api } from './api';

interface Credentials {
  email: string;
  password: string;
}

interface RegisterPayload extends Credentials {
  name: string;
  role?: string;
}

export const login = (payload: Credentials) => api.post('/auth/login', payload);
export const register = (payload: RegisterPayload) => api.post('/auth/register', payload);
export const refreshToken = () => api.get('/auth/refresh');
