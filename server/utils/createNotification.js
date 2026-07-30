import Notification from '../models/Notification.js';

/**
 * Reusable helper to create a notification for a user
 * @param {string|ObjectId} recipientId - User ID of notification recipient
 * @param {string} type - Notification type enum
 * @param {string} title - Notification title
 * @param {string} message - Notification body text
 * @param {string} [link=''] - Relative path to navigate to when clicked
 */
export const createNotification = async (recipientId, type, title, message, link = '') => {
  try {
    if (!recipientId) return null;
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      link,
      isRead: false,
    });
    return notification;
  } catch (error) {
    console.error('[createNotification Error]:', error.message);
    return null;
  }
};

export default createNotification;
