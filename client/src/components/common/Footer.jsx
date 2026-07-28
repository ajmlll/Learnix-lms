import React from 'react';
import { GraduationCap, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#F8F9FC] border-t border-[#E5E7EB] pt-12 pb-8 font-sans text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E5E7EB]">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-gray-900">
                Learn<span className="text-[#4F46E5]">ix</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              A high-performance, next-generation Learning Management System designed for interactive courses, live analytics, and skill progression.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 w-max px-2.5 py-1 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#4F46E5] transition-colors">Course Catalog</Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-[#4F46E5] transition-colors">Student Dashboard</Link>
              </li>
              <li>
                <Link to="/instructor/dashboard" className="hover:text-[#4F46E5] transition-colors">Instructor Portal</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#4F46E5] transition-colors">Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack & Architecture */}
          <div>
            <h4 className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider mb-3">
              Tech Stack
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                React 19 + Vite 6
              </li>
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Tailwind CSS v4 & Framer Motion
              </li>
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                React Router v7 + Context API
              </li>
              <li className="flex items-center gap-1.5 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Axios Interceptors & Recharts
              </li>
            </ul>
          </div>

          {/* Col 4: Design System Spec */}
          <div>
            <h4 className="font-heading font-bold text-xs text-gray-900 uppercase tracking-wider mb-3">
              Design Tokens
            </h4>
            <div className="p-3 bg-white rounded-[12px] border border-gray-200 space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Primary Brand</span>
                <span className="font-mono text-[#4F46E5] font-semibold">#4F46E5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gamification</span>
                <span className="font-mono text-[#F59E0B] font-semibold">#F59E0B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Cards / Buttons</span>
                <span className="font-mono text-gray-700">12px / 8px</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Learnix LMS Platform. Built with precision and care.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-gray-700 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-700 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-700 cursor-pointer">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
