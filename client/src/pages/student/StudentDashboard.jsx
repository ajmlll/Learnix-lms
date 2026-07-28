import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  Zap,
  PlayCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const weeklyActivityData = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 3.0 },
  { day: 'Thu', hours: 1.8 },
  { day: 'Fri', hours: 4.5 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 3.5 },
];

const enrolledCourses = [
  {
    id: 1,
    title: 'Full-Stack MERN Architecture 2026',
    instructor: 'Dr. Elena Rostova',
    progress: 78,
    nextLesson: 'Lesson 14: React 19 Server Actions & Hooks',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
    category: 'Development',
  },
  {
    id: 2,
    title: 'Advanced AI Prompt Engineering & Agents',
    instructor: 'Marcus Vance',
    progress: 45,
    nextLesson: 'Lesson 8: Multi-Agent Workflows & Memory',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    category: 'Artificial Intelligence',
  },
  {
    id: 3,
    title: 'UI/UX Design Systems with Tailwind v4',
    instructor: 'Sarah Jenkins',
    progress: 92,
    nextLesson: 'Lesson 20: Design Tokens & Micro-Interactions',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400',
    category: 'Design',
  },
];

export const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-[16px] p-6 sm:p-8 shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-mono">
              <Flame className="w-3.5 h-3.5 fill-slate-900" />
              {user?.streakDays || 7} DAY STREAK
            </span>
            <span className="text-indigo-200 text-xs font-mono">• {user?.xpPoints || 1450} XP Earned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            You've completed 78% of your weekly learning target. Continue where you left off in <strong className="text-amber-300">Full-Stack MERN Architecture</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button variant="amber" size="md" leftIcon={PlayCircle}>
            Resume Learning
          </Button>
        </div>

        {/* Decorative subtle ambient circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">4 Active</div>
          <p className="text-[11px] text-emerald-600 font-medium">+1 new this month</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Hours Studied</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">18.5 hrs</div>
          <p className="text-[11px] text-emerald-600 font-medium">+3.2 hrs vs last week</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Certificates</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">3 Earned</div>
          <p className="text-[11px] text-gray-500 font-medium">Verified credentials</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Overall Progress</span>
            <Zap className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">71.5%</div>
          <p className="text-[11px] text-[#4F46E5] font-medium">Top 5% student ranking</p>
        </Card>
      </div>

      {/* Main Grid: Activity Chart & Active Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: In Progress Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-gray-900">Continue Learning</h2>
            <a href="#" className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
              <span>View All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <Card hoverable key={course.id} className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full sm:w-28 h-20 rounded-[8px] object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" size="sm">{course.category}</Badge>
                      <span className="text-xs font-mono font-bold text-[#4F46E5]">{course.progress}%</span>
                    </div>
                    <h3 className="text-sm font-bold font-heading text-gray-900 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500">{course.nextLesson}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-full rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Weekly Study Activity Chart */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-heading text-gray-900">Study Activity</h2>
          
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-xs text-gray-500">This Week</p>
                <p className="text-base font-bold font-mono text-gray-900">18.5 Hours</p>
              </div>
              <Badge variant="amber" size="sm">GOAL MET</Badge>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
