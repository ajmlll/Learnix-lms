import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  Flame,
  Target,
  Award,
  Trophy,
  Sparkles,
  HelpCircle,
  Code,
  Video,
  Bookmark,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import PageTransition from '../components/common/PageTransition';

export const StudentLayout = () => {
  const { user, logout, switchRole } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Learning', path: '/student/my-learning', icon: BookOpen, badge: '3 Active' },
    { label: 'XP & Level Hub', path: '/student/xp', icon: Zap, isGamified: true, badge: 'LVL 5' },
    { label: 'Streak Heatmap', path: '/student/streak', icon: Flame, isGamified: true, badge: '7 Days' },
    { label: 'Weekly Target', path: '/student/weekly-goal', icon: Target },
    { label: 'Achievements', path: '/student/achievements', icon: Award },
    { label: 'Leaderboard', path: '/student/leaderboard', icon: Trophy, isGamified: true, badge: '#3' },
    { label: 'AI Summary Notes', path: '/student/ai-notes', icon: Sparkles },
    { label: 'AI MCQ Quizzes', path: '/student/ai-quiz', icon: HelpCircle },
    { label: 'Code Playground', path: '/student/playground', icon: Code },
    { label: 'Live Masterclasses', path: '/student/live-classes', icon: Video, badge: 'LIVE' },
    { label: 'Certificates', path: '/student/certificates', icon: Award },
    { label: 'Wishlist', path: '/student/wishlist', icon: Bookmark },
    { label: 'Cart & Checkout', path: '/student/cart', icon: ShoppingBag },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  const sidebarW = isSidebarOpen ? 'w-64' : 'w-20';
  const sidebarMLClass = isSidebarOpen ? 'md:ml-64' : 'md:ml-20';
  const mobileNavItems = navItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      {/* ── Fixed Top Header ── */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#E5E7EB] h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen
              ? <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              : <ChevronRight className="w-5 h-5" aria-hidden="true" />}
          </button>

          <NavLink to="/" className="flex items-center gap-2" aria-label="Learnix home">
            <div className="w-8 h-8 rounded-[8px] bg-[#4F46E5] flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-heading font-extrabold text-lg text-gray-900 tracking-tight">
              Learn<span className="text-[#4F46E5]">ix</span>
            </span>
          </NavLink>

        </div>

        {/* Header Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NavLink
            to="/student/streak"
            className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold hover:bg-amber-100/70 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={`${user?.streakDays || 7} day streak, ${user?.xpPoints || 1450} XP`}
          >
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Flame className="w-4 h-4 fill-[#F59E0B]" aria-hidden="true" />
              <span>{user?.streakDays || 7} Day Streak</span>
            </div>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <div className="flex items-center gap-1 text-[#D97706] font-mono font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#F59E0B]" aria-hidden="true" />
              <span>{user?.xpPoints || 1450} XP</span>
            </div>
          </NavLink>

          <button
            onClick={() => switchRole('instructor')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-indigo-50 hover:text-[#4F46E5] rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Switch to Instructor
          </button>

          <NavLink
            to="/student/profile"
            className="flex items-center gap-2 pl-2 border-l border-gray-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
            aria-label="View profile"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={`${user?.name || 'User'} profile photo`}
              className="w-8 h-8 rounded-full object-cover border border-indigo-200"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-gray-500">Student</p>
            </div>
          </NavLink>
        </div>
      </header>

      {/* ── Fixed Sidebar ── */}
      <aside
        className={`hidden md:flex flex-col fixed top-16 left-0 bottom-0 bg-white border-r border-[#E5E7EB] transition-all duration-300 z-20 overflow-hidden ${sidebarW}`}
        role="navigation"
        aria-label="Student navigation"
      >
        {/* Nav Links */}
        <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={!isSidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-semibold transition-all duration-150 group focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    isActive
                      ? item.isGamified
                        ? 'bg-[#F59E0B] text-white shadow-xs'
                        : 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-200'
                      : 'text-gray-600 hover:bg-indigo-50/60 hover:text-[#4F46E5]'
                  }`
                }
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${item.isGamified ? 'text-current' : ''}`}
                  aria-hidden="true"
                />
                {isSidebarOpen && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0 ml-1 ${
                          item.badge === 'LIVE'
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Divider + Logout inline */}
          <div className="my-2 border-t border-gray-100" />

          <button
            onClick={() => { logout(); navigate('/login'); }}
            aria-label={!isSidebarOpen ? 'Sign Out' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content — offset by sidebar width ── */}
      <main
        className={`transition-all duration-300 pt-16 pb-24 md:pb-8 ${sidebarMLClass}`}
        id="main-content"
      >
        <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-1 py-1.5 flex items-center justify-around shadow-lg"
        aria-label="Mobile navigation"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-colors min-w-0 focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  isActive ? 'text-[#4F46E5]' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="truncate max-w-[48px]">{item.label.split(' ')[0]}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default StudentLayout;
