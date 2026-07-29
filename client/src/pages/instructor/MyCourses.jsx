import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, BookOpen, Layers, HelpCircle } from 'lucide-react';
import courseService from '../../services/courseService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { toast } from 'react-toastify';

export const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInstructorCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getMyCourses();
      setCourses(data || []);
    } catch (err) {
      console.error('[Instructor MyCourses API Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const filteredCourses =
    activeTab === 'all'
      ? courses
      : courses.filter((c) => c.status === activeTab);

  const handleDeleteCourse = async (id, title) => {
    try {
      await courseService.deleteCourse(id);
      toast.info(`Course "${title}" deleted.`);
      fetchInstructorCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'published') return <Badge variant="success" size="sm">PUBLISHED</Badge>;
    if (status === 'pending' || status === 'pending_review') return <Badge variant="amber" size="sm">IN REVIEW</Badge>;
    return <Badge variant="neutral" size="sm">DRAFT</Badge>;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>FACULTY CURRICULUM</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            My Created Courses ({courses.length})
          </h1>
          <p className="text-xs text-gray-500">
            Manage your published courses, draft new modules, or review pending submissions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => navigate('/instructor/create-course')}
        >
          Create Course
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Courses', count: courses.length },
          { id: 'published', label: 'Published', count: courses.filter((c) => c.status === 'published').length },
          { id: 'pending', label: 'In Review', count: courses.filter((c) => c.status === 'pending' || c.status === 'pending_review').length },
          { id: 'draft', label: 'Drafts', count: courses.filter((c) => c.status === 'draft').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#4F46E5] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Responsive Table / Stacked Cards View */}
      <Card className="p-0 overflow-hidden shadow-soft">
        {isLoading ? (
          <TableRowSkeleton rows={4} />
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-900 font-heading">No Courses Found</h3>
            <p className="text-xs text-gray-500">You don't have any courses matching this status filter.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#F8F9FC] border-b border-gray-200 text-gray-700 font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Course Info</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Students</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCourses.map((c) => {
                    const courseId = c._id || c.id;
                    const catName = c.category?.name || c.category || 'General';
                    const studentCount = c.enrolledCount || c.studentsEnrolled || 0;
                    return (
                      <tr key={courseId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'} alt={c.title} className="w-14 h-10 rounded-[6px] object-cover shrink-0" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-xs font-heading">{c.title}</h4>
                              <p className="text-[11px] text-gray-400">{catName} • Level: {c.level || 'All'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(c.status)}</td>
                        <td className="p-4 font-mono font-bold text-gray-900">{studentCount.toLocaleString()}</td>
                        <td className="p-4 font-mono font-bold text-gray-900">${c.price || 0}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate('/instructor/manage-curriculum')}
                              className="p-1.5 text-gray-600 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                              title="Manage Curriculum"
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(courseId, c.title)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View (<768px) */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredCourses.map((c) => {
                const courseId = c._id || c.id;
                const catName = c.category?.name || c.category || 'General';
                const studentCount = c.enrolledCount || c.studentsEnrolled || 0;
                return (
                  <div key={courseId} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'} alt={c.title} className="w-12 h-12 rounded-[6px] object-cover shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs font-heading">{c.title}</h4>
                          <p className="text-[11px] text-gray-400">{catName}</p>
                        </div>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono py-2 bg-[#F8F9FC] rounded-[8px] border border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-sans block">Students</span>
                        <strong className="text-gray-900">{studentCount}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-sans block">Price</span>
                        <strong className="text-gray-900">${c.price || 0}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button variant="secondary" size="sm" leftIcon={Layers} onClick={() => navigate('/instructor/manage-curriculum')}>
                        Curriculum
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

    </div>
  );
};

export default MyCourses;
