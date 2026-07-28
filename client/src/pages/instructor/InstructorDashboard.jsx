import React from 'react';
import {
  Users,
  DollarSign,
  FolderPlus,
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
import { ENROLLMENT_TRENDS, INSTRUCTOR_DISCUSSIONS } from '../../data/mockData';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>FACULTY STUDIO</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Welcome back, {user?.name || 'Dr. Elena Rostova'}
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
            <span className="text-xs font-medium text-gray-500">Total Students</span>
            <Users className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">4,340</div>
          <p className="text-[11px] text-emerald-600 font-medium">+18.2% this month</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Courses</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">4 Created</div>
          <p className="text-[11px] text-gray-500 font-medium">2 Published • 1 Draft</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">4.9 / 5.0</div>
          <p className="text-[11px] text-emerald-600 font-medium">Based on 530 reviews</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">$21,390</div>
          <p className="text-[11px] text-emerald-600 font-medium">+$7,800 in June</p>
        </Card>
      </div>

      {/* Dual Series Recharts Line Chart: Students (Indigo #4F46E5) & Revenue (Amber #F59E0B) */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <div>
            <h2 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
              Enrollment & Revenue Growth (H1 2026)
            </h2>
            <p className="text-xs text-gray-500">Monthly student enrollments vs. gross revenue generated</p>
          </div>
          <Badge variant="primary" size="sm">REAL-TIME DATA</Badge>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ENROLLMENT_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#4F46E5" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line yAxisId="left" type="monotone" dataKey="students" name="Students Enrolled" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Section: Recent Activity & Student Q&A Threads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Recent Activity Feed */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Activity className="w-4 h-4 text-[#4F46E5]" />
            Recent Student Activity
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Alex Morgan enrolled in <strong>MERN Stack Bootcamp 2026</strong></span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">10m ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Sophia Chen submitted a 5★ review on <strong>AI Agent Engineering</strong></span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">1h ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Marcus Thorne completed Module 1 Quiz (100% Score)</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">3h ago</span>
            </div>
          </div>
        </Card>

        {/* Right: Unanswered Q&A Threads */}
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
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {INSTRUCTOR_DISCUSSIONS.map((disc) => (
              <div key={disc.id} className="p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">{disc.studentName}</span>
                  <Badge variant={disc.replied ? 'success' : 'amber'} size="sm">
                    {disc.replied ? 'REPLIED' : 'NEEDS REPLY'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1">"{disc.question}"</p>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};

export default InstructorDashboard;
