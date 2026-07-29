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
  Share2,
  FileText,
  Sparkles,
  Play,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

export const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, isEnrolled, isEnrollmentsLoading, refetchEnrollments } = useCart();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionProcessing, setIsActionProcessing] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Course link copied to clipboard!');
    }
  };

  // ── Action Handlers ──
  const handleEnrollFree = async () => {
    setIsActionProcessing(true);
    try {
      await enrollmentService.enroll(course._id || course.id);
      await refetchEnrollments();
      toast.success('🎉 Successfully enrolled in free course!');
      navigate('/student/my-learning');
    } catch (err) {
      console.error('[Free Enroll Error]:', err);
      toast.error(err.message || 'Failed to enroll in free course.');
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(course);
    toast.success('🛒 Added to cart!');
    navigate('/student/cart');
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

  const courseId = (course._id || course.id)?.toString();
  const categoryName = typeof course.category === 'object' ? (course.category?.name || 'General') : (course.category || 'General');
  const instructorName = typeof course.instructor === 'object' ? (course.instructor?.name || 'Faculty Member') : (course.instructor || 'Faculty Member');
  const instructorAvatar = typeof course.instructor === 'object' ? (course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250') : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

  const originalPrice = course.originalPrice || (course.price ? Math.round(course.price * 1.5) : 0);

  // Enrollment and Cart Checks
  const enrolled = isEnrolled(courseId);
  const inCart = isInCart(courseId);
  const isFree = !course.price || course.price === 0;

  // Render Action Button based on Priority Rules
  const renderActionButton = () => {
    // Show disabled loading button while enrollments are fetching to avoid text flashes
    if (user && isEnrollmentsLoading) {
      return (
        <Button variant="secondary" size="lg" fullWidth disabled>
          Checking status...
        </Button>
      );
    }

    // Rule e: Not logged in -> "Enroll now" -> Redirect to /login with return URL
    if (!user) {
      return (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={ArrowRight}
          onClick={() => navigate(`/login?redirect=/courses/${courseId}`)}
        >
          Enroll now
        </Button>
      );
    }

    // Rule a: Already enrolled -> "Continue learning" -> Navigate to My Learning
    if (enrolled) {
      return (
        <Button
          variant="success"
          size="lg"
          fullWidth
          leftIcon={Play}
          onClick={() => navigate('/student/my-learning')}
        >
          Continue learning
        </Button>
      );
    }

    // Rule b: Free, not enrolled -> "Enroll now — Free" -> Enroll directly, toast, navigate to My Learning
    if (isFree) {
      return (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isActionProcessing}
          rightIcon={ArrowRight}
          onClick={handleEnrollFree}
        >
          Enroll now — Free
        </Button>
      );
    }

    // Rule c: Paid, already in cart -> "Go to cart" -> Navigate to /student/cart
    if (inCart) {
      return (
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={ShoppingCart}
          onClick={() => navigate('/student/cart')}
        >
          Go to cart
        </Button>
      );
    }

    // Rule d: Paid, not in cart (default) -> "Enroll now — ₹{price}" -> Add to cart & immediately navigate to /student/cart
    return (
      <Button
        variant="primary"
        size="lg"
        fullWidth
        rightIcon={ArrowRight}
        onClick={handleBuyNow}
      >
        Enroll now — ₹{course.price}
      </Button>
    );
  };

  return (
    <div className="font-sans space-y-10 pb-20 bg-[#F8F9FC]">
      
      {/* ── 1. Hero Banner Section ── */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
          <div className="lg:col-span-2 space-y-5">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-indigo-400">{categoryName}</span>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="sm" hasDot>{categoryName}</Badge>
              <Badge variant="amber" size="sm">{course.level || 'All Levels'}</Badge>
              {course.isBestseller && <Badge variant="success" size="sm">BESTSELLER</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
              {course.subtitle || course.description}
            </p>

            {/* Metrics & Ratings */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 font-bold font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating || 5.0}</span>
                <span className="text-slate-400 font-normal">({course.reviewCount || 0} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="font-mono font-bold text-white">{(course.studentsEnrolled || 0).toLocaleString()}</span>
                <span>Students Enrolled</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>English (CC)</span>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={instructorAvatar}
                  alt={instructorName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Instructor</p>
                  <p className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                    {instructorName}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </p>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── 2. Content Grid (Main Details + Sticky Purchase Card) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Left Column: Learning Points & Syllabus */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* What You'll Learn Grid Card */}
            <Card className="p-6 space-y-4 bg-white border border-gray-200 shadow-soft">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles className="w-5 h-5 text-[#4F46E5]" />
                <h2 className="text-lg font-bold font-heading text-gray-900">What You'll Learn</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {(course.learningPoints || [
                  'Master Production Architecture & Code Standards',
                  'Build Full-Stack Applications with Real-time APIs',
                  'Deploy Cloud Applications with CI/CD Pipelines',
                  'Implement Security & User Authentication Best Practices',
                ]).map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Content / Syllabus Accordion */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold font-heading text-gray-900">Course Syllabus & Curriculum</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {course.curriculum?.length || 0} modules • {course.lecturesCount || 12} total lectures
                  </p>
                </div>
              </div>

              {(course.curriculum || []).length > 0 ? (
                <div className="space-y-3 border border-gray-200 rounded-[14px] overflow-hidden bg-white shadow-soft">
                  {course.curriculum.map((module, index) => {
                    const isOpen = openModuleIndex === index;
                    return (
                      <div key={index} className="border-b border-gray-100 last:border-0">
                        <button
                          onClick={() => toggleModule(index)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-indigo-50/50 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-[#4F46E5]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-xs font-bold font-heading text-gray-900">
                              Module {index + 1}: {module.moduleTitle}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-gray-500">{module.duration}</span>
                        </button>

                        {isOpen && (
                          <div className="p-3 bg-white space-y-2 divide-y divide-gray-50">
                            {module.lessons?.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 text-xs transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <PlayCircle className="w-4 h-4 text-[#4F46E5]" />
                                  <span className="font-semibold text-gray-800">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {lesson.isPreview && (
                                    <button
                                      onClick={() => handleOpenPreview(lesson)}
                                      className="px-2 py-0.5 text-[10px] font-bold text-[#4F46E5] bg-indigo-50 rounded hover:bg-indigo-100 transition-colors cursor-pointer"
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
                <Card className="p-8 text-center space-y-2 bg-white">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">Curriculum Modules Coming Soon</p>
                  <p className="text-[11px] text-gray-400">The instructor is currently uploading video lectures for this course.</p>
                </Card>
              )}
            </div>

            {/* Instructor Profile Box */}
            <Card className="p-6 space-y-4 bg-white border border-gray-200 shadow-soft">
              <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
                About the Instructor
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={instructorAvatar}
                  alt={instructorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shrink-0"
                />
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                    {instructorName}
                    <Badge variant="primary" size="sm">VERIFIED FACULTY</Badge>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {course.instructor?.bio || 'Senior software engineer and lead instructor committed to delivering world-class curriculum.'}
                  </p>
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column: Sticky Pricing & Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="p-6 space-y-6 shadow-soft-lg border-2 border-indigo-100 bg-white">
                
                {/* Thumbnail Preview Container */}
                <div
                  className="relative h-48 rounded-[12px] overflow-hidden group cursor-pointer border border-gray-200"
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center group-hover:bg-gray-900/50 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white text-[#4F46E5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs">
                    Preview Video Lesson
                  </span>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold font-mono text-gray-900">
                      {isFree ? 'Free' : `₹${course.price}`}
                    </span>
                    {!isFree && originalPrice > 0 && (
                      <span className="text-sm text-gray-400 line-through font-mono">₹{originalPrice}</span>
                    )}
                    <Badge variant={isFree ? 'success' : 'amber'} size="sm">
                      {isFree ? '100% FREE' : 'LIMITED OFFER'}
                    </Badge>
                  </div>
                </div>

                {/* Main Action Button */}
                <div className="space-y-2.5">
                  {renderActionButton()}
                  
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      toast.info(isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist!');
                    }}
                  >
                    {isWishlisted ? '❤️ Saved in Wishlist' : '🤍 Add to Wishlist'}
                  </Button>
                </div>

                {/* Course Features */}
                <div className="space-y-2.5 text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <p className="font-bold text-gray-900 font-heading">This course includes:</p>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-[#4F46E5]" />
                      <span>On-demand video lectures</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="w-4 h-4 text-[#4F46E5]" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Certificate of Completion</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
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
          <div className="h-64 bg-slate-900 rounded-[12px] flex items-center justify-center text-white space-y-2 flex-col">
            <PlayCircle className="w-14 h-14 text-[#F59E0B] animate-pulse" />
            <p className="text-xs text-slate-300">Sample video lesson playing...</p>
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
