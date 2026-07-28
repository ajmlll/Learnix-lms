import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, X, BookOpen, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { COURSES, CATEGORIES } from '../../data/mockData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';

export const CourseListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      // Search match
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category match
      const matchesCategory = selectedCategory === 'all' || course.categoryId === selectedCategory;

      // Level match
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

      // Price match
      const matchesPrice = course.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.studentsEnrolled - a.studentsEnrolled; // 'popular'
    });
  }, [searchQuery, selectedCategory, selectedLevel, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setMaxPrice(150);
    setSortBy('popular');
    setSearchParams({});
  };

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

      {/* Main Grid with Sidebar + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="text-sm font-bold font-heading text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#4F46E5]" />
              Filter Options
            </h3>
            {(selectedCategory !== 'all' || selectedLevel !== 'all' || maxPrice < 150 || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 font-heading uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#4F46E5] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Categories ({COURSES.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#4F46E5] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 font-heading uppercase tracking-wider">
              Difficulty Level
            </label>
            <div className="space-y-1">
              {['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`w-full text-left px-3 py-1.5 rounded-[8px] text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-[#4F46E5] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {lvl === 'all' ? 'Any Level' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 font-heading">
              <span>Max Price</span>
              <span className="font-mono text-[#4F46E5]">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#4F46E5] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>$20</span>
              <span>$150</span>
            </div>
          </div>
        </aside>

        {/* Right Catalog Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Search & Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-[12px] border border-gray-200 shadow-soft">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, topic, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F9FC] border border-gray-200 rounded-[8px] focus:bg-white focus:border-[#4F46E5] outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-[#F8F9FC] border border-gray-200 rounded-[8px] px-3 py-2 outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden p-2 bg-[#F8F9FC] border border-gray-200 rounded-[8px] text-gray-700 cursor-pointer"
                aria-label="Filter"
              >
                <Filter className="w-4 h-4" />
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

          {/* Course Cards Grid (Responsive 3 cols -> 2 -> 1) */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card hoverable key={course.id} className="p-0 overflow-hidden space-y-0 flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        {course.isBestseller && (
                          <Badge variant="amber" size="sm">BESTSELLER</Badge>
                        )}
                        <Badge variant="primary" size="sm">{course.level}</Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{course.category}</span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {course.rating}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold font-heading text-gray-900 leading-snug line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2">
                        {course.subtitle}
                      </p>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="truncate text-gray-700">{course.instructor.name}</span>
                        <span className="ml-auto font-mono text-[11px]">{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-[#F8F9FC] border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold font-mono text-gray-900">${course.price}</span>
                      <span className="text-xs text-gray-400 line-through font-mono">${course.originalPrice}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="p-12 text-center space-y-4">
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
