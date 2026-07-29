import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Users,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import courseService from '../../services/courseService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/Skeleton';

export const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error('[CourseDetails API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleModule = (index) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  const handleOpenPreview = (lesson) => {
    setActivePreviewLesson(lesson);
    setIsPreviewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto space-y-8 font-sans">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto font-sans">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold font-heading text-gray-900">Course Not Found</h2>
        <p className="text-xs text-gray-500">The requested course could not be located or has been removed.</p>
        <Button variant="primary" size="md" leftIcon={ArrowLeft} onClick={() => navigate('/courses')}>
          Back to Course Catalog
        </Button>
      </div>
    );
  }

  const categoryName = typeof course.category === 'object' ? (course.category?.name || 'General') : (course.category || 'General');
  const instructorName = typeof course.instructor === 'object' ? (course.instructor?.name || 'Faculty Member') : (course.instructor || 'Faculty Member');
  const instructorAvatar = typeof course.instructor === 'object' ? (course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250') : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

  return (
    <div className="font-sans space-y-12 pb-16">
      
      {/* 1. Dark Course Hero Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            
            {/* Category Breadcrumb & Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="sm">{categoryName}</Badge>
              <Badge variant="amber" size="sm">{course.level || 'All Levels'}</Badge>
              {course.isBestseller && <Badge variant="success" size="sm">BESTSELLER</Badge>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {course.subtitle || course.description}
            </p>

            {/* Rating & Stats row */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-slate-300">
              <div className="flex items-center gap-1.5 font-bold font-mono text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating || 5.0}</span>
                <span className="text-slate-400 font-normal">({course.reviewCount || 0} ratings)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{(course.studentsEnrolled || 0).toLocaleString()} Students</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>English (Subtitles included)</span>
              </div>
            </div>

            {/* Instructor snippet */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <img
                src={instructorAvatar}
                alt={instructorName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <p className="text-xs text-slate-400">Created by</p>
                <p className="text-sm font-bold text-white font-heading">{instructorName}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Content Grid (Curriculum + Sticky Pricing Card) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Left Column: Learning Points & Curriculum */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* What You'll Learn Box */}
            <Card className="p-6 space-y-4 bg-[#F8F9FC]">
              <h2 className="text-lg font-bold font-heading text-gray-900">What You'll Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(course.learningPoints || [
                  'Master Production Architecture & Code Standards',
                  'Build Full-Stack Applications with Real-time APIs',
                ]).map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Curriculum Accordion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-gray-900">Course Content</h2>
                  <p className="text-xs text-gray-500">
                    {course.curriculum?.length || 0} modules • {course.lecturesCount || 12} lectures
                  </p>
                </div>
              </div>

              {(course.curriculum || []).length > 0 ? (
                <div className="space-y-3 border border-gray-200 rounded-[12px] overflow-hidden bg-white">
                  {course.curriculum.map((module, index) => {
                    const isOpen = openModuleIndex === index;
                    return (
                      <div key={index} className="border-b border-gray-100 last:border-0">
                        <button
                          onClick={() => toggleModule(index)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50/70 hover:bg-gray-100/70 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs font-bold font-heading text-gray-900">
                              {module.moduleTitle}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-gray-500">{module.duration}</span>
                        </button>

                        {isOpen && (
                          <div className="p-3 bg-white space-y-2">
                            {module.lessons?.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50/40 text-xs transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <PlayCircle className="w-4 h-4 text-indigo-500" />
                                  <span className="font-medium text-gray-800">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lesson.isPreview && (
                                    <button
                                      onClick={() => handleOpenPreview(lesson)}
                                      className="text-[11px] font-bold text-[#4F46E5] underline cursor-pointer"
                                    >
                                      Preview Video
                                    </button>
                                  )}
                                  <span className="font-mono text-[11px] text-gray-400">{lesson.duration}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center text-xs text-gray-500">
                  Curriculum modules are being finalized by the instructor.
                </Card>
              )}
            </div>

            {/* Instructor Bio */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold font-heading text-gray-900">Meet Your Instructor</h2>
              <div className="flex items-start gap-4">
                <img
                  src={instructorAvatar}
                  alt={instructorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                />
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-gray-900">{instructorName}</h3>
                  <p className="text-xs text-[#4F46E5] font-semibold">Faculty Specialist</p>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {course.instructor?.bio || 'Experienced engineering instructor dedicated to building hands-on curriculum.'}
                  </p>
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column: Sticky Pricing & Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="p-6 space-y-6 shadow-soft-lg border-2 border-indigo-100">
                {/* Thumbnail Preview */}
                <div className="relative h-44 rounded-[8px] overflow-hidden group cursor-pointer" onClick={() => setIsPreviewModalOpen(true)}>
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center group-hover:bg-gray-900/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white text-[#4F46E5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-gray-900">₹{course.price || 0}</span>
                    {course.originalPrice > 0 && (
                      <span className="text-sm text-gray-400 line-through font-mono">₹{course.originalPrice}</span>
                    )}
                    <Badge variant="amber" size="sm">SPECIAL OFFER</Badge>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/student/my-learning')}>
                    Enroll Now
                  </Button>
                  <Button variant="outline" size="md" fullWidth onClick={() => navigate('/student/wishlist')}>
                    Add to Wishlist
                  </Button>
                </div>

                {/* Course Features Guarantee */}
                <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <p className="font-bold text-gray-900 font-heading">This course includes:</p>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>On-demand video lectures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Certificate of Completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>30-Day Money-Back Guarantee</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* Video Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={activePreviewLesson?.title || `Preview: ${course.title}`}
        size="lg"
      >
        <div className="space-y-4 text-center">
          <div className="h-64 bg-slate-900 rounded-[8px] flex items-center justify-center text-white space-y-2 flex-col">
            <PlayCircle className="w-12 h-12 text-[#F59E0B] animate-pulse" />
            <p className="text-xs text-slate-400">Sample video lesson preview playing...</p>
          </div>
          <Button variant="primary" onClick={() => setIsPreviewModalOpen(false)}>
            Close Video
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default CourseDetails;
