import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, IndianRupee, RotateCcw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import courseService from '../../services/courseService';
import { toast } from 'react-toastify';

export const CreateCourse = () => {
  const navigate = useNavigate();

  // Read saved draft from sessionStorage on initial load
  const savedDraft = (() => {
    try {
      const raw = sessionStorage.getItem('learnix_course_draft');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [currentStep, setCurrentStep] = useState(savedDraft?.currentStep || 1);

  // Categories list from API
  const [categoriesList, setCategoriesList] = useState([]);

  // Step 1 Form
  const [title, setTitle] = useState(savedDraft?.title || '');
  const [subtitle, setSubtitle] = useState(savedDraft?.subtitle || '');
  const [category, setCategory] = useState(savedDraft?.category || '');
  const [level, setLevel] = useState(savedDraft?.level || 'intermediate');
  const [description, setDescription] = useState(savedDraft?.description || '');
  const [thumbnail, setThumbnail] = useState(
    savedDraft?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
  );

  // Step 2 Form
  const [price, setPrice] = useState(savedDraft?.price || '1499');
  const [originalPrice, setOriginalPrice] = useState(savedDraft?.originalPrice || '2999');
  const [learningPoints, setLearningPoints] = useState(
    savedDraft?.learningPoints || [
      'Master React 19 Server Actions & Hooks',
      'Design RESTful & GraphQL APIs',
    ]
  );
  const [newPoint, setNewPoint] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await courseService.getCategories();
        setCategoriesList(data || []);
        if (data && data.length > 0 && !category) {
          setCategory(data[0]._id || data[0].id || data[0].name);
        }
      } catch (err) {
        console.error('[CreateCourse API Error]:', err);
      }
    };
    fetchCats();
  }, []);

  // Save form draft to sessionStorage automatically on every input change
  useEffect(() => {
    const draftPayload = {
      currentStep,
      title,
      subtitle,
      category,
      level,
      description,
      thumbnail,
      price,
      originalPrice,
      learningPoints,
    };
    try {
      sessionStorage.setItem('learnix_course_draft', JSON.stringify(draftPayload));
    } catch (e) {
      console.error('[CreateCourse Draft Save Error]:', e);
    }
  }, [currentStep, title, subtitle, category, level, description, thumbnail, price, originalPrice, learningPoints]);

  const handleClearDraft = () => {
    sessionStorage.removeItem('learnix_course_draft');
    setTitle('');
    setSubtitle('');
    setDescription('');
    setPrice('1499');
    setOriginalPrice('2999');
    setLearningPoints([
      'Master React 19 Server Actions & Hooks',
      'Design RESTful & GraphQL APIs',
    ]);
    setCurrentStep(1);
    toast.info('Form cleared.');
  };

  const handleAddPoint = (e) => {
    e.preventDefault();
    if (newPoint.trim()) {
      setLearningPoints([...learningPoints, newPoint.trim()]);
      setNewPoint('');
    }
  };

  const handleRemovePoint = (index) => {
    setLearningPoints(learningPoints.filter((_, idx) => idx !== index));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Course title is required.');
      return;
    }

    setIsPublishing(true);
    try {
      await courseService.createCourse({
        title,
        subtitle: subtitle || 'Comprehensive engineering curriculum.',
        category: category || categoriesList[0]?._id,
        level,
        description: description || subtitle || 'Full-stack course curriculum built for engineers.',
        price: Number(price) || 0,
        originalPrice: Number(originalPrice) || Number(price) || 0,
        learningPoints,
        thumbnail,
        status: 'pending',
      });

      // Clear draft on successful creation
      sessionStorage.removeItem('learnix_course_draft');

      toast.success(`🎉 Course "${title}" submitted for QA review!`);
      navigate('/instructor/my-courses');
    } catch (err) {
      console.error('[CreateCourse Publish Error]:', err);
      toast.error(err.message || 'Failed to submit course.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm" hasDot>FACULTY STUDIO</Badge>
            {savedDraft && (
              <Badge variant="success" size="sm">AUTO-SAVED DRAFT</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Create New Course Curriculum
          </h1>
          <p className="text-xs text-gray-500">
            Draft your course outline, set pricing, and submit for quality assurance review.
          </p>
        </div>

        {savedDraft && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={RotateCcw}
            onClick={handleClearDraft}
          >
            Clear Draft Form
          </Button>
        )}
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-[12px] border border-gray-200 shadow-soft">
        <div className={`flex items-center gap-2 text-xs font-bold ${currentStep === 1 ? 'text-[#4F46E5]' : 'text-emerald-600'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${currentStep === 1 ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-200' : 'bg-emerald-50 text-emerald-600'}`}>
            {currentStep > 1 ? '✓' : '1'}
          </span>
          <span>1. Basic Details</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className={`flex items-center gap-2 text-xs font-bold ${currentStep === 2 ? 'text-[#4F46E5]' : 'text-gray-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${currentStep === 2 ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-200' : 'bg-gray-100 text-gray-400'}`}>
            2
          </span>
          <span>2. Pricing & Goals</span>
        </div>
      </div>

      {currentStep === 1 && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Step 1: Course Information
          </h2>

          <Input
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master Production AI Agent Engineering 2026"
            isRequired
          />

          <Input
            label="Short Subtitle / Tagline"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Build multi-modal agents with LangChain, Next.js, and Redis."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Category Taxonomy</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none"
              >
                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id || cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="Web Development">Web Development</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all">All Levels</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Course Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what this course covers..."
              className="w-full text-xs bg-white border border-gray-200 rounded-[8px] p-3 outline-none focus:border-[#4F46E5]"
            />
          </div>

          {/* Thumbnail Image URL & Preview */}
          <div className="space-y-2">
            <Input
              label="Course Thumbnail Image URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              leftIcon={Upload}
              placeholder="https://images.unsplash.com/..."
            />
            {thumbnail && (
              <div className="flex items-center gap-4 p-3 bg-[#F8F9FC] rounded-[10px] border border-gray-200">
                <img
                  src={thumbnail}
                  alt="Thumbnail preview"
                  className="w-24 h-16 rounded-[8px] object-cover border border-gray-200 shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-gray-900 font-heading block">Thumbnail Live Preview</span>
                  <p className="text-[11px] text-gray-500">This image will appear on the Marketplace catalog and course header.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              variant="primary"
              size="md"
              rightIcon={ArrowRight}
              onClick={() => {
                if (!title) {
                  toast.error('Please enter a course title.');
                  return;
                }
                setCurrentStep(2);
              }}
            >
              Continue to Step 2
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Step 2: Pricing & Learning Goals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Listing Price (₹ INR)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              leftIcon={IndianRupee}
              isRequired
            />
            <Input
              label="Original / List Price (₹ INR)"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              leftIcon={IndianRupee}
            />
          </div>

          {/* Learning Objectives List */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700 font-heading">What Students Will Learn</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a key learning objective..."
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                className="flex-1"
              />
              <Button variant="secondary" size="md" onClick={handleAddPoint}>
                Add Goal
              </Button>
            </div>

            <ul className="space-y-2 pt-2">
              {learningPoints.map((pt, idx) => (
                <li key={idx} className="flex items-center justify-between p-2.5 bg-[#F8F9FC] rounded-[8px] border border-gray-200 text-xs">
                  <span className="text-gray-800 font-medium">✓ {pt}</span>
                  <button
                    onClick={() => handleRemovePoint(idx)}
                    className="text-red-500 hover:text-red-700 text-xs cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button variant="outline" size="md" leftIcon={ArrowLeft} onClick={() => setCurrentStep(1)}>
              Back to Step 1
            </Button>

            <Button
              variant="amber"
              size="md"
              leftIcon={CheckCircle2}
              isLoading={isPublishing}
              onClick={handlePublish}
            >
              Submit Course for QA Review
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};

export default CreateCourse;
