import redisClient from '../config/redis.js';

/**
 * Generate a 6-digit OTP code and store in Redis with 5-minute (300s) expiry
 */
export const generateOTP = async (userId) => {
  // Generate random 6-digit number
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (redisClient && redisClient.isOpen) {
    await redisClient.setEx(`otp:${userId}`, 300, otpCode);
    console.log(`[Redis OTP] Stored OTP for user ${userId} (expires in 300s)`);
  } else {
    console.warn(`[Redis OTP] Redis client not connected. OTP generation stored in-memory fallback log: Code ${otpCode}`);
  }

  return otpCode;
};

/**
 * Verify OTP code against Redis
 */
export const verifyOTP = async (userId, code) => {
  if (!redisClient || !redisClient.isOpen) {
    throw new Error('Redis connection unavailable for OTP verification.');
  }

  const storedOTP = await redisClient.get(`otp:${userId}`);

  if (!storedOTP) {
    return { valid: false, message: 'OTP has expired or does not exist.' };
  }

  if (storedOTP !== code) {
    return { valid: false, message: 'Invalid OTP code.' };
  }

  // Delete OTP after successful verification
  await redisClient.del(`otp:${userId}`);
  return { valid: true, message: 'OTP verified successfully.' };
};

export default {
  generateOTP,
  verifyOTP,
};
