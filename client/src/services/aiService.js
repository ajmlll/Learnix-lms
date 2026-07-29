import api from './api';

export const aiService = {
  // Generate AI Notes for a lecture
  generateNotes: async (courseId, lectureId) => {
    const response = await api.post(`/ai/notes/${courseId}/${lectureId}`);
    return response.data.data;
  },

  // Generate AI Quiz for a lecture
  generateQuiz: async (courseId, lectureId) => {
    const response = await api.post(`/ai/quiz/${courseId}/${lectureId}`);
    return response.data.data;
  },
};

export default aiService;
