import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, GraduationCap, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
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
          <h2 className="text-xl font-bold font-heading text-gray-900">Reset Your Password</h2>
          <p className="text-xs text-gray-500">We'll send you instructions to reset your password</p>
        </div>

        {/* Card Container */}
        <Card className="p-6 space-y-6 shadow-soft-md">
          {isSubmitted ? (
            /* Success State View */
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <Badge variant="success" size="sm">RESET LINK DISPATCHED</Badge>
              <h3 className="text-base font-bold font-heading text-gray-900">Check Your Email</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                We've sent a password reset link to <strong className="text-gray-900">{email}</strong>. Please check your inbox and spam folder.
              </p>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setIsSubmitted(false)}
              >
                Resend Email
              </Button>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                leftIcon={Mail}
                isRequired
                placeholder="alex@learnix.edu"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={ArrowRight}
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-2 text-center border-t border-gray-100">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#4F46E5] font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ForgotPassword;
