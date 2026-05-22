import api from './api';

export const analyzeResumeText = async (text: string) => {
  const response = await api.post('/ai/resume-analyze', { text });
  return response.data;
};

export const generateInterviewQuestions = async (role: string, difficulty: string = 'medium') => {
  const response = await api.post('/ai/mock-interview', { role, difficulty });
  return response.data;
};
