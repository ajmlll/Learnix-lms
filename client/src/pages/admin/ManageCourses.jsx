import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import adminService from '../../services/adminService';
import courseService from '../../services/courseService';
import { toast } from 'react-toastify';

export const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewCourse, setReviewCourse] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'pending' || activeTab === 'pending_review') {
        const res = await adminService.getPendingCourses();
        setCourses(res.data || res.courses || []);
      } else {
        const res = await adminService.getAllCourses({ status: activeTab !== 'all' ? activeTab : undefined });
        setCourses(res.data || res.courses || []);
      }
    } catch (err) {
      console.error('[ManageCourses API Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [activeTab]);

  const filteredCourses = courses;

  const handleOpenReview = (course) => {
    setReviewCourse(course);
    setIsReviewModalOpen(true);
  };

  const handleApproveCourse = async () => {
    if (!reviewCourse) return;
    try {
      await adminService.approveCourse(reviewCourse._id || reviewCourse.id);
      setIsReviewModalOpen(false);
      toast.success(`Course "${reviewCourse.title}" approved and published!`);
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Failed to approve course');
    }
  };

  const handleRejectCourse = async () => {
    if (!reviewCourse) return;
    try {
      await adminService.rejectCourse(reviewCourse._id || reviewCourse.id, rejectionNotes);
      setIsReviewModalOpen(false);
      setRejectionNotes('');
      toast.warn(`Course "${reviewCourse.title}" rejected.`);
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Failed to reject course');
    }
  };

  const handleDeleteCourse = async (id, title) => {
    try {
      await courseService.deleteCourse(id);
      toast.info(`Course "${title}" deleted.`);
      fetchCourses();
    } catch (err) {
      toast.error(err.message || 'Failed to delete course');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'published') return <Badge variant="success" size="sm">PUBLISHED</Badge>;
    if (status === 'pending' || status === 'pending_review') return <Badge variant="amber" size="sm" hasDot>NEEDS REVIEW</Badge>;
    return <Badge variant="neutral" size="sm">DRAFT</Badge>;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="dark" size="sm" hasDot>QUALITY ASSURANCE</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Course Approval & Moderation ({courses.length})
          </h1>
          <p className="text-xs text-gray-500">
            Review faculty curriculum submissions, audit video quality, and manage catalog publication.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Catalog Courses' },
          { id: 'pending_review', label: 'Pending Review', count: courses.filter((c) => c.status === 'pending' || c.status === 'pending_review').length },
          { id: 'published', label: 'Published' },
          { id: 'draft', label: 'Drafts' },
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
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Courses Table / Stacked Cards View */}
      <Card className="p-0 overflow-hidden shadow-soft">
        {isLoading ? (
          <TableRowSkeleton rows={4} />
        ) : filteredCourses.length === 0 ? (
          <div className="p-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 font-heading">No Courses in This Filter</h3>
            <p className="text-xs text-gray-500">Switch to "All Catalog Courses" to see all submissions.</p>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('all')}>Clear Filter</Button>
          </div>
        ) : (
          <>
            {/* Desktop View (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#F8F9FC] border-b border-gray-200 text-gray-700 font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Course Info</th>
                    <th className="p-4">Instructor</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCourses.map((c) => {
                    const courseId = c._id || c.id;
                    const instructorName = c.instructor?.name || (typeof c.instructor === 'string' ? c.instructor : 'Faculty Member');
                    const catName = c.category?.name || c.category || 'General';
                    return (
                      <tr key={courseId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'} alt={c.title} className="w-14 h-10 rounded-[6px] object-cover shrink-0" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-xs font-heading">{c.title}</h4>
                              <p className="text-[11px] text-gray-400">Created {new Date(c.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-800">{instructorName}</td>
                        <td className="p-4">{catName}</td>
                        <td className="p-4">{getStatusBadge(c.status)}</td>
                        <td className="p-4 font-mono font-bold text-gray-900">₹{c.price || 0}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {c.status === 'pending' || c.status === 'pending_review' ? (
                              <Button variant="amber" size="sm" onClick={() => handleOpenReview(c)}>
                                Review Submission
                              </Button>
                            ) : (
                              <Button variant="secondary" size="sm" onClick={() => handleOpenReview(c)}>
                                View Details
                              </Button>
                            )}
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

            {/* Mobile View (<768px) Stacked Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredCourses.map((c) => {
                const courseId = c._id || c.id;
                const instructorName = c.instructor?.name || (typeof c.instructor === 'string' ? c.instructor : 'Faculty Member');
                const catName = c.category?.name || c.category || 'General';
                return (
                  <div key={courseId} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'} alt={c.title} className="w-12 h-12 rounded-[6px] object-cover shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs font-heading">{c.title}</h4>
                          <p className="text-[11px] text-gray-400">By {instructorName}</p>
                        </div>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-mono">
                      <span>Category: {catName}</span>
                      <span className="font-bold text-gray-900">${c.price || 0}</span>
                    </div>

                    <Button variant="primary" size="sm" fullWidth onClick={() => handleOpenReview(c)}>
                      Review Course Submission
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Side-by-Side Approve / Reject Review Modal */}
      {reviewCourse && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={`Curriculum Review: ${reviewCourse.title}`}
          size="xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Left Side: Course Details & Syllabus */}
            <div className="space-y-4 pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0">
              <img src={reviewCourse.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'} alt={reviewCourse.title} className="w-full h-44 rounded-[10px] object-cover" />
              <div>
                <h3 className="text-base font-bold font-heading text-gray-900">{reviewCourse.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Instructor: <strong className="text-gray-800">{reviewCourse.instructor?.name || (typeof reviewCourse.instructor === 'string' ? reviewCourse.instructor : 'Faculty')}</strong></p>
              </div>

              <div className="bg-[#F8F9FC] p-3 rounded-[8px] border border-gray-200 text-xs space-y-1">
                <span className="font-bold text-gray-700 font-heading block">Course Description:</span>
                <p className="text-gray-600 leading-relaxed italic">"{reviewCourse.description || reviewCourse.subtitle || 'No description provided.'}"</p>
              </div>
            </div>

            {/* Right Side: Approval Decision Form */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Badge variant="amber" size="sm">SUPERADMIN DECISION</Badge>
                <h4 className="text-sm font-bold font-heading text-gray-900">Quality Moderation Feedback</h4>
                
                <textarea
                  rows={4}
                  placeholder="Add feedback notes for the instructor (e.g., requested revision details if rejecting)..."
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-[8px] p-3 text-xs outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={CheckCircle2}
                  onClick={handleApproveCourse}
                >
                  Approve & Publish to Marketplace
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  fullWidth
                  leftIcon={XCircle}
                  onClick={handleRejectCourse}
                >
                  Reject & Request Revisions
                </Button>
              </div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default ManageCourses;
