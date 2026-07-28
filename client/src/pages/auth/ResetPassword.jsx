import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, GraduationCap, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // Strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500 text-red-500' };
    if (password.length < 10) return { label: 'Medium', color: 'bg-amber-500 text-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500 text-emerald-500' };
  };

  const strength = getPasswordStrength();

  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsResetComplete(true);
    toast.success('Password successfully reset! You can now log in.');
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
          <h2 className="text-xl font-bold font-heading text-gray-900">Set New Password</h2>
          <p className="text-xs text-gray-500">Choose a strong password for your account</p>
        </div>

        <Card className="p-6 space-y-6 shadow-soft-md">
          {isResetComplete ? (
            /* Reset Complete State */
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <Badge variant="success" size="sm">PASSWORD UPDATED</Badge>
              <h3 className="text-base font-bold font-heading text-gray-900">Password Reset Complete</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Your password has been changed successfully. You can now sign in with your new credentials.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={ArrowRight}
                onClick={() => navigate('/login')}
              >
                Proceed to Sign In
              </Button>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  leftIcon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  isRequired
                  placeholder="At least 6 characters"
                />

                {/* Password Strength Meter */}
                {password && (
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Strength:</span>
                    <span className={`font-bold ${strength.color.split(' ')[1]}`}>{strength.label}</span>
                  </div>
                )}
              </div>

              <Input
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                leftIcon={Lock}
                isRequired
                placeholder="Re-enter new password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={ArrowRight}
              >
                Reset Password
              </Button>
            </form>
          )}
        </Card>

      </div>
    </div>
  );
};

export default ResetPassword;
