import api from './api';

// Transform Mongoose course document to include aliases expected by frontend components
const transformCourse = (course) => {
  if (!course) return null;
  return {
    ...course,
    id: course._id || course.id,
    rating: course.averageRating || course.rating || 0,
    reviewCount: course.ratingsCount || course.reviewCount || 0,
    studentsEnrolled: course.enrolledCount || course.studentsEnrolled || 0,
    originalPrice: course.price ? course.price * 1.5 : 0,
    categoryName: typeof course.category === 'object' ? course.category?.name : course.category,
    curriculum: course.sections
      ? course.sections.map((sec) => ({
          id: sec._id || sec.id,
          moduleTitle: sec.title,
          duration: `${sec.lectures ? sec.lectures.reduce((acc, l) => acc + (l.duration || 0), 0) : 0} mins`,
          lessons: sec.lectures
            ? sec.lectures.map((l) => ({
                id: l._id || l.id,
                title: l.title,
                duration: `${Math.floor((l.duration || 0) / 60)}:${(l.duration % 60 || 0).toString().padStart(2, '0')}`,
                videoUrl: l.videoUrl,
                isPreview: l.isPreview,
              }))
            : [],
        }))
      : [],
  };
};

export const courseService = {
  // Get public courses with filters and pagination
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    const transformed = (response.data.data || []).map(transformCourse);
    return {
      courses: transformed,
      total: response.data.total || transformed.length,
      page: response.data.page || 1,
      pages: response.data.pages || 1,
    };
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return transformCourse(response.data.data);
  },

  // Create course
  createCourse: async (courseData) => {
    const isFormData = courseData instanceof FormData;
    const response = await api.post('/courses', courseData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return transformCourse(response.data.data);
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const isFormData = courseData instanceof FormData;
    const response = await api.put(`/courses/${id}`, courseData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return transformCourse(response.data.data);
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Publish course
  publishCourse: async (id) => {
    const response = await api.patch(`/courses/${id}/publish`);
    return response.data;
  },

  // Get instructor's created courses
  getMyCourses: async () => {
    const response = await api.get('/courses/my-courses');
    return (response.data.data || []).map(transformCourse);
  },

  // Sections
  addSection: async (courseId, sectionData) => {
    const response = await api.post(`/courses/${courseId}/sections`, sectionData);
    return response.data;
  },

  updateSection: async (courseId, sectionId, sectionData) => {
    const response = await api.put(`/courses/${courseId}/sections/${sectionId}`, sectionData);
    return response.data;
  },

  deleteSection: async (courseId, sectionId) => {
    const response = await api.delete(`/courses/${courseId}/sections/${sectionId}`);
    return response.data;
  },

  // Lectures
  addLecture: async (courseId, sectionId, lectureData) => {
    const isFormData = lectureData instanceof FormData;
    const response = await api.post(`/courses/${courseId}/sections/${sectionId}/lectures`, lectureData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  updateLecture: async (courseId, sectionId, lectureId, lectureData) => {
    const isFormData = lectureData instanceof FormData;
    const response = await api.put(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`, lectureData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  deleteLecture: async (courseId, sectionId, lectureId) => {
    const response = await api.delete(`/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return (response.data.data || []).map((cat) => ({
      ...cat,
      id: cat._id || cat.id,
    }));
  },

  createCategory: async (name) => {
    const response = await api.post('/categories', { name });
    return response.data.data;
  },
};

export default courseService;
