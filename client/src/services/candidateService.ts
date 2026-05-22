import { api } from './api';

export const fetchCandidateProfile = () => api.get('/candidates/me');
export const updateCandidateProfile = (payload: Record<string, unknown>) => api.put('/candidates/me', payload);
export const fetchCandidateFeedback = (candidateId: string) => api.get(`/feedback/candidate/${candidateId}`);
