import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton, { CardSkeleton } from '../../components/common/Skeleton';
import enrollmentService from '../../services/enrollmentService';

const weeklyActivityData = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 3.0 },
  { day: 'Thu', hours: 1.8 },
  { day: 'Fri', hours: 4.5 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 3.5 },
];

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      setIsLoading(true);
      try {
        const data = await enrollmentService.getMyEnrolledCourses();
        setCourses(data || []);
      } catch (err) {
        console.error('[Student Dashboard API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-[16px]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const inProgressCourses = courses.filter((sc) => sc.status === 'in-progress');
  const activeMissionCourse = inProgressCourses[0] || courses[0] || {
    progressPercent: 0,
    progress: 0,
    course: { title: 'Explore Courses', thumbnail: '' },
    courseId: '',
  };

  const progressVal = activeMissionCourse.progressPercent || activeMissionCourse.progress || 0;

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Mission Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-[16px] p-6 sm:p-8 shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-400 text-slate-900 rounded-full flex items-center gap-1 font-mono">
              <Flame className="w-3.5 h-3.5 fill-slate-900" />
              {user?.streakDays || 7} DAY STREAK
            </span>
            <span className="text-indigo-200 text-xs font-mono">• {user?.xpPoints || 1450} XP Earned</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Welcome back, {user?.name || 'Learner'}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            You've completed <strong className="text-amber-300">{progressVal}%</strong> of your active course: <strong>{activeMissionCourse.course?.title}</strong>.
          </p>

          {/* Progress bar inside mission banner */}
          <div className="w-full max-w-md bg-indigo-950/60 h-2.5 rounded-full overflow-hidden border border-indigo-700/50">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressVal}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button
            variant="amber"
            size="md"
            leftIcon={PlayCircle}
            onClick={() => navigate(activeMissionCourse.courseId ? `/student/course/${activeMissionCourse.courseId}/play` : '/courses')}
          >
            Resume Learning
          </Button>
        </div>

        {/* Subtle ambient light */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Stats Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{courses.length} Total</div>
          <p className="text-[11px] text-emerald-600 font-medium">Active enrollments</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Hours Studied</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">24.5 hrs</div>
          <p className="text-[11px] text-emerald-600 font-medium">+4.2 hrs vs last week</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Certificates</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">1 Earned</div>
          <p className="text-[11px] text-gray-500 font-medium">Verified credentials</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Overall Completion</span>
            <Zap className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">74.3%</div>
          <p className="text-[11px] text-[#4F46E5] font-medium">Top 5% student ranking</p>
        </Card>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Continue Learning List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-gray-900">In-Progress Courses</h2>
            <button
              onClick={() => navigate('/student/my-learning')}
              className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Enrolled ({courses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((sc) => {
              const cId = sc.courseId || sc.course?._id || sc.course?.id;
              const catName = typeof sc.course?.category === 'object' ? (sc.course?.category?.name || 'General') : (sc.course?.category || 'General');
              const courseTitle = sc.course?.title || 'Untitled Course';
              const progressVal = sc.progressPercent || sc.progress || 0;

              return (
                <Card hoverable key={cId} className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={sc.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                      alt={courseTitle}
                      className="w-full sm:w-28 h-20 rounded-[8px] object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1.5 w-full">
                      <div className="flex items-center justify-between">
                        <Badge variant={sc.status === 'completed' ? 'success' : 'primary'} size="sm">
                          {sc.status === 'completed' ? 'COMPLETED' : catName}
                        </Badge>
                        <span className="text-xs font-mono font-bold text-[#4F46E5]">{progressVal}%</span>
                      </div>

                      <h3 className="text-sm font-bold font-heading text-gray-900 leading-snug">
                        {courseTitle}
                      </h3>

                      <p className="text-xs text-gray-500">
                        Next: <strong className="text-gray-700">{sc.currentLessonTitle || 'Module 1: Introduction'}</strong>
                      </p>
                    </div>
                  </div>

                {/* Progress bar & CTA */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        sc.status === 'completed' ? 'bg-emerald-500' : 'bg-[#4F46E5]'
                      }`}
                      style={{ width: `${sc.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-400">Last accessed: {sc.lastAccessed || 'Recently'}</span>
                    <Button
                      variant={sc.status === 'completed' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => navigate(`/student/course/${cId}/play`)}
                    >
                      {sc.status === 'completed' ? 'Review Lessons' : 'Continue Lesson'}
                    </Button>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>
        </div>

        {/* Right Col: Activity Chart */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-heading text-gray-900">Weekly Activity</h2>
          
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-xs text-gray-500">This Week</p>
                <p className="text-base font-bold font-mono text-gray-900">24.5 Hours</p>
              </div>
              <Badge variant="amber" size="sm">TARGET MET</Badge>
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

export default Dashboard;
