import api from './api';

export const liveClassService = {
  // Schedule a live class
  scheduleLiveClass: async (liveClassData) => {
    const response = await api.post('/live-classes', liveClassData);
    return response.data.data;
  },

  // Get live classes for a course
  getLiveClassesByCourse: async (courseId) => {
    const response = await api.get(`/live-classes/course/${courseId}`);
    return response.data.data;
  },

  // Join a live class session
  joinLiveClass: async (id) => {
    const response = await api.post(`/live-classes/${id}/join`);
    return response.data;
  },

  // Update live class
  updateLiveClass: async (id, data) => {
    const response = await api.put(`/live-classes/${id}`, data);
    return response.data.data;
  },

  // Delete live class
  deleteLiveClass: async (id) => {
    const response = await api.delete(`/live-classes/${id}`);
    return response.data;
  },
};

export default liveClassService;
