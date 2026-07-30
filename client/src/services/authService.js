import api from './api';

/**
 * Auth Service - Real API Integration
 */
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('learnix_token', response.data.token);
      localStorage.setItem('learnix_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('learnix_token', response.data.token);
      localStorage.setItem('learnix_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current logged-in user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthService Logout]:', err.message);
    } finally {
      localStorage.removeItem('learnix_token');
      localStorage.removeItem('learnix_user');
      window.dispatchEvent(new Event('learnix:unauthorized'));
    }
  },

  // Send forgot password email
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Get cart from MongoDB
  getCart: async () => {
    const response = await api.get('/auth/cart');
    return response.data.data;
  },

  // Add course to cart in MongoDB
  addToCart: async (courseId) => {
    const response = await api.post('/auth/cart', { courseId });
    return response.data.data;
  },

  // Remove course from cart in MongoDB
  removeFromCart: async (courseId) => {
    const response = await api.delete(`/auth/cart/${courseId}`);
    return response.data.data;
  },

  // Clear cart in MongoDB
  clearCart: async () => {
    const response = await api.delete('/auth/cart');
    return response.data.data;
  },
};

export default authService;
