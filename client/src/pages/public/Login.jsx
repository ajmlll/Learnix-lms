import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, GraduationCap, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

export const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('alex@learnix.edu');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('student');

  const from = location.state?.from?.pathname || `/${selectedRole}/dashboard`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, selectedRole);
    navigate(`/${selectedRole}/dashboard`, { replace: true });
  };

  const handleQuickRoleLogin = async (role) => {
    setSelectedRole(role);
    const mockEmail = role === 'instructor' ? 'elena.rostova@learnix.edu' : role === 'admin' ? 'admin@learnix.edu' : 'alex@learnix.edu';
    setEmail(mockEmail);
    await login(mockEmail, 'password123', role);
    navigate(`/${role}/dashboard`, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F8F9FC] font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-[10px] bg-[#4F46E5] flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-heading font-extrabold text-2xl text-gray-900 tracking-tight">
              Learn<span className="text-[#4F46E5]">ix</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold font-heading text-gray-900">Welcome Back to Learnix</h2>
          <p className="text-xs text-gray-500">Enter your credentials or choose a quick demo account</p>
        </div>

        {/* Login Form Card */}
        <Card className="space-y-6 shadow-soft-md">
          
          {/* Quick Demo Login Buttons */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-[10px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 font-heading">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                1-Click Quick Demo Sign In
              </span>
              <Badge variant="primary" size="sm">DEMO READY</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('student')}
                className="py-1.5 px-2 bg-white text-gray-800 hover:text-[#4F46E5] hover:border-indigo-300 border border-gray-200 rounded-[8px] text-[11px] font-semibold text-center transition-colors cursor-pointer"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('instructor')}
                className="py-1.5 px-2 bg-white text-gray-800 hover:text-[#D97706] hover:border-amber-300 border border-gray-200 rounded-[8px] text-[11px] font-semibold text-center transition-colors cursor-pointer"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('admin')}
                className="py-1.5 px-2 bg-white text-gray-800 hover:text-red-600 hover:border-red-300 border border-gray-200 rounded-[8px] text-[11px] font-semibold text-center transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-heading">
                Target Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['student', 'instructor', 'admin'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-1.5 text-xs font-semibold capitalize rounded-[8px] border transition-colors cursor-pointer ${
                      selectedRole === r
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={Mail}
              isRequired
              placeholder="alex@learnix.edu"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={Lock}
              isRequired
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#4F46E5] focus:ring-indigo-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[#4F46E5] font-semibold hover:underline">Forgot password?</a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={ArrowRight}
            >
              Sign In to Learnix
            </Button>
          </form>

        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account? <a href="#" className="text-[#4F46E5] font-semibold hover:underline">Request Access</a>
        </p>

      </div>
    </div>
  );
};

export default Login;
