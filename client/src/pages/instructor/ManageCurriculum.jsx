import React, { useState } from 'react';
import { Layers, Plus, Trash2, ArrowUp, ArrowDown, Video, Upload, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';

export const ManageCurriculum = () => {
  const [selectedCourse, setSelectedCourse] = useState('mern-bootcamp-2026');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeModuleIdx, setActiveModuleIdx] = useState(null);

  // Form inside modal
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('15:00');

  const [modules, setModules] = useState([
    {
      title: 'Module 1: React 19 Fundamentals & Modern Hooks',
      lessons: [
        { id: 'l1', title: '1. Course Overview & Production Mindset', duration: '12:40' },
        { id: 'l2', title: '2. React 19 Component Architecture', duration: '24:15' },
      ],
    },
    {
      title: 'Module 2: Node.js & Express RESTful API Engineering',
      lessons: [
        { id: 'l3', title: '3. Express Server Setup & Middleware Pipeline', duration: '22:15' },
      ],
    },
  ]);

  const handleMoveModule = (index, direction) => {
    const updated = [...modules];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      setModules(updated);
      toast.info('Module reordered.');
    }
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!lectureTitle.trim()) return;

    const updated = [...modules];
    updated[activeModuleIdx || 0].lessons.push({
      id: `l_${Date.now()}`,
      title: lectureTitle,
      duration: lectureDuration,
    });

    setModules(updated);
    setLectureTitle('');
    setIsAddModalOpen(false);
    toast.success('🎉 New lecture added to section!');
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
            Organize modules, reorder lectures, and upload video lessons.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => {
            const updated = [...modules, { title: `Module ${modules.length + 1}: New Section`, lessons: [] }];
            setModules(updated);
            toast.success('New section added!');
          }}
        >
          Add New Section
        </Button>
      </div>

      {/* Course Selector */}
      <Card className="p-4 flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-gray-700 font-heading shrink-0">Select Target Course:</span>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full sm:w-80 text-xs font-semibold bg-[#F8F9FC] border border-gray-200 rounded-[8px] p-2 outline-none cursor-pointer"
        >
          <option value="mern-bootcamp-2026">MERN Stack Bootcamp 2026</option>
          <option value="ai-agent-engineering">AI Agent Engineering</option>
        </select>
      </Card>

      {/* Modules Builder Accordions */}
      <div className="space-y-4">
        {modules.map((mod, mIdx) => (
          <Card key={mIdx} className="p-4 space-y-3 border-2 border-indigo-50 shadow-soft">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="text-sm font-bold font-heading text-gray-900">{mod.title}</h3>
              </div>

              {/* Reorder & Delete controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveModule(mIdx, 'up')}
                  disabled={mIdx === 0}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveModule(mIdx, 'down')}
                  disabled={mIdx === modules.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setModules(modules.filter((_, i) => i !== mIdx));
                    toast.info('Section removed.');
                  }}
                  className="p-1 text-red-400 hover:text-red-600 cursor-pointer ml-2"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-2 pl-2">
              {mod.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-2.5 bg-[#F8F9FC] rounded-[8px] border border-gray-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#4F46E5]" />
                    <span className="font-semibold text-gray-800">{lesson.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-400">{lesson.duration}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={() => {
                setActiveModuleIdx(mIdx);
                setIsAddModalOpen(true);
              }}
            >
              Add Video Lecture to Section
            </Button>
          </Card>
        ))}
      </div>

      {/* Add Lecture Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Video Lecture"
        size="md"
      >
        <form onSubmit={handleAddLesson} className="space-y-4">
          <Input
            label="Lecture Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="e.g. 4. Advanced Custom Hooks Architecture"
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
            <Button variant="secondary" size="md" onClick={() => setIsAddModalOpen(false)}>
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
