import api from './api';

export const paymentService = {
  // Create Stripe Checkout Session
  createCheckoutSession: async (courseId) => {
    const response = await api.post('/payments/checkout-session', { courseId });
    return response.data;
  },

  // Get student's payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data.data;
  },

  // Get instructor's earnings dashboard data
  getInstructorEarnings: async () => {
    const response = await api.get('/payments/instructor-earnings');
    return response.data;
  },
};

export default paymentService;
