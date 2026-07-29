import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, ArrowRight, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { toast } from 'react-toastify';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const user = await register(fullName, email, password, role);
      toast.success('Account created successfully!');
      navigate(`/${user.role || role}/dashboard`, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

    await login(email, password, role);
    toast.success(`Welcome to Learnix! Account created as ${role.toUpperCase()}.`);
    setIsSubmitting(false);
    navigate(`/${role}/dashboard`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F9FC] font-sans">
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
          <h2 className="text-xl font-bold font-heading text-gray-900">Sign Up</h2>
          <p className="text-xs text-gray-500">Join thousands of students and expert instructors today</p>
        </div>

        {/* Register Form Card */}
        <Card className="space-y-6 shadow-soft-md">
          
          {/* Role Selector Pill */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-heading">
              Select Your Learning Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 text-xs font-semibold rounded-[8px] border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  role === 'student'
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Join as Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('instructor')}
                className={`py-2 px-3 text-xs font-semibold rounded-[8px] border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  role === 'instructor'
                    ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Join as Instructor</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              leftIcon={User}
              isRequired
              placeholder="e.g. Sarah Jenkins"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={Mail}
              isRequired
              placeholder="sarah@example.com"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              isRequired
              placeholder="Min 6 characters"
            />

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={Lock}
              isRequired
              placeholder="Re-enter password"
            />

            {/* Terms checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#4F46E5] focus:ring-indigo-500"
                />
                <span>
                  I agree to the <a href="#" className="text-[#4F46E5] underline">Terms of Service</a> and <a href="#" className="text-[#4F46E5] underline">Privacy Policy</a>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 font-medium">{errors.terms}</p>}
            </div>

            <Button
              type="submit"
              variant={role === 'instructor' ? 'amber' : 'primary'}
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={ArrowRight}
            >
              Create {role === 'instructor' ? 'Instructor' : 'Student'} Account
            </Button>
          </form>

          {/* Already have an account */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#4F46E5] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </Card>

      </div>
    </div>
  );
};

export default Register;
