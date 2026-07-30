import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  MessageSquare,
  Bookmark,
  Menu,
  X,
  ArrowLeft,
  Sparkles,
  Plus,
  Loader2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { toast } from 'react-toastify';

const DEFAULT_RESOURCES = [
  { id: 'res_1', title: 'Course Architecture & Code Repository.pdf', size: '2.4 MB' },
  { id: 'res_2', title: 'Cheat Sheet & Best Practices.md', size: '480 KB' },
];

const DEFAULT_NOTES = [
  { id: 'note_1', timestamp: '04:15', text: 'Key takeaway: modular structure helps scaling.', date: 'Yesterday' },
];

export const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'notes' | 'discussion'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);

  // Notes & Resources
  const [notesList, setNotesList] = useState(DEFAULT_NOTES);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    const fetchPlayerData = async () => {
      setIsLoading(true);
      try {
        const [courseData, progressData] = await Promise.all([
          courseService.getCourseById(id).catch(() => null),
          enrollmentService.getCourseProgress(id).catch(() => null),
        ]);

        if (courseData) {
          setCourse(courseData);
          // Set first available lecture as default active lesson
          const firstSection = courseData.curriculum?.[0];
          const firstLesson = firstSection?.lessons?.[0];

          if (firstLesson) {
            setActiveLesson(firstLesson);
          } else {
            setActiveLesson({
              id: 'demo_l1',
              title: '1. Introduction & Overview',
              duration: '10:00',
              videoUrl: '',
            });
          }
        }

        if (progressData && progressData.progress) {
          const completedIds = progressData.progress
            .filter((item) => item.completed)
            .map((item) => item.lectureId.toString());
          setCompletedLessonIds(completedIds);
        }
      } catch (err) {
        console.error('[CoursePlayer Error]:', err);
        toast.error('Failed to load course player.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPlayerData();
  }, [id]);

  const isCurrentCompleted = activeLesson?.id
    ? completedLessonIds.includes(activeLesson.id.toString())
    : false;

  const toggleLessonCompletion = async () => {
    if (!activeLesson?.id || !id) return;
    const lessonIdStr = activeLesson.id.toString();
    const willBeCompleted = !isCurrentCompleted;

    try {
      await enrollmentService.updateProgress(id, lessonIdStr, willBeCompleted);

      if (willBeCompleted) {
        setCompletedLessonIds((prev) => [...prev, lessonIdStr]);
        toast.success('🎉 Lesson marked as completed!');
      } else {
        setCompletedLessonIds((prev) => prev.filter((i) => i !== lessonIdStr));
        toast.info('Lesson marked as incomplete.');
      }
    } catch (err) {
      console.error('[Toggle Progress Error]:', err);
      toast.error('Failed to update progress.');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `note_${Date.now()}`,
      timestamp: '05:30',
      text: newNoteText,
      date: 'Just now',
    };

    setNotesList([newNote, ...notesList]);
    setNewNoteText('');
    toast.success('Note saved!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-10 h-10 text-[#4F46E5] animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading course classroom workspace...</p>
      </div>
    );
  }

  const courseTitle = course?.title || 'Course Classroom';
  const curriculum = course?.curriculum || [
    {
      id: 'sec_1',
      moduleTitle: 'Module 1: Getting Started',
      lessons: [
        { id: 'demo_l1', title: '1. Course Overview & Mindset', duration: '10:00' },
        { id: 'demo_l2', title: '2. Setting Up Environment', duration: '14:20' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/my-learning')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Back to My Learning"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold font-heading text-white truncate max-w-xs sm:max-w-md">
              {courseTitle}
            </h1>
            <p className="text-[10px] text-slate-400 truncate">{activeLesson?.title || 'Select a lesson'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isCurrentCompleted ? 'amber' : 'primary'}
            size="sm"
            leftIcon={CheckCircle2}
            onClick={toggleLessonCompletion}
          >
            {isCurrentCompleted ? 'Completed' : 'Mark as Complete'}
          </Button>

          {/* Mobile Sidebar Toggle Button (<1024px) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Workspace (Video + Sidebar) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Video & Bottom Tabs Panel */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0F172A] p-4 lg:p-6 space-y-6">
          
          {/* Main Video Player Screen Container */}
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 relative group shadow-2xl flex items-center justify-center">
            {activeLesson?.videoUrl ? (
              <video
                controls
                src={activeLesson.videoUrl}
                className="w-full h-full object-contain"
                poster={course?.thumbnail}
              />
            ) : (
              <div className="text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5] text-[#4F46E5] flex items-center justify-center mx-auto animate-pulse">
                  <PlayCircle className="w-10 h-10" />
                </div>
                <h2 className="text-base font-bold font-heading text-white">
                  {activeLesson?.title || 'Select a lesson to start'}
                </h2>
                <p className="text-xs text-slate-400">
                  Duration: {activeLesson?.duration || '15:00'} • HD 1080p Stream
                </p>
              </div>
            )}
            
            {!activeLesson?.videoUrl && (
              /* Scrubber bar mock when static video preview */
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs text-slate-300 opacity-90">
                <span className="font-mono">05:30 / {activeLesson?.duration || '15:00'}</span>
                <div className="flex-1 mx-4 bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-[#4F46E5] h-full w-[45%]" />
                </div>
                <span className="font-mono">1.0x</span>
              </div>
            )}
          </div>

          {/* Bottom Tabs Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Overview & Resources</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>My Notes ({notesList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'discussion' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Q&A Discussion</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Lesson Description</h3>
                  <p className="mt-1 leading-relaxed text-slate-400">
                    {course?.description || 'In this lesson, we cover essential industry concepts and hands-on implementation details.'}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white font-heading">Downloadable Attachments</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEFAULT_RESOURCES.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700 rounded-lg hover:border-indigo-500 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Download className="w-4 h-4 text-[#F59E0B] shrink-0" />
                          <span className="truncate text-slate-200 font-medium">{res.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{res.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Take a note at current timestamp..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 outline-none focus:border-[#4F46E5]"
                  />
                  <Button type="submit" variant="amber" size="sm" leftIcon={Plus}>
                    Save Note
                  </Button>
                </form>

                <div className="space-y-2">
                  {notesList.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[#F59E0B] font-bold">[{note.timestamp}]</span>
                        <span className="text-slate-400">{note.date}</span>
                      </div>
                      <p className="text-slate-200 leading-snug">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Discussion Forum</span>
                    <span className="text-[10px] text-slate-400">Q&A</span>
                  </div>
                  <p className="text-slate-300">Have questions about this lesson? Ask your instructor and peers in the course discussion tab.</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Collapsible Curriculum Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-full lg:w-80 border-l border-slate-800 bg-slate-900' : 'hidden'
          } flex flex-col overflow-y-auto shrink-0 z-20`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold font-heading text-white uppercase tracking-wider">
              Course Content
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {completedLessonIds.length} Completed
            </span>
          </div>

          <div className="flex-1 divide-y divide-slate-800">
            {curriculum.map((module, mIdx) => {
              const isOpen = openModuleIndex === mIdx;
              return (
                <div key={module.id || mIdx} className="bg-slate-900/60">
                  <button
                    onClick={() => setOpenModuleIndex(isOpen ? null : mIdx)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-200 font-heading truncate">
                      {module.moduleTitle}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="bg-slate-950/80 divide-y divide-slate-800/50">
                      {module.lessons?.map((lesson) => {
                        const lessonIdStr = (lesson.id || lesson._id || '').toString();
                        const isActive = activeLesson?.id?.toString() === lessonIdStr;
                        const isDone = completedLessonIds.includes(lessonIdStr);

                        return (
                          <button
                            key={lessonIdStr || lesson.title}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full flex items-center justify-between p-3 text-xs text-left transition-colors cursor-pointer ${
                              isActive ? 'bg-[#4F46E5]/20 text-white font-bold border-l-2 border-[#4F46E5]' : 'text-slate-400 hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{lesson.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

      </div>

    </div>
  );
};

export default CoursePlayer;
