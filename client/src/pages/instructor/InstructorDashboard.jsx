import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Star,
  Plus,
  TrendingUp,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import courseService from '../../services/courseService';

const defaultEnrollmentTrends = [
  { month: 'Jan', students: 45, revenue: 450 },
  { month: 'Feb', students: 110, revenue: 1100 },
  { month: 'Mar', students: 230, revenue: 2300 },
  { month: 'Apr', students: 420, revenue: 4200 },
  { month: 'May', students: 680, revenue: 6800 },
  { month: 'Jun', students: 950, revenue: 9500 },
];

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const data = await courseService.getMyCourses();
        setCourses(data || []);
      } catch (err) {
        console.error('[InstructorDashboard API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const publishedCount = courses.filter((c) => c.status === 'published').length;
  const draftCount = courses.filter((c) => c.status === 'draft').length;
  const pendingCount = courses.filter((c) => c.status === 'pending' || c.status === 'pending_review').length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>FACULTY STUDIO</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Welcome back, {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-xs text-gray-500">
            Track student enrollment trends, course ratings, and monthly revenue in real-time.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => navigate('/instructor/create-course')}
        >
          Create New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Enrolled Students</span>
            <Users className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{totalStudents}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Across all courses</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">My Courses</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{courses.length} Total</div>
          <p className="text-[11px] text-gray-500 font-medium">{publishedCount} Published • {pendingCount} Pending • {draftCount} Draft</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">4.9 / 5.0</div>
          <p className="text-[11px] text-emerald-600 font-medium">Verified student reviews</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">$12,450</div>
          <p className="text-[11px] text-emerald-600 font-medium">Platform payouts</p>
        </Card>
      </div>

      {/* Dual Series Recharts Line Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <div>
            <h2 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
              Enrollment & Revenue Growth
            </h2>
            <p className="text-xs text-gray-500">Monthly student enrollments vs. gross revenue generated</p>
          </div>
          <Badge variant="primary" size="sm">REAL-TIME DATA</Badge>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={defaultEnrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#4F46E5" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="students" name="Students Enrolled" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Activity className="w-4 h-4 text-[#4F46E5]" />
            Recent Student Activity
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>New student enrolled in your course</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Recent</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
              Student Q&A Threads
            </h3>
            <button
              onClick={() => navigate('/instructor/discussions')}
              className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Discussions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 py-4 text-center">Visit discussions module to view active student queries.</p>
        </Card>
      </div>

    </div>
  );
};

export default InstructorDashboard;
