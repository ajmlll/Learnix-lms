import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  BookOpen,
  FolderTree,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import PageTransition from '../components/common/PageTransition';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Platform Overview', path: '/admin/dashboard', icon: TrendingUp },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Course Approvals', path: '/admin/approvals', icon: BookOpen },
    { label: 'Category Manager', path: '/admin/categories', icon: FolderTree },
    { label: 'Financial Ledger', path: '/admin/payments', icon: CreditCard },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const sidebarW = isSidebarOpen ? 'w-64' : 'w-20';
  const sidebarMLClass = isSidebarOpen ? 'md:ml-64' : 'md:ml-20';

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      {/* Top Header */}
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

          <NavLink to="/admin/dashboard" className="flex items-center gap-2" aria-label="Learnix Admin Home">
            <div className="w-8 h-8 rounded-[8px] bg-[#0F172A] flex items-center justify-center text-white font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-400" aria-hidden="true" />
            </div>
            <span className="font-heading font-extrabold text-lg text-gray-900 tracking-tight">
              Learn<span className="text-[#4F46E5]">ix</span>
            </span>
          </NavLink>
        </div>

        {/* Header Right */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700 hidden sm:inline">{user?.name || 'Administrator'}</span>
          <Badge variant="dark" size="sm">
            Admin
          </Badge>
        </div>
      </header>

      {/* Fixed Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-16 left-0 bottom-0 bg-white border-r border-[#E5E7EB] transition-all duration-300 z-20 overflow-hidden ${sidebarW}`}
        role="navigation"
        aria-label="Admin navigation"
      >
        <div className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={!isSidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs font-semibold transition-all duration-150 group focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-amber-500" aria-hidden="true" />
                {isSidebarOpen && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}

          <div className="my-2 border-t border-gray-100" />

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('/'); }}
            aria-label={!isSidebarOpen ? 'Sign Out' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
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

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-1 py-1.5 flex items-center justify-around shadow-lg"
        aria-label="Admin mobile navigation"
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-colors min-w-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive ? 'text-[#0F172A]' : 'text-gray-500 hover:text-gray-900'
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

export default AdminLayout;
