import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Play,
  CheckCircle2,
  Zap,
  Code,
  Brain,
  Cloud,
  Smartphone,
  Palette,
  Shield,
  Star,
  Quote,
  Search,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import courseService from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';

const iconMap = {
  Code,
  Brain,
  Cloud,
  Smartphone,
  Palette,
  Shield,
};

export const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, categoryRes] = await Promise.all([
          courseService.getCourses({ limit: 6 }),
          courseService.getCategories(),
        ]);
        setCourses(courseRes.courses || []);
        setCategories(categoryRes || []);
      } catch (err) {
        console.error('[Home API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses =
    selectedCategory === 'all'
      ? courses
      : courses.filter((c) => (c.category?._id || c.category) === selectedCategory);

  const handleQuickDemo = (role) => {
    navigate('/login');
  };

  return (
    <div className="space-y-20 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Elevate Your Engineering Skills with <span className="text-[#4F46E5]">Learnix</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed"
        >
          Interactive full-stack courses, AI agent engineering, and system architecture. Built with gamification streak mechanics and live analytics.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Button
            variant="primary"
            size="lg"
            rightIcon={ArrowRight}
            onClick={() => navigate('/courses')}
          >
            Explore All Courses
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </Button>
        </motion.div>

        {/* Platform Stat Highlights */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#E5E7EB] mt-10 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#4F46E5]">4,200+</p>
            <p className="text-xs text-gray-500 font-medium">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">120+</p>
            <p className="text-xs text-gray-500 font-medium">Expert Courses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500">4.9 ★</p>
            <p className="text-xs text-gray-500 font-medium">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">98%</p>
            <p className="text-xs text-gray-500 font-medium">Completion Rate</p>
          </div>
        </div>
      </section>

      {/* 2. Category Browser */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <Badge variant="primary" size="sm">BROWSE CATEGORIES</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 mt-1">
              Top Learning Paths
            </h2>
          </div>
          <Link to="/courses" className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1">
            <span>Explore all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const catId = cat.id || cat._id;
            const IconComponent = iconMap[cat.iconName] || Code;
            return (
              <Card
                key={catId}
                hoverable
                onClick={() => {
                  setSelectedCategory(catId);
                  navigate(`/courses?category=${catId}`);
                }}
                className="p-4 text-center space-y-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-[10px] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] mx-auto group-hover:bg-[#4F46E5] group-hover:text-white transition-colors duration-200">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-heading text-gray-900 group-hover:text-[#4F46E5] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{cat.count || 0} Courses</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Courses Grid with Tab Filters */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="amber" size="sm">FEATURED CURRICULUM</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900 mt-1">
              Popular Industry Courses
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Courses
            </button>
            {categories.slice(0, 4).map((cat) => {
              const catId = cat.id || cat._id;
              return (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer shrink-0 ${
                    selectedCategory === catId
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card hoverable key={course.id} className="p-0 overflow-hidden space-y-0 flex flex-col justify-between">
              <div>
                {/* Image header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.isBestseller && (
                      <Badge variant="amber" size="sm">BESTSELLER</Badge>
                    )}
                    <Badge variant="primary" size="sm">{course.level}</Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{typeof course.category === 'object' ? (course.category?.name || 'General') : (course.category || 'General')}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {course.rating || 5.0} ({course.reviewCount || 0})
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-gray-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {course.subtitle || course.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100 text-xs text-gray-500">
                    <img
                      src={typeof course.instructor === 'object' ? (course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250') : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt="Instructor"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-700">{typeof course.instructor === 'object' ? (course.instructor?.name || 'Faculty Member') : (course.instructor || 'Faculty Member')}</span>
                    <span className="ml-auto font-mono text-[11px]">{course.duration || 'Self-paced'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Price */}
              <div className="px-5 py-3 bg-[#F8F9FC] border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold font-mono text-gray-900">₹{course.price || 0}</span>
                  <span className="text-xs text-gray-400 line-through font-mono">₹{course.originalPrice || (course.price ? course.price * 1.5 : 0)}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  View Course
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Production Callout Banner */}
      <section className="bg-gradient-to-r from-[#4F46E5] to-indigo-700 text-white rounded-[16px] p-8 sm:p-12 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Ready to Start Learning or Teaching?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            Join thousands of developers leveling up their engineering skills on Learnix LMS today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button variant="amber" size="lg" onClick={() => navigate('/courses')}>
            Browse Catalog
          </Button>
          <Button variant="outline" size="lg" className="bg-white text-indigo-700 border-white hover:bg-indigo-50" onClick={() => navigate('/register')}>
            Sign Up Now
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Home;
