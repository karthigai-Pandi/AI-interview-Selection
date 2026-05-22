import api from './api';

export const uploadResumeFile = async (file: File, onUploadProgress?: (percentage: number) => void) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/uploads/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        onUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return response.data;
};
