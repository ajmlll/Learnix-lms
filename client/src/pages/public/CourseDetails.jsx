import React, { useState } from 'react';
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
  Share2,
} from 'lucide-react';
import courseService from '../../services/courseService';

export const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState(null);

  React.useEffect(() => {
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

  return (
    <div className="font-sans space-y-12 pb-16">
      
      {/* 1. Dark Course Hero Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            
            {/* Category Breadcrumb & Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="sm">{course.category}</Badge>
              <Badge variant="amber" size="sm">{course.level}</Badge>
              {course.isBestseller && <Badge variant="success" size="sm">BESTSELLER</Badge>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {course.subtitle}
            </p>

            {/* Rating & Stats row */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-slate-300">
              <div className="flex items-center gap-1.5 font-bold font-mono text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.reviewCount} ratings)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{course.studentsEnrolled?.toLocaleString()} Students</span>
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
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <p className="text-xs text-slate-400">Created by</p>
                <p className="text-sm font-bold text-white font-heading">{course.instructor.name}</p>
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
                {course.learningPoints?.map((point, idx) => (
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
                    {course.curriculum?.length || 3} modules • {course.lecturesCount || 120} lectures • {course.duration} total length
                  </p>
                </div>
              </div>

              <div className="space-y-3 border border-gray-200 rounded-[12px] overflow-hidden bg-white">
                {course.curriculum?.map((module, index) => {
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
            </div>

            {/* Instructor Bio */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold font-heading text-gray-900">Meet Your Instructor</h2>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                />
                <div className="space-y-1">
                  <h3 className="text-base font-bold font-heading text-gray-900">{course.instructor.name}</h3>
                  <p className="text-xs text-[#4F46E5] font-semibold">{course.instructor.role}</p>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">{course.instructor.bio}</p>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-heading text-gray-900">Student Reviews</h2>
              <div className="space-y-3">
                {course.reviews?.map((review) => (
                  <Card key={review.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">{review.user}</p>
                          <p className="text-[10px] text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{review.comment}"</p>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Pricing & Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="p-6 space-y-6 shadow-soft-lg border-2 border-indigo-100">
                {/* Thumbnail Preview */}
                <div className="relative h-44 rounded-[8px] overflow-hidden group cursor-pointer" onClick={() => setIsPreviewModalOpen(true)}>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center group-hover:bg-gray-900/50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white text-[#4F46E5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-gray-900/80 px-2 py-0.5 rounded">
                    Preview Course
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-gray-900">${course.price}</span>
                    <span className="text-sm text-gray-400 line-through font-mono">${course.originalPrice}</span>
                    <Badge variant="amber" size="sm">40% OFF</Badge>
                  </div>
                  <p className="text-[11px] text-red-500 font-semibold">🔥 Sale ends in 2 days!</p>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/student/my-learning')}>
                    Enroll Now
                  </Button>
                  <Button variant="outline" size="md" fullWidth>
                    Add to Wishlist
                  </Button>
                </div>

                {/* Course Features Guarantee */}
                <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <p className="font-bold text-gray-900 font-heading">This course includes:</p>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>{course.duration} on-demand video</span>
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
