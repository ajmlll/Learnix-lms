import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Mail, Lock, ArrowRight, Loader2, AlertCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60; // 5 minutes in seconds

const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Steps: 'credentials' | 'verifying'
  const [step, setStep] = useState('credentials');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Failed attempts & lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEnd, setLockoutEnd] = useState(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Lockout countdown
  useEffect(() => {
    if (!lockoutEnd) return;
    const tick = () => {
      const diff = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000));
      setLockoutRemaining(diff);
      if (diff <= 0) {
        setLockoutEnd(null);
        setFailedAttempts(0);
        setError('');
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockoutEnd]);

  const isLocked = lockoutEnd && lockoutRemaining > 0;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const incrementFailure = () => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    if (newAttempts >= MAX_ATTEMPTS) {
      setLockoutEnd(Date.now() + LOCKOUT_DURATION * 1000);
      setError(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 60} minutes.`);
    } else {
      setError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts !== 1 ? 's' : ''} remaining.`);
    }
  };

  // Credentials submission -> REST API login -> verifying -> dashboard
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setStep('verifying');

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== 'admin') {
        setStep('credentials');
        setIsSubmitting(false);
        setError('Access denied. Administrator privileges required.');
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setStep('credentials');
      setIsSubmitting(false);
      incrementFailure();
      setError(err.message || 'Invalid administrator credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[400px] space-y-6 relative z-10">
        {/* Logo Mark */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-[12px] bg-[#1E293B] border border-[#334155] flex items-center justify-center shadow-lg shadow-black/20">
            <ShieldAlert className="w-7 h-7 text-indigo-400" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] shadow-2xl shadow-black/30 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* ═══════ Credentials ═══════ */}
            {step === 'credentials' && (
              <motion.div
                key="credentials"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h1 className="text-lg font-bold font-heading text-white tracking-tight">Admin sign in</h1>
                  <p className="text-xs text-slate-400">Enter your administrator credentials</p>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-[8px] text-red-400 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Lockout Banner */}
                {isLocked && (
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-[8px] text-amber-400 text-xs font-mono">
                    <LockKeyhole className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Form locked. Try again in <strong>{formatTime(lockoutRemaining)}</strong></span>
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" aria-hidden="true" />
                      <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLocked}
                        placeholder="admin@learnix.edu"
                        autoComplete="email"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#0F172A] border border-[#334155] text-white text-sm rounded-[8px] placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" aria-hidden="true" />
                      <input
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLocked}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#0F172A] border border-[#334155] text-white text-sm rounded-[8px] placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isLocked}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B] outline-none"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ═══════ Verifying Device ═══════ */}
            {step === 'verifying' && (
              <motion.div
                key="verifying"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="py-8 space-y-4 text-center"
              >
                <div className="w-14 h-14 rounded-full border-2 border-indigo-500/30 flex items-center justify-center mx-auto">
                  <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white font-heading">Verifying session…</p>
                  <p className="text-xs text-slate-500">Establishing a secure connection</p>
                </div>
                <div className="space-y-2 pt-2 max-w-[200px] mx-auto">
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Footer */}
        <p className="text-center text-[11px] text-[#64748B] leading-relaxed px-4">
          This portal is restricted to authorized administrators.<br />
          All sign-in attempts are logged.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
