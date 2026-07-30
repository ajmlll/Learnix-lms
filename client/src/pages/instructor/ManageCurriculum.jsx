import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Video,
  Upload,
  CheckCircle2,
  BookOpen,
  Edit2,
  Play,
  Eye,
  Clock,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/Skeleton';
import courseService, { getFullVideoUrl } from '../../services/courseService';
import { toast } from 'react-toastify';

export const ManageCurriculum = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false);

  // Expanded Accordions State
  const [expandedSections, setExpandedSections] = useState({});

  // Section Modals State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('');

  // Lecture Modal State
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [videoMode, setVideoMode] = useState('file'); // 'file' | 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [lectureDurationSec, setLectureDurationSec] = useState(900); // 15 mins default
  const [isPreview, setIsPreview] = useState(false);
  const [resourceNote, setResourceNote] = useState('');
  const [isSubmittingLecture, setIsSubmittingLecture] = useState(false);

  // Video Preview Modal State
  const [previewVideoModal, setPreviewVideoModal] = useState({
    isOpen: false,
    title: '',
    videoUrl: '',
  });

  // Load instructor's created courses
  const fetchInstructorCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const data = await courseService.getMyCourses();
      setCourses(data || []);
      if (data && data.length > 0) {
        setSelectedCourseId(data[0]._id || data[0].id);
      }
    } catch (err) {
      console.error('[ManageCurriculum Courses API Error]:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  // Fetch target course details when selected course changes
  const fetchTargetCourse = async (courseId) => {
    if (!courseId) return;
    setIsLoadingCurriculum(true);
    try {
      const data = await courseService.getCourseById(courseId);
      setActiveCourse(data);
      // Auto expand all sections
      if (data?.sections) {
        const expandedMap = {};
        data.sections.forEach((sec, idx) => {
          expandedMap[sec._id || sec.id || idx] = true;
        });
        setExpandedSections(expandedMap);
      }
    } catch (err) {
      console.error('[ManageCurriculum Detail API Error]:', err);
      toast.error('Failed to load course curriculum.');
    } finally {
      setIsLoadingCurriculum(false);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchTargetCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  const toggleSectionExpand = (secId) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  // Section Handlers
  const handleOpenAddSection = () => {
    setEditingSectionId(null);
    setSectionTitle('');
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (section) => {
    setEditingSectionId(section._id || section.id);
    setSectionTitle(section.title);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!sectionTitle.trim() || !selectedCourseId) return;

    try {
      if (editingSectionId) {
        await courseService.updateSection(selectedCourseId, editingSectionId, {
          title: sectionTitle.trim(),
        });
        toast.success(`Section updated to "${sectionTitle}"!`);
      } else {
        await courseService.addSection(selectedCourseId, {
          title: sectionTitle.trim(),
        });
        toast.success(`Module section "${sectionTitle}" added!`);
      }
      setSectionTitle('');
      setIsSectionModalOpen(false);
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to save section.');
    }
  };

  const handleDeleteSection = async (sectionId, title) => {
    if (!selectedCourseId || !sectionId) return;
    if (!window.confirm(`Are you sure you want to delete module section "${title}" and all its lessons?`)) return;

    try {
      await courseService.deleteSection(selectedCourseId, sectionId);
      toast.info(`Section "${title}" removed.`);
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to delete section.');
    }
  };

  // Video File Selection & Automatic Duration Extraction
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoFileName(file.name);

    // Auto extract duration using HTML5 video element
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVideo.src);
      const durationSec = Math.round(tempVideo.duration || 900);
      setLectureDurationSec(durationSec);
      toast.info(`📹 Extracted video duration: ${formatSecToMin(durationSec)}`);
    };
    tempVideo.src = URL.createObjectURL(file);
  };

  // Lecture Handlers
  const handleOpenAddLecture = (sectionId) => {
    setActiveSectionId(sectionId);
    setEditingLectureId(null);
    setLectureTitle('');
    setVideoMode('file');
    setVideoUrl('');
    setVideoFile(null);
    setVideoFileName('');
    setLectureDurationSec(900);
    setIsPreview(false);
    setResourceNote('');
    setIsLectureModalOpen(true);
  };

  const isUploadedVideoUrl = (url) => {
    if (!url) return false;
    const str = String(url).toLowerCase();
    return (
      str.includes('/uploads/videos/') ||
      str.includes('/uploads/') ||
      str.includes('cloudinary.com') ||
      str.includes('amazonaws.com') ||
      str.startsWith('blob:') ||
      str.endsWith('.mp4') ||
      str.endsWith('.mov') ||
      str.endsWith('.webm')
    );
  };

  const handleOpenEditLecture = (sectionId, lecture) => {
    setActiveSectionId(sectionId);
    setEditingLectureId(lecture._id || lecture.id);
    setLectureTitle(lecture.title);

    const existingUrl = lecture.videoUrl || '';
    setVideoUrl(existingUrl);
    setVideoFile(null);

    const isFileUpload = isUploadedVideoUrl(existingUrl) || !existingUrl;
    setVideoMode(isFileUpload ? 'file' : 'url');

    if (isFileUpload && existingUrl) {
      const filename = existingUrl.split('/').pop().split('?')[0];
      setVideoFileName(filename);
    } else {
      setVideoFileName('');
    }

    setLectureDurationSec(lecture.duration || 900);
    setIsPreview(!!lecture.isPreview);
    setResourceNote(lecture.resourceNote || '');
    setIsLectureModalOpen(true);
  };

  const handleSaveLecture = async (e) => {
    e.preventDefault();
    if (!lectureTitle.trim() || !selectedCourseId || !activeSectionId) return;

    setIsSubmittingLecture(true);
    try {
      const formData = new FormData();
      formData.append('title', lectureTitle.trim());
      formData.append('duration', lectureDurationSec);
      formData.append('isPreview', isPreview);
      if (resourceNote) formData.append('resourceNote', resourceNote);

      if (videoMode === 'file') {
        if (videoFile) {
          formData.append('video', videoFile);
        } else if (videoUrl) {
          formData.append('videoUrl', videoUrl);
        }
      } else if (videoMode === 'url' && videoUrl.trim()) {
        formData.append('videoUrl', videoUrl.trim());
      }

      if (editingLectureId) {
        await courseService.updateLecture(selectedCourseId, activeSectionId, editingLectureId, formData);
        toast.success('🎉 Lecture updated successfully!');
      } else {
        await courseService.addLecture(selectedCourseId, activeSectionId, formData);
        toast.success('🎉 New lecture added to section!');
      }

      setIsLectureModalOpen(false);
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to save lecture.');
    } finally {
      setIsSubmittingLecture(false);
    }
  };

  const handleDeleteLecture = async (sectionId, lectureId, title) => {
    if (!selectedCourseId || !sectionId || !lectureId) return;
    if (!window.confirm(`Remove lecture "${title}"?`)) return;

    try {
      await courseService.deleteLecture(selectedCourseId, sectionId, lectureId);
      toast.info('Lecture removed.');
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to delete lecture.');
    }
  };

  // Helper Duration Formatters
  const formatSecToMin = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Course Stats & Audit Metrics
  const calculateCourseMetrics = () => {
    if (!activeCourse || !activeCourse.sections) {
      return { totalSections: 0, totalLectures: 0, totalDurationSec: 0, freePreviewsCount: 0, readinessPercent: 0 };
    }

    let totalLectures = 0;
    let totalDurationSec = 0;
    let freePreviewsCount = 0;

    activeCourse.sections.forEach((sec) => {
      (sec.lectures || []).forEach((lec) => {
        totalLectures += 1;
        totalDurationSec += lec.duration || 0;
        if (lec.isPreview) freePreviewsCount += 1;
      });
    });

    const totalSections = activeCourse.sections.length;
    let score = 0;
    if (totalSections >= 1) score += 30;
    if (totalLectures >= 3) score += 40;
    if (freePreviewsCount >= 1) score += 15;
    if (totalDurationSec >= 600) score += 15;

    return {
      totalSections,
      totalLectures,
      totalDurationSec,
      freePreviewsCount,
      readinessPercent: score,
    };
  };

  const metrics = calculateCourseMetrics();

  return (
    <div className="space-y-8 font-sans pb-12">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[16px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>CURRICULUM STUDIO</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900 tracking-tight">
            Course Curriculum & Video Builder
          </h1>
          <p className="text-xs text-gray-500">
            Structure course modules, upload video lectures, set free previews, and audit course readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            leftIcon={Plus}
            disabled={!selectedCourseId || isLoadingCurriculum}
            onClick={handleOpenAddSection}
          >
            Add Module Section
          </Button>
        </div>
      </div>

      {/* Course Target Selector */}
      <Card className="p-4 bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#4F46E5]" />
          <span className="text-xs font-bold text-gray-800 font-heading">Select Target Course:</span>
        </div>
        {isLoadingCourses ? (
          <div className="h-9 w-72 bg-gray-100 animate-pulse rounded-md" />
        ) : courses.length > 0 ? (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-80 text-xs font-semibold bg-[#F8F9FC] border border-gray-200 rounded-[8px] p-2.5 outline-none cursor-pointer focus:border-[#4F46E5] transition-colors"
          >
            {courses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.title} ({c.status?.toUpperCase() || 'DRAFT'})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-gray-500 italic">No created courses found. Please create a course first.</p>
        )}
      </Card>

      {/* Main 2-Column Curriculum Studio Layout */}
      {isLoadingCurriculum ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      ) : !activeCourse ? (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 font-heading">No Course Selected</h3>
          <p className="text-xs text-gray-500">Select a course from the dropdown above to manage its curriculum.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT COLUMN: Modules & Lectures Accordion Canvas */}
          <div className="lg:col-span-2 space-y-4">

            {(activeCourse.sections || []).length === 0 ? (
              <Card className="p-12 text-center space-y-4 border-2 border-dashed border-gray-200">
                <Layers className="w-10 h-10 text-indigo-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 font-heading">No Sections Added Yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Start building your syllabus for <strong>"{activeCourse.title}"</strong> by adding your first module section.
                  </p>
                </div>
                <Button variant="primary" size="md" leftIcon={Plus} onClick={handleOpenAddSection}>
                  Add First Module Section
                </Button>
              </Card>
            ) : (
              (activeCourse.sections || []).map((sec, mIdx) => {
                const sectionId = sec._id || sec.id || `sec-${mIdx}`;
                const isExpanded = expandedSections[sectionId] !== false;
                const lectures = sec.lectures || [];
                const secDurationSec = lectures.reduce((acc, l) => acc + (l.duration || 0), 0);

                return (
                  <Card key={sectionId} className="p-0 border border-gray-200 shadow-soft overflow-hidden">
                    {/* Section Header Accordion */}
                    <div className="flex items-center justify-between p-4 bg-slate-50/80 border-b border-gray-100">
                      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => toggleSectionExpand(sectionId)}>
                        <button className="text-gray-400 hover:text-gray-700">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#4F46E5]" />
                          <h3 className="text-xs sm:text-sm font-bold font-heading text-gray-900">
                            Module {mIdx + 1}: {sec.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-200">
                          {lectures.length} lessons • {formatSecToMin(secDurationSec)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditSection(sec)}
                            className="p-1 text-gray-400 hover:text-[#4F46E5] transition-colors cursor-pointer"
                            title="Edit Section Name"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sectionId, sec.title)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section Content / Lessons */}
                    {isExpanded && (
                      <div className="p-4 space-y-3 bg-white">
                        {lectures.length > 0 ? (
                          <div className="space-y-2">
                            {lectures.map((lesson, lIdx) => {
                              const lessonId = lesson._id || lesson.id || `lec-${lIdx}`;
                              const hasVideo = !!(lesson.videoUrl || lesson.video);

                              return (
                                <div
                                  key={lessonId}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#F8F9FC] rounded-[10px] border border-gray-200 gap-2 hover:border-indigo-200 transition-all group"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4F46E5] shrink-0 font-bold text-xs font-heading">
                                      {lIdx + 1}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-gray-800 truncate">{lesson.title}</span>
                                        {lesson.isPreview && (
                                          <Badge variant="amber" size="sm">FREE PREVIEW</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
                                        <span className="flex items-center gap-1 font-mono">
                                          <Clock className="w-3 h-3" />
                                          {formatSecToMin(lesson.duration)}
                                        </span>
                                        {hasVideo ? (
                                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Video Uploaded
                                          </span>
                                        ) : (
                                          <span className="text-amber-600 font-semibold flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Video Missing
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                                    {hasVideo && (
                                      <button
                                        type="button"
                                        onClick={() => setPreviewVideoModal({
                                          isOpen: true,
                                          title: lesson.title,
                                          videoUrl: getFullVideoUrl(lesson.videoUrl || lesson.video),
                                        })}
                                        className="flex items-center gap-1 py-1 px-2.5 bg-indigo-50 text-[#4F46E5] hover:bg-indigo-100 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer"
                                        title="Preview Video"
                                      >
                                        <Play className="w-3 h-3 fill-current" />
                                        <span>Play</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditLecture(sectionId, lesson)}
                                      className="p-1.5 text-gray-500 hover:text-[#4F46E5] hover:bg-white rounded-[6px] transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                                      title="Edit Lesson Details"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLecture(sectionId, lessonId, lesson.title)}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-[6px] transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                                      title="Remove Lesson"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic py-2 text-center">No video lessons added to this module section yet.</p>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={Plus}
                          onClick={() => handleOpenAddLecture(sectionId)}
                          className="w-full justify-center border-dashed border-indigo-200 text-[#4F46E5] hover:bg-indigo-50/50 mt-2"
                        >
                          Add Lesson to Module {mIdx + 1}
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })
            )}

          </div>

          {/* RIGHT COLUMN: Course Audit & Readiness Checklist */}
          <div className="space-y-6">

            <Card className="p-5 space-y-5 border border-indigo-100 shadow-soft bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold text-gray-900 font-heading flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  Curriculum Audit & Health
                </span>
                <Badge variant={metrics.readinessPercent >= 80 ? 'success' : 'amber'} size="sm">
                  {metrics.readinessPercent}% READY
                </Badge>
              </div>

              {/* Progress Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-600">Syllabus Completion</span>
                  <span className="text-[#4F46E5] font-bold">{metrics.readinessPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${metrics.readinessPercent}%` }}
                  />
                </div>
              </div>

              {/* Course Metrics Overview */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#F8F9FC] rounded-[10px] border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 block">Total Modules</span>
                  <span className="text-lg font-bold font-heading text-gray-900">{metrics.totalSections}</span>
                </div>
                <div className="p-3 bg-[#F8F9FC] rounded-[10px] border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 block">Total Lessons</span>
                  <span className="text-lg font-bold font-heading text-gray-900">{metrics.totalLectures}</span>
                </div>
                <div className="p-3 bg-[#F8F9FC] rounded-[10px] border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 block">Total Duration</span>
                  <span className="text-sm font-bold font-heading text-[#4F46E5]">{formatSecToMin(metrics.totalDurationSec)}</span>
                </div>
                <div className="p-3 bg-[#F8F9FC] rounded-[10px] border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 block">Free Previews</span>
                  <span className="text-sm font-bold font-heading text-amber-600">{metrics.freePreviewsCount} lessons</span>
                </div>
              </div>

              {/* Readiness Checklist */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 font-heading block">Quality Guidelines:</span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    {metrics.totalSections >= 1 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    )}
                    <span className={metrics.totalSections >= 1 ? 'text-gray-700' : 'text-gray-400'}>
                      At least 1 module section
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {metrics.totalLectures >= 3 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    )}
                    <span className={metrics.totalLectures >= 3 ? 'text-gray-700' : 'text-gray-400'}>
                      At least 3 video lessons added
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {metrics.freePreviewsCount >= 1 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    )}
                    <span className={metrics.freePreviewsCount >= 1 ? 'text-gray-700' : 'text-gray-400'}>
                      Include 1+ Free Preview lesson
                    </span>
                  </div>
                </div>
              </div>

            </Card>

            {/* Quick Tip Box */}
            <Card className="p-4 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 text-xs space-y-2 rounded-[12px]">
              <div className="flex items-center gap-1.5 font-bold text-[#4F46E5] font-heading">
                <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                Instructor Best Practices
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Break content into digestible 5–15 minute video lessons. Add a Free Preview to boost student enrollment conversion.
              </p>
            </Card>

          </div>

        </div>
      )}

      {/* Add / Edit Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title={editingSectionId ? 'Edit Module Section' : 'Add New Module Section'}
        size="md"
      >
        <form onSubmit={handleSaveSection} className="space-y-4">
          <Input
            label="Section Title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            placeholder="e.g. Module 1: Foundational Architecture & Setup"
            isRequired
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" leftIcon={CheckCircle2}>
              Save Section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Video Lecture Modal */}
      <Modal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        title={editingLectureId ? 'Edit Video Lesson' : 'Add New Video Lesson'}
        size="lg"
      >
        <form onSubmit={handleSaveLecture} className="space-y-5">
          <Input
            label="Lesson Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g. 1. Introduction to Project Architecture"
            isRequired
          />

          {/* Video Source Tabs */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-heading">Video Upload Source</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8F9FC] border border-gray-200 rounded-[10px]">
              <button
                type="button"
                onClick={() => setVideoMode('file')}
                className={`py-2 px-3 text-xs font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  videoMode === 'file'
                    ? 'bg-white text-[#4F46E5] shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload MP4 Video File
              </button>

              <button
                type="button"
                onClick={() => setVideoMode('url')}
                className={`py-2 px-3 text-xs font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  videoMode === 'url'
                    ? 'bg-white text-[#4F46E5] shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                External Video Link (URL)
              </button>
            </div>
          </div>

          {/* Video Input Box */}
          {videoMode === 'file' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">
                Select Video File (MP4, MOV up to 500MB)
              </label>
              <label className="border-2 border-dashed border-indigo-200 hover:border-[#4F46E5] rounded-[12px] p-6 text-center bg-indigo-50/30 hover:bg-indigo-50/60 transition-all cursor-pointer block space-y-2">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/mkv"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
                <Upload className="w-7 h-7 text-[#4F46E5] mx-auto" />
                {videoFileName ? (
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-900">{videoFileName}</p>
                    {videoFile ? (
                      <p className="text-[11px] text-emerald-600 font-semibold">✓ New video file selected (Will replace on save)</p>
                    ) : (
                      <p className="text-[11px] text-[#4F46E5] font-semibold">📹 Existing Uploaded Video File (Click to select a new MP4 file to replace)</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800">Click or drag video file here</p>
                    <p className="text-[10px] text-gray-400">Duration will be auto-calculated upon file selection</p>
                  </div>
                )}
              </label>
            </div>
          ) : (
            <Input
              label="Direct Video URL / Embed Link"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. https://res.cloudinary.com/.../video.mp4 or YouTube / Vimeo URL"
              leftIcon={LinkIcon}
            />
          )}

          {/* Duration & Free Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">
                Duration (in seconds)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={lectureDurationSec}
                  onChange={(e) => setLectureDurationSec(parseInt(e.target.value, 10) || 0)}
                  min="0"
                />
                <span className="text-xs font-mono text-gray-500 shrink-0 font-bold">
                  ({formatSecToMin(lectureDurationSec)})
                </span>
              </div>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 p-3 bg-amber-50/60 border border-amber-200 rounded-[10px] cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={isPreview}
                  onChange={(e) => setIsPreview(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block font-heading">Allow Free Preview</span>
                  <span className="text-[10px] text-amber-700 block">Non-enrolled users can sample this lesson</span>
                </div>
              </label>
            </div>
          </div>

          <Input
            label="Lesson Resource / Note (Optional)"
            value={resourceNote}
            onChange={(e) => setResourceNote(e.target.value)}
            placeholder="e.g. Starter code link or PDF slide deck notes"
            leftIcon={FileText}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button variant="secondary" size="md" onClick={() => setIsLectureModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmittingLecture} leftIcon={CheckCircle2}>
              {editingLectureId ? 'Update Lesson' : 'Save Lesson'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Live Video Player Preview Modal */}
      <Modal
        isOpen={previewVideoModal.isOpen}
        onClose={() => setPreviewVideoModal({ isOpen: false, title: '', videoUrl: '' })}
        title={`Video Preview: ${previewVideoModal.title}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-[12px] overflow-hidden shadow-lg flex items-center justify-center">
            {previewVideoModal.videoUrl ? (
              (() => {
                const src = previewVideoModal.videoUrl;
                if (src instanceof File || src instanceof Blob) {
                  const blobUrl = URL.createObjectURL(src);
                  return <video src={blobUrl} controls autoPlay className="w-full h-full object-contain" />;
                }

                const url = getFullVideoUrl(src);
                if (!url) return null;

                // YouTube
                if (url.includes('youtube.com/watch?v=')) {
                  const id = url.split('v=')[1]?.split('&')[0];
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                      title={previewVideoModal.title || 'Video Preview'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                if (url.includes('youtu.be/')) {
                  const id = url.split('youtu.be/')[1]?.split('?')[0];
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                      title={previewVideoModal.title || 'Video Preview'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                // Google Drive
                if (url.includes('drive.google.com')) {
                  let driveUrl = url;
                  if (url.includes('/view')) {
                    driveUrl = url.replace('/view', '/preview');
                  } else if (!url.includes('/preview')) {
                    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) {
                      driveUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
                    }
                  }
                  return (
                    <iframe
                      src={driveUrl}
                      title={previewVideoModal.title || 'Video Preview'}
                      className="w-full h-full border-0"
                      allow="autoplay"
                      allowFullScreen
                    />
                  );
                }

                // Loom
                if (url.includes('loom.com/share/')) {
                  const id = url.split('loom.com/share/')[1]?.split('?')[0];
                  return (
                    <iframe
                      src={`https://www.loom.com/embed/${id}`}
                      title={previewVideoModal.title || 'Video Preview'}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  );
                }

                // Vimeo
                if (url.includes('vimeo.com/')) {
                  const id = url.split('vimeo.com/')[1]?.split('?')[0];
                  return (
                    <iframe
                      src={`https://player.vimeo.com/video/${id}?autoplay=1`}
                      title={previewVideoModal.title || 'Video Preview'}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                // Direct video formats (.mp4, .webm, .mov, Cloudinary, S3, blob, or /uploads/)
                const isDirect =
                  url.startsWith('blob:') ||
                  url.endsWith('.mp4') ||
                  url.endsWith('.webm') ||
                  url.endsWith('.mov') ||
                  url.includes('cloudinary.com') ||
                  url.includes('amazonaws.com') ||
                  url.includes('/video/upload/') ||
                  url.includes('/uploads/');

                if (isDirect) {
                  return (
                    <video
                      src={url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  );
                }

                // General web video link / embed fallback
                return (
                  <iframe
                    src={url}
                    title={previewVideoModal.title || 'Video Preview'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              })()
            ) : (
              <div className="text-center text-gray-400 p-6 space-y-2">
                <Video className="w-10 h-10 mx-auto text-gray-500" />
                <p className="text-xs">No playable video stream found for this lecture.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPreviewVideoModal({ isOpen: false, title: '', videoUrl: '' })}
            >
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ManageCurriculum;
