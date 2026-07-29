import api from './api';

export const reviewService = {
  // Get public course reviews with pagination
  getCourseReviews: async (courseId, params = {}) => {
    const response = await api.get(`/reviews/course/${courseId}`, { params });
    return response.data;
  },

  // Create review for a course
  createReview: async (courseId, rating, comment) => {
    const response = await api.post(`/reviews/course/${courseId}`, { rating, comment });
    return response.data;
  },

  // Update review
  updateReview: async (id, rating, comment) => {
    const response = await api.put(`/reviews/${id}`, { rating, comment });
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
