import api from './api';

export const enrollmentService = {
  // Get student's enrolled courses with progress
  getMyEnrolledCourses: async () => {
    const response = await api.get('/enrollments/my-courses');
    return (response.data.data || []).map((item) => ({
      ...item,
      id: item._id || item.id,
      course: item.course
        ? {
            ...item.course,
            id: item.course._id || item.course.id,
          }
        : null,
    }));
  },

  // Get detailed progress for a course
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data.data;
  },

  // Mark lecture completed and update progress percentage
  updateProgress: async (courseId, lectureId, completed = true) => {
    const response = await api.put(`/enrollments/course/${courseId}/progress`, {
      lectureId,
      completed,
    });
    return response.data.data;
  },
};

export default enrollmentService;
