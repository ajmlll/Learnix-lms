import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  X,
  BookOpen,
  SlidersHorizontal,
  Heart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import courseService from '../../services/courseService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/Skeleton';
import { toast } from 'react-toastify';
import { isInWishlist, toggleWishlist } from '../../utils/wishlist';

export const CourseListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // API State
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [wishlistTick, setWishlistTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setWishlistTick((prev) => prev + 1);
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseRes, categoryRes] = await Promise.all([
          courseService.getCourses({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            level: selectedLevel !== 'all' ? selectedLevel : undefined,
            search: searchQuery || undefined,
          }),
          courseService.getCategories(),
        ]);
        setCourses(courseRes.courses || []);
        setCategories(categoryRes || []);
      } catch (err) {
        console.error('[CourseListing API Error]:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedCategory, selectedLevel]);

  // Reset to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLevel, maxPrice, sortBy]);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesPrice = (course.price || 0) <= maxPrice;
        return matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0);
      });
  }, [courses, maxPrice, sortBy]);

  // Paginated subset of filtered courses
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setMaxPrice(50000);
    setSortBy('popular');
    setCurrentPage(1);
    setSearchParams({});
  };

  const renderFilterSidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="text-sm font-bold font-heading text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#4F46E5]" />
          Filter Options
        </h3>
        {(selectedCategory !== 'all' || selectedLevel !== 'all' || maxPrice < 50000 || searchQuery) && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-red-500 hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 font-heading uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Categories ({courses.length})
          </button>
          {categories.map((cat) => {
            const catId = cat.id || cat._id;
            return (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === catId
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({cat.count || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level Filter */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-700 font-heading uppercase tracking-wider block">
          Difficulty Level
        </label>
        <div className="space-y-1">
          {['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lvl === 'all' ? 'Any Level' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 font-heading">
          <span>Max Price</span>
          <span className="font-mono text-[#4F46E5]">₹{maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="0"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#4F46E5] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>₹0</span>
          <span>₹50,000</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="space-y-2">
        <Badge variant="primary" size="sm">EXPLORE CURRICULUM</Badge>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Browse All Courses
        </h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Discover top-rated engineering courses taught by industry leads. Filter by category, skill level, and price.
        </p>
      </div>

      {/* Main Grid with Fixed Sticky Sidebar + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sticky Filter Sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start bg-white p-5 rounded-xl border border-gray-200 shadow-soft max-h-[calc(100vh-7rem)] overflow-y-auto">
          {renderFilterSidebarContent()}
        </aside>

        {/* Mobile Filter Drawer Modal */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-80 h-full bg-white p-6 overflow-y-auto space-y-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#4F46E5]" />
                    Filter Catalog
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {renderFilterSidebarContent()}

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Catalog Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Search & Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-soft">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, topic, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F9FC] border border-gray-200 rounded-lg focus:bg-white focus:border-[#4F46E5] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-[#F8F9FC] border border-gray-200 rounded-lg px-3 py-2 outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden p-2 bg-[#F8F9FC] border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                aria-label="Filter"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory !== 'all' || selectedLevel !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <Badge variant="primary" size="sm" className="gap-1">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </Badge>
              )}
              {selectedLevel !== 'all' && (
                <Badge variant="amber" size="sm" className="gap-1">
                  Level: {selectedLevel}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLevel('all')} />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="neutral" size="sm" className="gap-1">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </Badge>
              )}
            </div>
          )}

          {/* Course Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : paginatedCourses.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => {
                  const courseId = course.id || course._id;
                  const wishlisted = isInWishlist(courseId);
                  const instructorName = typeof course.instructor === 'object'
                    ? (course.instructor?.name || 'Faculty Member')
                    : (course.instructor || 'Faculty Member');
                  const categoryName = typeof course.category === 'object'
                    ? (course.category?.name || 'General')
                    : (course.category || 'General');

                  return (
                    <Card
                      hoverable
                      key={courseId}
                      className="p-0 overflow-hidden space-y-0 flex flex-col justify-between shadow-soft"
                    >
                      <div>
                        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                          <img
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            {course.isBestseller && (
                              <Badge variant="amber" size="sm">BESTSELLER</Badge>
                            )}
                            <Badge variant="primary" size="sm">{course.level || 'All Levels'}</Badge>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const added = toggleWishlist(course);
                              toast.info(added ? '❤️ Saved to Wishlist!' : 'Removed from Wishlist');
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-xs rounded-full hover:bg-white transition-all text-gray-700 shadow-xs cursor-pointer"
                            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                          </button>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{categoryName}</span>
                            <span className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {course.rating || course.averageRating || 5.0}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold font-heading text-gray-900 leading-snug line-clamp-2">
                            {course.title}
                          </h3>

                          <p className="text-xs text-gray-500 line-clamp-2">
                            {course.subtitle || course.description}
                          </p>

                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                            <img
                              src={typeof course.instructor === 'object' ? (course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250') : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                              alt={instructorName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="truncate">{instructorName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#F8F9FC] border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className="text-lg font-bold text-gray-900">₹{course.price || 0}</span>
                          {course.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{course.originalPrice}</span>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/courses/${courseId}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Functional Pagination Controls */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <p className="text-xs text-gray-500 font-mono">
                  Showing <strong className="text-gray-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                  <strong className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredCourses.length)}</strong> of{' '}
                  <strong className="text-gray-900 font-bold">{filteredCourses.length}</strong> courses
                </p>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    leftIcon={ChevronLeft}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#4F46E5] text-white shadow-xs'
                            : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    rightIcon={ChevronRight}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <Card className="p-12 text-center space-y-4 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-[#4F46E5] mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-gray-900">No Courses Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn't find any courses matching your selected filters or search terms.
              </p>
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
};

export default CourseListing;
