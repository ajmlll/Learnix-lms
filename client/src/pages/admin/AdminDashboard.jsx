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

      {/* Platform-wide Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Users</span>
            <Users className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">18,400</div>
          <p className="text-[11px] text-emerald-600 font-medium">+2,000 new this month</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Courses</span>
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">142 Published</div>
          <p className="text-[11px] text-amber-700 font-medium">2 Pending Approval</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Gross Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">$184,200</div>
          <p className="text-[11px] text-emerald-600 font-medium">+$56,200 in June</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Subscriptions</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">3,890</div>
          <p className="text-[11px] text-emerald-600 font-medium">94.2% Retention Rate</p>
        </Card>
      </div>

      {/* Recharts Area Chart: Platform User Growth (Indigo #4F46E5) & Gross Revenue (Amber #F59E0B) */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <div>
            <h2 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
              Platform Scale & Revenue Trajectory (H1 2026)
            </h2>
            <p className="text-xs text-gray-500">Monthly active user signups vs. gross platform revenue ($ USD)</p>
          </div>
          <Badge variant="primary" size="sm">H1 2026 REPORT</Badge>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PLATFORM_GROWTH}>
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
            Pending Curriculum Approvals Queue ({pendingApprovals.length})
          </h3>
          <button
            onClick={() => navigate('/admin/approvals')}
            className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Go to Approval Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {pendingApprovals.map((c) => (
            <div key={c.id} className="p-4 bg-[#F8F9FC] rounded-[8px] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={c.thumbnail} alt={c.title} className="w-12 h-12 rounded-[6px] object-cover shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 font-heading">{c.title}</h4>
                  <p className="text-[11px] text-gray-500">Instructor: {c.instructor} • Submitted {c.submittedDate}</p>
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={() => navigate('/admin/approvals')}>
                Review Submission
              </Button>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default AdminDashboard;
