import api from './api';

export const gamificationService = {
  // Get learning streak
  getStreak: async () => {
    const response = await api.get('/gamification/streak');
    return response.data.data;
  },

  // Get weekly learning goal & history
  getWeeklyGoal: async () => {
    const response = await api.get('/gamification/weekly-goal');
    return response.data;
  },

  // Set weekly target minutes
  setWeeklyGoal: async (targetMinutes) => {
    const response = await api.post('/gamification/weekly-goal', { targetMinutes });
    return response.data.data;
  },
  // Use a streak freeze shield
  useShield: async () => {
    const response = await api.post('/gamification/streak/use-shield');
    return response.data.data;
  },
};

export default gamificationService;
