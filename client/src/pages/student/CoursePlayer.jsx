import React, { useState } from 'react';
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
  ChevronRight,
  Sparkles,
  Plus,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = COURSES.find((c) => c.id === id) || COURSES[0];
  const [activeLesson, setActiveLesson] = useState(
    course.curriculum?.[0]?.lessons?.[0] || {
      id: 'm1l1',
      title: '1. Course Overview & Production Mindset',
      duration: '12:40',
    }
  );

  const [completedLessonIds, setCompletedLessonIds] = useState(['m1l1', 'm1l2']);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'notes' | 'discussion'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);

  // Notes state
  const [notesList, setNotesList] = useState(MOCK_USER_NOTES);
  const [newNoteText, setNewNoteText] = useState('');

  const isCurrentCompleted = completedLessonIds.includes(activeLesson.id);

  const toggleLessonCompletion = () => {
    if (isCurrentCompleted) {
      setCompletedLessonIds((prev) => prev.filter((i) => i !== activeLesson.id));
      toast.info('Lesson marked as incomplete.');
    } else {
      setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
      toast.success('🎉 Lesson marked as completed!');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `note_${Date.now()}`,
      timestamp: '08:45',
      text: newNoteText,
      date: 'Just now',
    };

    setNotesList([newNote, ...notesList]);
    setNewNoteText('');
    toast.success('Note saved at 08:45 timestamp!');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold font-heading text-white truncate max-w-xs sm:max-w-md">
              {course.title}
            </h1>
            <p className="text-[10px] text-slate-400 truncate">{activeLesson.title}</p>
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
          
          {/* Main Video Screen Container */}
          <div className="w-full aspect-video bg-black rounded-[12px] overflow-hidden border border-slate-800 relative group shadow-2xl flex items-center justify-center">
            <div className="text-center space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5] text-[#4F46E5] flex items-center justify-center mx-auto animate-pulse">
                <PlayCircle className="w-10 h-10" />
              </div>
              <h2 className="text-base font-bold font-heading text-white">{activeLesson.title}</h2>
              <p className="text-xs text-slate-400">Duration: {activeLesson.duration || '15:00'} • HD 1080p</p>
            </div>
            
            {/* Scrubber bar mock */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs text-slate-300 opacity-90">
              <span className="font-mono">08:45 / {activeLesson.duration || '15:00'}</span>
              <div className="flex-1 mx-4 bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-[#4F46E5] h-full w-[60%]" />
              </div>
              <span className="font-mono">1.0x</span>
            </div>
          </div>

          {/* Bottom Tabs Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-[12px] p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Overview & Resources</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>My Notes ({notesList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] flex items-center gap-1.5 transition-colors cursor-pointer ${
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
                    In this lesson, we break down production architecture standards, concurrency controls, and state management techniques. Follow along with the downloadable code repository below.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white font-heading">Downloadable Attachments</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MOCK_LESSON_RESOURCES.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700 rounded-[8px] hover:border-indigo-500 transition-colors"
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
                    placeholder="Take a note at timestamp 08:45..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-[8px] px-3 py-2 outline-none focus:border-[#4F46E5]"
                  />
                  <Button type="submit" variant="amber" size="sm" leftIcon={Plus}>
                    Save Note
                  </Button>
                </form>

                <div className="space-y-2">
                  {notesList.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-800/60 rounded-[8px] border border-slate-700 space-y-1">
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
                <div className="p-3 bg-slate-800/60 rounded-[8px] border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Alex Morgan (Student)</span>
                    <span className="text-[10px] text-slate-400">1 day ago</span>
                  </div>
                  <p className="text-slate-300">Should we use optimistic updates when mutating state in React 19?</p>
                  <div className="pl-3 border-l-2 border-[#4F46E5] mt-2 text-indigo-300 space-y-0.5">
                    <span className="font-bold text-xs">Dr. Elena Rostova (Instructor):</span>
                    <p className="text-slate-300">Yes! Combining `useOptimistic` with server actions provides instant UI feedback.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Collapsible Curriculum Sidebar (<1024px converted to drawer) */}
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
              {completedLessonIds.length} / {course.lecturesCount || 10} Done
            </span>
          </div>

          <div className="flex-1 divide-y divide-slate-800">
            {course.curriculum?.map((module, mIdx) => {
              const isOpen = openModuleIndex === mIdx;
              return (
                <div key={mIdx} className="bg-slate-900/60">
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
                        const isActive = activeLesson.id === lesson.id;
                        const isDone = completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
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
