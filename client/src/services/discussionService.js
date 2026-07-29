import api from './api';

export const discussionService = {
  // Create a discussion thread
  createDiscussion: async (courseId, threadData) => {
    const response = await api.post(`/discussions/course/${courseId}`, threadData);
    return response.data.data;
  },

  // Get discussions for a course
  getCourseDiscussions: async (courseId, params = {}) => {
    const response = await api.get(`/discussions/course/${courseId}`, { params });
    return response.data;
  },

  // Add reply to thread
  addReply: async (threadId, content) => {
    const response = await api.post(`/discussions/${threadId}/replies`, { content });
    return response.data.data;
  },

  // Toggle upvote
  toggleUpvote: async (threadId) => {
    const response = await api.put(`/discussions/${threadId}/upvote`);
    return response.data;
  },

  // Delete discussion thread
  deleteDiscussion: async (threadId) => {
    const response = await api.delete(`/discussions/${threadId}`);
    return response.data;
  },
};

export default discussionService;
