import api from './api';

export const adminService = {
  // Get admin dashboard stats (300s Redis cached)
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  // Get pending courses for review
  getPendingCourses: async (params = {}) => {
    const response = await api.get('/admin/pending-courses', { params });
    return response.data;
  },

  // Get all courses (Admin catalog moderation view)
  getAllCourses: async (params = {}) => {
    const response = await api.get('/admin/courses', { params });
    return response.data;
  },

  // Approve pending course
  approveCourse: async (id) => {
    const response = await api.patch(`/admin/courses/${id}/approve`);
    return response.data;
  },

  // Reject pending course with feedback notes
  rejectCourse: async (id, reviewNotes) => {
    const response = await api.patch(`/admin/courses/${id}/reject`, { reviewNotes });
    return response.data;
  },

  // Get all users (Paginated & Filterable)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Promote user role
  promoteUser: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/promote`, { role });
    return response.data;
  },

  // Suspend user
  suspendUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/suspend`);
    return response.data;
  },
};

export default adminService;
