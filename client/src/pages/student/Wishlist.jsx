import React, { useState, useEffect } from 'react';
import { Bookmark, ShoppingBag, Star, Trash2, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useCart } from '../../context/CartContext';
import enrollmentService from '../../services/enrollmentService';
import { toast } from 'react-toastify';
import { getWishlist, removeFromWishlist } from '../../utils/wishlist';

export const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart, isEnrolled, refetchEnrollments } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    const updateWishlist = () => {
      setWishlistItems(getWishlist());
      setIsLoading(false);
    };
    updateWishlist();

    window.addEventListener('wishlistUpdated', updateWishlist);
    window.addEventListener('storage', updateWishlist);
    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlist);
      window.removeEventListener('storage', updateWishlist);
    };
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id);
    toast.info('Item removed from wishlist.');
  };

  const handleFreeEnroll = async (courseId) => {
    setActionLoadingId(courseId);
    try {
      await enrollmentService.enroll(courseId);
      await refetchEnrollments();
      toast.success('🎉 Successfully enrolled in free course!');
      navigate(`/student/my-learning`);
    } catch (err) {
      console.error('[Wishlist Free Enroll Error]:', err);
      toast.error(err.message || 'Failed to enroll in course.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddToCart = (course) => {
    addToCart(course);
    toast.success(`🛒 "${course.title}" added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="space-y-1">
          <div className="h-5 w-28 skeleton-shimmer rounded-md" />
          <div className="h-9 w-44 skeleton-shimmer rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="primary" size="sm">SAVED ITEMS</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          My Wishlist ({wishlistItems.length})
        </h1>
        <p className="text-xs text-gray-500">
          Courses you've bookmarked to enroll in later.
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((course) => {
            const courseId = (course._id || course.id)?.toString();
            const enrolled = isEnrolled(courseId);
            const inCart = isInCart(courseId);
            const isFree = !course.price || course.price === 0;

            return (
              <Card hoverable key={courseId} className="p-0 overflow-hidden flex flex-col justify-between space-y-0">
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemove(courseId)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-white transition-colors cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{typeof course.category === 'object' ? course.category?.name : (course.category || 'General')}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {course.rating || 5.0}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-gray-900 leading-snug">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <span>{typeof course.instructor === 'object' ? course.instructor?.name : (course.instructor || 'Faculty')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#F8F9FC] border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-lg font-bold text-gray-900">
                      {isFree ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>

                  {enrolled ? (
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={Play}
                      onClick={() => navigate(`/student/my-learning`)}
                    >
                      Continue Learning
                    </Button>
                  ) : isFree ? (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={actionLoadingId === courseId}
                      onClick={() => handleFreeEnroll(courseId)}
                    >
                      Enroll now — Free
                    </Button>
                  ) : inCart ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={CheckCircle2}
                      onClick={() => navigate('/student/cart')}
                    >
                      In cart ✓
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={ShoppingBag}
                      onClick={() => handleAddToCart(course)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7 text-[#4F46E5]" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-gray-900 font-heading">Your Wishlist is Empty</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Browse our course catalog and click "Add to Wishlist" to save courses you want to take later.
            </p>
          </div>
          <Button variant="primary" size="md" leftIcon={ShoppingBag} onClick={() => navigate('/courses')}>
            Browse Courses
          </Button>
        </Card>
      )}

    </div>
  );
};

export default Wishlist;
