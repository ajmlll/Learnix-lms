import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Video, Upload, CheckCircle2, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/Skeleton';
import courseService from '../../services/courseService';
import { toast } from 'react-toastify';

export const ManageCurriculum = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(false);

  // Modals
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('15:00');

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

  // Handle Add Section
  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim() || !selectedCourseId) return;

    try {
      await courseService.addSection(selectedCourseId, {
        title: newSectionTitle.trim(),
      });
      toast.success(`Section "${newSectionTitle}" added!`);
      setNewSectionTitle('');
      setIsSectionModalOpen(false);
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to add section.');
    }
  };

  // Handle Delete Section
  const handleDeleteSection = async (sectionId, title) => {
    if (!selectedCourseId || !sectionId) return;
    try {
      await courseService.deleteSection(selectedCourseId, sectionId);
      toast.info(`Section "${title}" removed.`);
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to delete section.');
    }
  };

  // Handle Add Lecture
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!lectureTitle.trim() || !selectedCourseId || !activeSectionId) return;

    // Convert MM:SS to seconds
    const parts = lectureDuration.split(':');
    const seconds = parts.length === 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 900;

    try {
      await courseService.addLecture(selectedCourseId, activeSectionId, {
        title: lectureTitle.trim(),
        duration: seconds,
      });
      toast.success('🎉 Lecture added successfully!');
      setLectureTitle('');
      setIsLectureModalOpen(false);
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to add lecture.');
    }
  };

  // Handle Delete Lecture
  const handleDeleteLecture = async (sectionId, lectureId) => {
    if (!selectedCourseId || !sectionId || !lectureId) return;
    try {
      await courseService.deleteLecture(selectedCourseId, sectionId, lectureId);
      toast.info('Lecture removed.');
      fetchTargetCourse(selectedCourseId);
    } catch (err) {
      toast.error(err.message || 'Failed to delete lecture.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>CURRICULUM BUILDER</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Manage Course Curriculum
          </h1>
          <p className="text-xs text-gray-500">
            Organize modules, reorder lectures, and upload video lessons for your courses.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          disabled={!selectedCourseId}
          onClick={() => setIsSectionModalOpen(true)}
        >
          Add New Section
        </Button>
      </div>

      {/* Course Selector */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs font-bold text-gray-700 font-heading shrink-0">Select Target Course:</span>
        {isLoadingCourses ? (
          <div className="h-8 w-64 bg-gray-100 animate-pulse rounded-md" />
        ) : courses.length > 0 ? (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-80 text-xs font-semibold bg-[#F8F9FC] border border-gray-200 rounded-[8px] p-2 outline-none cursor-pointer"
          >
            {courses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.title} ({c.status?.toUpperCase()})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-xs text-gray-500 italic">No created courses found. Please create a course first.</p>
        )}
      </Card>

      {/* Modules Builder Accordions */}
      {isLoadingCurriculum ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : !activeCourse ? (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 font-heading">No Course Selected</h3>
          <p className="text-xs text-gray-500">Select a created course from the dropdown above to manage its curriculum.</p>
        </Card>
      ) : (activeCourse.sections || []).length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <Layers className="w-8 h-8 text-indigo-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 font-heading">No Sections Added Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Start building your course syllabus for <strong>"{activeCourse.title}"</strong> by adding your first module section.
            </p>
          </div>
          <Button variant="primary" size="md" leftIcon={Plus} onClick={() => setIsSectionModalOpen(true)}>
            Add First Section
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {(activeCourse.sections || []).map((sec, mIdx) => {
            const sectionId = sec._id || sec.id;
            return (
              <Card key={sectionId || mIdx} className="p-4 space-y-3 border-2 border-indigo-50 shadow-soft">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-sm font-bold font-heading text-gray-900">
                      Module {mIdx + 1}: {sec.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteSection(sectionId, sec.title)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lessons List */}
                <div className="space-y-2 pl-2">
                  {(sec.lectures || []).length > 0 ? (
                    (sec.lectures || []).map((lesson, lIdx) => {
                      const lessonId = lesson._id || lesson.id;
                      const durationStr = typeof lesson.duration === 'number'
                        ? `${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2, '0')}`
                        : lesson.duration || '15:00';
                      return (
                        <div key={lessonId || lIdx} className="flex items-center justify-between p-2.5 bg-[#F8F9FC] rounded-[8px] border border-gray-200 text-xs">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-[#4F46E5]" />
                            <span className="font-semibold text-gray-800">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-gray-400">{durationStr}</span>
                            <button
                              onClick={() => handleDeleteLecture(sectionId, lessonId)}
                              className="text-red-400 hover:text-red-600 cursor-pointer"
                              title="Delete Lecture"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic py-1">No video lectures added to this section yet.</p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Plus}
                  onClick={() => {
                    setActiveSectionId(sectionId);
                    setIsLectureModalOpen(true);
                  }}
                >
                  Add Video Lecture to Section
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add New Section Module"
        size="md"
      >
        <form onSubmit={handleAddSection} className="space-y-4">
          <Input
            label="Section Title"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="e.g. Production Architecture & REST APIs"
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

      {/* Add Lecture Modal */}
      <Modal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        title="Add Video Lecture"
        size="md"
      >
        <form onSubmit={handleAddLecture} className="space-y-4">
          <Input
            label="Lecture Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g. 1. Introduction & Setup Architecture"
            isRequired
          />

          <Input
            label="Video Duration (MM:SS)"
            value={lectureDuration}
            onChange={(e) => setLectureDuration(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Upload Video MP4 File</label>
            <div className="border-2 border-dashed border-gray-200 rounded-[12px] p-6 text-center bg-[#F8F9FC] space-y-1 cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-700">Click to upload video file</p>
              <p className="text-[10px] text-gray-400">MP4 or MOV up to 500MB</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" onClick={() => setIsLectureModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" leftIcon={CheckCircle2}>
              Save Lecture
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageCurriculum;
