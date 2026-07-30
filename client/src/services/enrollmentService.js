import api from './api';

export const enrollmentService = {
  // Get student's enrolled courses with progress
  getMyEnrolledCourses: async () => {
    const response = await api.get('/enrollments/my-courses');
    return (response.data.data || []).map((item) => {
      let numericProgress = 0;
      if (typeof item.progressPercent === 'number') {
        numericProgress = item.progressPercent;
      } else if (typeof item.progress === 'number') {
        numericProgress = item.progress;
      } else if (Array.isArray(item.progress) && item.progress.length > 0) {
        const done = item.progress.filter((p) => p.completed).length;
        numericProgress = Math.round((done / item.progress.length) * 100);
      }

      return {
        ...item,
        id: item._id || item.id,
        progressPercent: numericProgress,
        progress: numericProgress, // Ensure numeric progress to prevent React object rendering error
        rawProgressArray: Array.isArray(item.progress) ? item.progress : [],
        course: item.course
          ? {
              ...item.course,
              id: item.course._id || item.course.id,
            }
          : null,
      };
    });
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

  // Directly enroll in a course (for free courses or checkout)
  enroll: async (courseId) => {
    const response = await api.post(`/enrollments/enroll/${courseId}`);
    return response.data.data;
  },

  // Alias for getMyEnrolledCourses
  getMyCourses: async () => {
    return enrollmentService.getMyEnrolledCourses();
  },
};

export default enrollmentService;
