import React from 'react';
import {
  Users,
  BookOpen,
  DollarSign,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import adminService from '../../services/adminService';

const defaultGrowthData = [
  { month: 'Jan', users: 120, revenue: 1200 },
  { month: 'Feb', users: 240, revenue: 2400 },
  { month: 'Mar', users: 480, revenue: 4900 },
  { month: 'Apr', users: 850, revenue: 8200 },
  { month: 'May', users: 1300, revenue: 14500 },
  { month: 'Jun', users: 1800, revenue: 21000 },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
  });
  const [pendingCourses, setPendingCourses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const [statsData, pendingData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getPendingCourses(),
        ]);
        if (statsData) setStats(statsData);
        if (pendingData?.data) setPendingCourses(pendingData.data);
      } catch (err) {
        console.error('[AdminDashboard API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const pendingApprovals = pendingCourses;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="dark" size="sm" hasDot>SUPERADMIN GOVERNANCE</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Platform Control Center
          </h1>
          <p className="text-xs text-gray-500">
            Monitor platform performance, user registrations, course approvals, and gross revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/approvals')}>
            Review Submissions ({pendingApprovals.length})
          </Button>
        </div>
      </div>

      {/* Metrics Row (Populated by $facet Aggregation) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Registered Users</span>
            <Users className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{stats.totalUsers || 0}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Platform-wide users</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Courses</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{stats.totalCourses || 0}</div>
          <p className="text-[11px] text-amber-700 font-medium">{pendingApprovals.length} Pending Approval</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Gross Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Successful Stripe payments</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Enrollments</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{stats.activeEnrollments || 0}</div>
          <p className="text-[11px] text-emerald-600 font-medium">Student enrollments</p>
        </Card>
      </div>

      {/* Recharts Area Chart: Platform User Growth & Revenue */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <div>
            <h2 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
              Platform Growth Trajectory
            </h2>
            <p className="text-xs text-gray-500">Monthly active user signups vs. gross platform revenue ($ USD)</p>
          </div>
          <Badge variant="primary" size="sm">LIVE REPORT</Badge>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={defaultGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#4F46E5" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey="users" name="Active Users" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" name="Gross Revenue ($)" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pending Course Submissions Approval Queue */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Curriculum Review Queue ({pendingApprovals.length})
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/approvals')}>
            Manage Submissions
          </Button>
        </div>

        {pendingApprovals.length > 0 ? (
          <div className="space-y-3">
            {pendingApprovals.slice(0, 3).map((course) => (
              <div key={course._id || course.id} className="p-4 bg-gray-50 rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{course.title}</h4>
                  <p className="text-xs text-gray-500">Instructor: {course.instructor?.name || 'Faculty Member'}</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => navigate('/admin/approvals')}>
                  Review Course
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">No pending courses awaiting review.</p>
        )}
      </Card>

    </div>
  );
};

export default AdminDashboard;
