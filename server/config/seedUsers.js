import User from '../models/User.js';

export const seedUsers = async () => {
  try {
    const demoAccounts = [
      {
        name: 'Demo Student',
        email: 'student@learnix.edu',
        password: 'password123',
        role: 'student',
      },
      {
        name: 'Alex Johnson',
        email: 'alex@learnix.edu',
        password: 'password123',
        role: 'student',
      },
      {
        name: 'Demo Instructor',
        email: 'instructor@learnix.edu',
        password: 'password123',
        role: 'instructor',
        isVerifiedInstructor: true,
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@learnix.edu',
        password: 'password123',
        role: 'instructor',
        isVerifiedInstructor: true,
      },
      {
        name: 'Demo Admin',
        email: 'admin@learnix.edu',
        password: 'password123',
        role: 'admin',
      },
    ];

    for (const acc of demoAccounts) {
      const exists = await User.findOne({ email: acc.email });
      if (!exists) {
        await User.create(acc);
        console.log(`[Auto-Seed] Created default demo user: ${acc.email} (${acc.role})`);
      }
    }
  } catch (error) {
    console.warn('[Auto-Seed Warning]: Failed to seed default users:', error.message);
  }
};

export default seedUsers;
