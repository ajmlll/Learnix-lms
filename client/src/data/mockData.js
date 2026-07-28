export const CATEGORIES = [
  { id: 'dev', name: 'Web Development', count: 42, iconName: 'Code', color: 'indigo' },
  { id: 'ai', name: 'AI & Data Science', count: 28, iconName: 'Brain', color: 'amber' },
  { id: 'cloud', name: 'Cloud & DevOps', count: 19, iconName: 'Cloud', color: 'blue' },
  { id: 'mobile', name: 'Mobile App Dev', count: 15, iconName: 'Smartphone', color: 'emerald' },
  { id: 'design', name: 'UI/UX & Design Systems', count: 24, iconName: 'Palette', color: 'purple' },
  { id: 'security', name: 'Cyber Security & Systems', count: 12, iconName: 'Shield', color: 'red' },
];

export const COURSES = [
  {
    id: 'mern-bootcamp-2026',
    title: 'MERN Stack Bootcamp 2026: Production Architecture',
    subtitle: 'Build and deploy enterprise-grade web applications with React 19, Node.js, Express, and MongoDB.',
    category: 'Web Development',
    categoryId: 'dev',
    level: 'Intermediate',
    rating: 4.9,
    reviewCount: 342,
    studentsEnrolled: 2450,
    price: 89.99,
    originalPrice: 149.99,
    isBestseller: true,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
    updatedDate: 'June 2026',
    duration: '28.5 hrs',
    lecturesCount: 142,
    instructor: {
      name: 'Dr. Elena Rostova',
      role: 'Senior Software Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      rating: 4.9,
      studentsCount: 18400,
      coursesCount: 8,
      bio: 'Ex-Google Tech Lead with 12+ years of experience building distributed web systems and mentoring engineers worldwide.',
    },
    learningPoints: [
      'Master React 19 Server Actions, Hooks, and Concurrent Rendering',
      'Design RESTful & GraphQL APIs with Express and Node.js',
      'Optimize MongoDB queries, indexing, and aggregation pipelines',
    ],
    curriculum: [
      {
        moduleTitle: 'Module 1: React 19 Fundamentals & Modern Hooks',
        duration: '4.5 hrs',
        lessons: [
          { id: 'm1l1', title: '1. Course Overview & Production Mindset', duration: '12:40', isPreview: true },
          { id: 'm1l2', title: '2. React 19 Component Architecture', duration: '24:15', isPreview: true },
          { id: 'm1l3', title: '3. State Management & Context API Patterns', duration: '35:10', isPreview: false },
          { id: 'm1l4', title: '4. Custom Hooks & Performance Optimization', duration: '28:50', isPreview: false },
        ],
      },
    ],
    reviews: [],
  },
  {
    id: 'dsa-javascript-pro',
    title: 'Data Structures & Algorithms in JavaScript',
    subtitle: 'Ace your technical interviews with practical problem-solving strategies, visual animations, and LeetCode deep-dives.',
    category: 'Web Development',
    categoryId: 'dev',
    level: 'All Levels',
    rating: 4.8,
    reviewCount: 512,
    studentsEnrolled: 4120,
    price: 69.99,
    originalPrice: 119.99,
    isBestseller: true,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    updatedDate: 'May 2026',
    duration: '22.0 hrs',
    lecturesCount: 110,
    instructor: {
      name: 'Marcus Vance',
      role: 'Principal Staff Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      rating: 4.8,
      studentsCount: 22000,
      coursesCount: 5,
    },
    learningPoints: ['Big O notation', 'Arrays, Trees, Graphs'],
    curriculum: [],
    reviews: [],
  },
  {
    id: 'ai-agent-engineering',
    title: 'AI Agent Engineering & LangChain Workflows',
    subtitle: 'Build autonomous AI agents, multi-agent teams, vector store RAG systems, and custom tools with Python & LangGraph.',
    category: 'AI & Data Science',
    categoryId: 'ai',
    level: 'Advanced',
    rating: 4.95,
    reviewCount: 188,
    studentsEnrolled: 1890,
    price: 94.99,
    originalPrice: 159.99,
    isBestseller: false,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    updatedDate: 'July 2026',
    duration: '19.5 hrs',
    lecturesCount: 95,
    instructor: {
      name: 'Dr. Elena Rostova',
      role: 'Senior Software Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      rating: 4.9,
    },
    learningPoints: ['LangChain and LangGraph execution'],
    curriculum: [],
    reviews: [],
  },
];

export const ADMIN_USERS = [
  { id: 'usr1', name: 'Alex Morgan', email: 'alex.morgan@learnix.edu', role: 'student', status: 'active', joinedDate: 'Jan 15, 2026', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr2', name: 'Dr. Elena Rostova', email: 'elena.rostova@learnix.edu', role: 'instructor', status: 'active', joinedDate: 'Feb 01, 2025', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr3', name: 'Marcus Vance', email: 'marcus.vance@learnix.edu', role: 'instructor', status: 'active', joinedDate: 'Mar 10, 2025', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr4', name: 'Sarah Jenkins', email: 'sarah.jenkins@learnix.edu', role: 'instructor', status: 'active', joinedDate: 'Apr 22, 2025', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr5', name: 'David K. Miller', email: 'david.miller@gmail.com', role: 'student', status: 'active', joinedDate: 'May 04, 2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr6', name: 'Sophia Chen', email: 'sophia.chen@tech.io', role: 'student', status: 'active', joinedDate: 'Jun 12, 2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr7', name: 'Robert Blake', email: 'robert.blake@spammer.org', role: 'student', status: 'suspended', joinedDate: 'Jul 01, 2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr8', name: 'Admin Master', email: 'admin@learnix.edu', role: 'admin', status: 'active', joinedDate: 'Jan 01, 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
];

export const ADMIN_COURSES = [
  {
    id: 'mern-bootcamp-2026',
    title: 'MERN Stack Bootcamp 2026: Production Architecture',
    instructor: 'Dr. Elena Rostova',
    category: 'Web Development',
    status: 'published', // 'published' | 'pending_review' | 'draft'
    price: 89.99,
    submittedDate: 'June 10, 2026',
    studentsEnrolled: 2450,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
    notes: 'Complete 28-hour course covering React 19 Server Actions, Express REST APIs, and MongoDB index optimization.',
  },
  {
    id: 'graphql-microservices',
    title: 'GraphQL Microservices with Apollo & Node.js',
    instructor: 'Dr. Elena Rostova',
    category: 'Web Development',
    status: 'pending_review',
    price: 74.99,
    submittedDate: '3 hours ago',
    studentsEnrolled: 0,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
    notes: 'New curriculum submission featuring Apollo Federation 2, GraphQL subscriptions, and Distributed Schema stitching.',
  },
  {
    id: 'ai-agent-engineering',
    title: 'AI Agent Engineering & LangChain Workflows',
    instructor: 'Dr. Elena Rostova',
    category: 'AI & Data Science',
    status: 'published',
    price: 94.99,
    submittedDate: 'May 18, 2026',
    studentsEnrolled: 1890,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    notes: 'Advanced multi-agent workflow architecture using LangGraph and Python 3.12.',
  },
  {
    id: 'cybersecurity-zero-trust',
    title: 'Zero Trust Security Architecture & Cryptography',
    instructor: 'Marcus Vance',
    category: 'Cyber Security',
    status: 'pending_review',
    price: 99.99,
    submittedDate: 'Yesterday',
    studentsEnrolled: 0,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    notes: 'Enterprise Zero Trust model implementation with OAuth 2.1, OIDC, and mTLS.',
  },
];

export const ADMIN_PAYMENTS = [
  { id: 'tx_9841', studentName: 'Alex Morgan', courseTitle: 'MERN Stack Bootcamp 2026', amount: 89.99, gateway: 'Stripe', status: 'completed', date: 'Today, 2:15 PM' },
  { id: 'tx_9842', studentName: 'David K. Miller', courseTitle: 'DSA in JavaScript Pro', amount: 69.99, gateway: 'PayPal', status: 'completed', date: 'Yesterday' },
  { id: 'tx_9843', studentName: 'Sophia Chen', courseTitle: 'AI Agent Engineering', amount: 94.99, gateway: 'Stripe', status: 'completed', date: 'Yesterday' },
  { id: 'tx_9844', studentName: 'Robert Blake', courseTitle: 'Tailwind v4 Design Systems', amount: 49.99, gateway: 'Stripe', status: 'refunded', date: 'July 24, 2026' },
  { id: 'tx_9845', studentName: 'Lucas Wright', courseTitle: 'MERN Stack Bootcamp 2026', amount: 89.99, gateway: 'Apple Pay', status: 'pending', date: 'July 22, 2026' },
];

export const PLATFORM_GROWTH = [
  { month: 'Jan', users: 8400, revenue: 42000 },
  { month: 'Feb', users: 10200, revenue: 58000 },
  { month: 'Mar', users: 12500, revenue: 76000 },
  { month: 'Apr', users: 14100, revenue: 94000 },
  { month: 'May', users: 16400, revenue: 128000 },
  { month: 'Jun', users: 18400, revenue: 184200 },
];

export const INSTRUCTOR_COURSES = [
  {
    id: 'mern-bootcamp-2026',
    title: 'MERN Stack Bootcamp 2026: Production Architecture',
    category: 'Web Development',
    status: 'published',
    studentsEnrolled: 2450,
    revenue: 12450,
    rating: 4.9,
    price: 89.99,
    lastUpdated: '2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
  },
];

export const ENROLLMENT_TRENDS = [
  { month: 'Jan', students: 120, revenue: 2400 },
  { month: 'Feb', students: 180, revenue: 3600 },
  { month: 'Mar', students: 250, revenue: 4900 },
  { month: 'Apr', students: 220, revenue: 4200 },
  { month: 'May', students: 310, revenue: 6100 },
  { month: 'Jun', students: 380, revenue: 7800 },
];

export const INSTRUCTOR_DISCUSSIONS = [
  {
    id: 'disc1',
    studentName: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    courseTitle: 'MERN Stack Bootcamp 2026',
    question: 'Should we use optimistic updates when mutating state in React 19?',
    date: 'Yesterday at 2:14 PM',
    replied: true,
    reply: 'Yes! Combining useOptimistic with server actions provides instant UI feedback.',
  },
];

export const INSTRUCTOR_REVIEWS = [
  {
    id: 'rev1',
    studentName: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    courseTitle: 'MERN Stack Bootcamp 2026',
    rating: 5,
    comment: 'Dr. Elena Rostova is an incredible teacher.',
    date: 'June 20, 2026',
  },
];

export const PAYOUT_HISTORY = [
  { id: 'pay1', date: 'July 1, 2026', method: 'Direct Deposit (Bank ****4211)', amount: 4800.0, status: 'completed' },
];

export const STUDENT_COURSES = [
  {
    courseId: 'mern-bootcamp-2026',
    progress: 78,
    completedLessons: ['m1l1', 'm1l2', 'm1l3', 'm2l1', 'm2l2'],
    currentLessonId: 'm1l4',
    currentLessonTitle: '4. Custom Hooks & Performance Optimization',
    lastAccessed: '2 hours ago',
    certificateEarned: false,
    status: 'in-progress',
    course: COURSES[0],
  },
];

export const MOCK_XP_HISTORY = [
  { id: 'xp1', action: 'Completed Quiz: React 19 Hooks', xp: 50, date: 'Today, 2:15 PM', category: 'Quiz' },
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'ach1', title: 'Code Warrior', description: 'Run 25+ successful code executions in Playground', icon: 'Code', xpReward: 100, isUnlocked: true, unlockedDate: 'June 10, 2026', category: 'Coding' },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sophia Chen', title: 'Senior AI Engineer', xp: 3420, streak: 28, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', course: 'MERN Stack Architecture' },
];

export const MOCK_AI_QUIZ = {
  title: 'React 19 Server Actions & Hooks Quiz',
  questions: [
    {
      id: 'q1',
      question: 'Which new React 19 hook automatically manages pending states during form server action transitions?',
      options: ['useFormStatus', 'useActionState', 'useTransitionState', 'useServerAction'],
      correctAnswer: 1,
    },
  ],
};

export const MOCK_LIVE_CLASSES = [
  {
    id: 'live1',
    title: 'Live Workshop: React 19 Server Components & Actions in Production',
    instructor: 'Dr. Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    status: 'live',
    date: 'Happening Now',
    time: '4:00 PM - 5:30 PM EST',
    attendees: 184,
    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400',
  },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Emily Watson',
    role: 'Full-Stack Developer at TechCorp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    content: 'Learnix helped me transition from junior developer to lead architect in less than 8 months.',
    rating: 5,
    courseName: 'MERN Stack Bootcamp 2026',
  },
];

export const CART_ITEMS = [
  {
    id: 'ai-agent-engineering',
    course: COURSES[2],
  },
];

export const MOCK_LESSON_RESOURCES = [
  { id: 'res1', title: 'React 19 Hooks & Server Actions Cheat-Sheet.pdf', size: '2.4 MB', type: 'PDF' },
];

export const MOCK_USER_NOTES = [
  { id: 'n1', timestamp: '04:15', text: 'Remember: React 19 useActionState automatically handles pending transitions.', date: 'Today, 2:14 PM' },
];

export const MOCK_CERTIFICATES = {
  'LRNX-2026-9842': {
    certificateId: 'LRNX-2026-9842',
    studentName: 'Alex Morgan',
    courseTitle: 'UI/UX Design Systems with Tailwind CSS v4',
    instructorName: 'Sarah Jenkins',
    issueDate: 'June 14, 2026',
    grade: 'Distinction (98%)',
    credentialUrl: 'https://learnix.edu/verify/LRNX-2026-9842',
    skills: ['Tailwind CSS v4', 'Framer Motion'],
    isValid: true,
  },
};
