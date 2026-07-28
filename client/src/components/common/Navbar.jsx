import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Badge from './Badge';

export const Navbar = () => {
  const { user, isAuthenticated, logout, switchRole, role } = useAuth();
  const { searchQuery, setSearchQuery, notificationCount } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole);
    setIsRoleDropdownOpen(false);
    if (newRole === 'student') navigate('/student/dashboard');
    else if (newRole === 'instructor') navigate('/instructor/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  const getDashboardPath = () => {
    if (role === 'instructor') return '/instructor/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-[10px] bg-gradient-to-tr from-[#4F46E5] to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-gray-900">
                  Learn<span className="text-[#4F46E5]">ix</span>
                </span>
              </div>
            </Link>

            {/* Global Search Bar (Tablet & Desktop) */}
            <div className="hidden md:flex items-center relative w-64 lg:w-80">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, skills, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F8F9FC] border border-[#E5E7EB] rounded-[8px] focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Quick Switch Role Pills (Demo Friendly) */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-[#F8F9FC] hover:bg-gray-100 border border-[#E5E7EB] rounded-[8px] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Role: <strong className="capitalize text-[#4F46E5]">{role || 'Guest'}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-[12px] shadow-soft-md border border-gray-200 py-2 z-50"
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Switch Role View
                    </div>
                    <button
                      onClick={() => handleRoleSwitch('student')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer ${
                        role === 'student' ? 'text-[#4F46E5] font-bold bg-indigo-50/70' : 'text-gray-700'
                      }`}
                    >
                      <span>Student View</span>
                      {role === 'student' && <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('instructor')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer ${
                        role === 'instructor' ? 'text-[#4F46E5] font-bold bg-indigo-50/70' : 'text-gray-700'
                      }`}
                    >
                      <span>Instructor View</span>
                      {role === 'instructor' && <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('admin')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer ${
                        role === 'admin' ? 'text-[#4F46E5] font-bold bg-indigo-50/70' : 'text-gray-700'
                      }`}
                    >
                      <span>Admin Portal</span>
                      {role === 'admin' && <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#4F46E5] hover:bg-indigo-50/50 rounded-[8px] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#4F46E5]" />
                  <span>Dashboard</span>
                </Link>

                {/* Notifications Bell */}
                <button
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Profile Menu Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-[10px] hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-xs"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-[12px] shadow-soft-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                          <div className="mt-1.5">
                            <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'instructor' ? 'amber' : 'primary'} size="sm">
                              {user?.role?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to={getDashboardPath()}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-indigo-50/50 hover:text-[#4F46E5]"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>My Dashboard</span>
                          </Link>
                          <Link
                            to="/student/my-learning"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-indigo-50/50 hover:text-[#4F46E5]"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>My Courses</span>
                          </Link>
                        </div>

                        <div className="pt-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              logout();
                              navigate('/login');
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-[#4F46E5] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA] rounded-[8px] shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button (<768px) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg"
          >
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F9FC] border border-gray-200 rounded-lg outline-none"
              />
            </div>

            {/* Role Switch Buttons */}
            <div className="p-3 bg-[#F8F9FC] rounded-lg">
              <p className="text-[11px] font-semibold text-gray-500 mb-2">Switch View Role:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    handleRoleSwitch('student');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-md border ${
                    role === 'student' ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => {
                    handleRoleSwitch('instructor');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-md border ${
                    role === 'instructor' ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  Instructor
                </button>
                <button
                  onClick={() => {
                    handleRoleSwitch('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-md border ${
                    role === 'admin' ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Mobile Links */}
            <div className="space-y-1 pt-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Home / Public Overview
              </Link>
              <Link
                to={getDashboardPath()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Dashboard ({role})
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                    <p className="text-[10px] text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="px-3 py-1.5 text-xs text-red-600 font-semibold border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold bg-[#4F46E5] text-white rounded-lg"
                >
                  Log In
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
