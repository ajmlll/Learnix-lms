import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Edit3, Trash2, BookOpen, MessageSquare, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import reviewService from '../../services/reviewService';
import { toast } from 'react-toastify';

export const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyReviews = async () => {
    setIsLoading(true);
    try {
      const res = await reviewService.getMyReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error('[MyReviews Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || '');
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    setIsSubmitting(true);
    try {
      await reviewService.updateReview(editingReview._id, editRating, editComment);
      toast.success('Review updated successfully!');
      setEditingReview(null);
      fetchMyReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      await reviewService.deleteReview(deletingId);
      toast.info('Review deleted successfully.');
      setDeletingId(null);
      fetchMyReviews();
    } catch (err) {
      toast.error('Failed to delete review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="space-y-1 border-b border-gray-200 pb-4">
        <Badge variant="amber" size="sm">COURSE FEEDBACK</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
          My Course Reviews ({reviews.length})
        </h1>
        <p className="text-xs text-gray-500">
          Manage ratings and detailed reviews you have submitted across enrolled courses.
        </p>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const courseTitle = rev.course?.title || 'Untitled Course';
            const courseThumbnail = rev.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400';
            const courseId = rev.course?._id || rev.course;

            return (
              <Card key={rev._id} className="p-5 space-y-4 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={courseThumbnail}
                      alt={courseTitle}
                      className="w-16 h-12 rounded-lg object-cover border border-gray-200 cursor-pointer"
                      onClick={() => navigate(`/courses/${courseId}`)}
                    />
                    <div>
                      <h3
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="text-sm font-bold font-heading text-gray-900 hover:text-[#4F46E5] cursor-pointer transition-colors"
                      >
                        {courseTitle}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-mono">
                        Posted {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={Edit3}
                      onClick={() => handleOpenEdit(rev)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={Trash2}
                      onClick={() => setDeletingId(rev._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Rating Stars & Comment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold font-mono text-gray-900 ml-1">
                      {rev.rating}.0 / 5.0
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed bg-[#F8F9FC] p-3 rounded-lg border border-gray-100">
                    "{rev.comment || 'No comment text provided.'}"
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-100">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold font-heading text-gray-900">You Haven't Reviewed Any Courses</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Share your learning experience by adding reviews to courses you have completed.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={BookOpen}
            onClick={() => navigate('/student/my-learning')}
          >
            Go to My Courses
          </Button>
        </Card>
      )}

      {/* Edit Review Modal */}
      <Modal
        isOpen={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        title="Edit Your Course Review"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditRating(star)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= editRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold font-mono text-gray-800 ml-2">{editRating} Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Your Review Comment</label>
            <textarea
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="What did you think of the course content, instructor, and exercises?"
              className="w-full text-xs p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4F46E5] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button variant="secondary" size="sm" onClick={() => setEditingReview(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Delete Review"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Are you sure you want to delete this review? This action cannot be undone.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" isLoading={isSubmitting} onClick={handleConfirmDelete}>
              Delete Review
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyReviews;
