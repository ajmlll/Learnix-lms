import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_MOCK_USERS = {
  student: {
    id: 'usr_student_01',
    name: 'Alex Morgan',
    email: 'alex@learnix.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title: 'Computer Science Scholar',
    enrolledCourses: 4,
    xpPoints: 1450,
    streakDays: 7,
  },
  instructor: {
    id: 'usr_instructor_01',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@learnix.edu',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    title: 'Senior AI & Web Systems Faculty',
    coursesCreated: 6,
    totalStudents: 1240,
    rating: 4.9,
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Marcus Vance',
    email: 'admin@learnix.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    title: 'Platform Administrator',
    accessLevel: 'SuperAdmin',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnix_user');
    return saved ? JSON.parse(saved) : DEFAULT_MOCK_USERS.student;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('learnix_token') || 'dummy_jwt_token_learnix_demo';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('learnix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('learnix_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('learnix_token', token);
    } else {
      localStorage.removeItem('learnix_token');
    }
  }, [token]);

  // Handle unauthorized event dispatched by API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('learnix:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('learnix:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password, role = 'student') => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const selectedUser = DEFAULT_MOCK_USERS[role] || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || 'Learnix User',
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    };

    setUser(selectedUser);
    const mockToken = `token_${role}_${Date.now()}`;
    setToken(mockToken);
    setIsLoading(false);
    return selectedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('learnix_user');
    localStorage.removeItem('learnix_token');
  };

  const switchRole = (newRole) => {
    if (DEFAULT_MOCK_USERS[newRole]) {
      setUser(DEFAULT_MOCK_USERS[newRole]);
      setToken(`token_${newRole}_switched`);
    }
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    switchRole,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
