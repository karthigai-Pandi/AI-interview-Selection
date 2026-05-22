import api from './api';

export const getAptitudeQuestions = async () => {
  const response = await api.get('/workflow/aptitude');
  return response.data.data;
};

export const getTechnicalQuestions = async () => {
  const response = await api.get('/workflow/technical');
  return response.data.data;
};

export const getCodingProblem = async () => {
  const response = await api.get('/workflow/coding');
  return response.data.data;
};

export const getInterviewQuestions = async () => {
  const response = await api.get('/workflow/interview');
  return response.data.data;
};
