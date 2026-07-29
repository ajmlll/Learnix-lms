import api from './api';

export const gamificationService = {
  // Get user's total XP & level
  getXP: async () => {
    const response = await api.get('/gamification/xp');
    return response.data;
  },

  // Get learning streak
  getStreak: async () => {
    const response = await api.get('/gamification/streak');
    return response.data.data;
  },

  // Get weekly learning goal
  getWeeklyGoal: async () => {
    const response = await api.get('/gamification/weekly-goal');
    return response.data.data;
  },

  // Set weekly target minutes
  setWeeklyGoal: async (targetMinutes) => {
    const response = await api.post('/gamification/weekly-goal', { targetMinutes });
    return response.data.data;
  },

  // Get badges
  getBadges: async () => {
    const response = await api.get('/gamification/badges');
    return response.data;
  },

  // Get global leaderboard (90s Redis cached)
  getLeaderboard: async () => {
    const response = await api.get('/gamification/leaderboard');
    return response.data.data;
  },
};

export default gamificationService;
