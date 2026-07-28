import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Award, LayoutGrid, List, PlayCircle, CheckCircle2 } from 'lucide-react';
import { STUDENT_COURSES } from '../../data/mockData';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/Skeleton';

export const MyCourses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filteredCourses = STUDENT_COURSES.filter((sc) => {
    const matchesTab = activeTab === 'all' || sc.status === activeTab;
    const matchesSearch =
      sc.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.course.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="space-y-1">
          <div className="h-5 w-36 skeleton-shimmer rounded-md" />
          <div className="h-9 w-56 skeleton-shimmer rounded-md" />
        </div>
        <div className="h-16 w-full skeleton-shimmer rounded-[12px]" />
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
        <Badge variant="primary" size="sm">STUDENT LEARNING PORTAL</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          My Enrolled Courses
        </h1>
        <p className="text-xs text-gray-500">
          Track your course completion progress, resume lessons, or download earned certificates.
        </p>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-[12px] border border-gray-200 shadow-soft">
        
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Courses', count: STUDENT_COURSES.length },
            { id: 'in-progress', label: 'In Progress', count: STUDENT_COURSES.filter((c) => c.status === 'in-progress').length },
            { id: 'completed', label: 'Completed', count: STUDENT_COURSES.filter((c) => c.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search & Grid/List view toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search my courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F8F9FC] border border-gray-200 rounded-[8px] focus:bg-white focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div className="flex items-center border border-gray-200 rounded-[8px] overflow-hidden bg-[#F8F9FC]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Courses Display */}
      {filteredCourses.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCourses.map((sc) => (
            <Card hoverable key={sc.courseId} className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={sc.course.thumbnail}
                    alt={sc.course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={sc.status === 'completed' ? 'success' : 'primary'} size="sm">
                      {sc.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>{sc.course.category}</span>
                    <span className="font-bold text-[#4F46E5]">{sc.progress}% Complete</span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-gray-900 leading-snug line-clamp-2">
                    {sc.course.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    Instructor: <strong className="text-gray-700">{sc.course.instructor.name}</strong>
                  </p>

                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        sc.status === 'completed' ? 'bg-emerald-500' : 'bg-[#4F46E5]'
                      }`}
                      style={{ width: `${sc.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#F8F9FC] border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono">{sc.lastAccessed}</span>
                {sc.status === 'completed' ? (
                  <Button
                    variant="amber"
                    size="sm"
                    leftIcon={Award}
                    onClick={() => navigate('/verify-certificate')}
                  >
                    View Certificate
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={PlayCircle}
                    onClick={() => navigate(`/student/course/${sc.courseId}/play`)}
                  >
                    Resume Learning
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-gray-900 font-heading">No Courses Found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              You don't have any enrolled courses matching that filter. Browse the catalog to get started.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => { setActiveTab('all'); setSearchQuery(''); }}>
              Clear Filter
            </Button>
            <Button variant="primary" size="sm" leftIcon={BookOpen} onClick={() => navigate('/courses')}>
              Browse Catalog
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};

export default MyCourses;
