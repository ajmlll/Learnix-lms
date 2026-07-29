import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, IndianRupee, RotateCcw, Gift, CreditCard, Sparkles } from 'lucide-react';
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
  const [isFree, setIsFree] = useState(savedDraft?.isFree || false);
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
      isFree,
      price,
      originalPrice,
      learningPoints,
    };
    try {
      sessionStorage.setItem('learnix_course_draft', JSON.stringify(draftPayload));
    } catch (err) {
      console.warn('[Draft Save Warning]:', err);
    }
  }, [currentStep, title, subtitle, category, level, description, thumbnail, isFree, price, originalPrice, learningPoints]);

  const handleClearDraft = () => {
    sessionStorage.removeItem('learnix_course_draft');
    setTitle('');
    setSubtitle('');
    setDescription('');
    setPrice('1499');
    setOriginalPrice('2999');
    setIsFree(false);
    setThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600');
    setLearningPoints(['Master React 19 Server Actions & Hooks', 'Design RESTful & GraphQL APIs']);
    setCurrentStep(1);
    toast.info('Draft cleared. Form reset.');
  };

  const handleAddPoint = () => {
    if (!newPoint.trim()) return;
    setLearningPoints([...learningPoints, newPoint.trim()]);
    setNewPoint('');
  };

  const handleRemovePoint = (index) => {
    setLearningPoints(learningPoints.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please enter a course title.');
      return;
    }

    const finalPrice = isFree ? 0 : (Number(price) || 0);
    const finalOriginalPrice = isFree ? 0 : (Number(originalPrice) || finalPrice || 0);

    setIsPublishing(true);
    try {
      await courseService.createCourse({
        title,
        subtitle: subtitle || 'Comprehensive engineering curriculum.',
        category: category || categoriesList[0]?._id,
        level,
        description: description || subtitle || 'Full-stack course curriculum built for engineers.',
        price: finalPrice,
        originalPrice: finalOriginalPrice,
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">FACULTY STUDIO</Badge>
            {savedDraft && <Badge variant="amber" size="sm">Draft Restored</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight mt-1">
            Create New Course
          </h1>
          <p className="text-xs text-gray-500">
            Publish your curriculum for thousands of developers on Learnix LMS.
          </p>
        </div>

        {savedDraft && (
          <Button variant="ghost" size="sm" leftIcon={RotateCcw} onClick={handleClearDraft}>
            Reset Form
          </Button>
        )}
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-center gap-4 text-xs font-bold font-heading">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          currentStep === 1
            ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
            : 'bg-white text-gray-600 border-gray-200'
        }`}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
          <span>1. Basic Info & Thumbnail</span>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          currentStep === 2
            ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
            : 'bg-white text-gray-600 border-gray-200'
        }`}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
          <span>2. Pricing & Objectives</span>
        </div>
      </div>

      {/* STEP 1: Basic Info & Thumbnail */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-6 shadow-soft bg-white">
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
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none focus:border-[#4F46E5]"
              >
                {categoriesList.length > 0 ? (
                  categoriesList.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id || cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">General Engineering</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none focus:border-[#4F46E5]"
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

      {/* STEP 2: Pricing & Learning Goals */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-6 shadow-soft bg-white">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Step 2: Pricing & Learning Objectives
          </h2>

          {/* Pricing Model Selector: Free vs Paid */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700 font-heading">
              Select Pricing Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option A: Paid Course */}
              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`p-4 rounded-[12px] border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  !isFree
                    ? 'bg-indigo-50/60 border-[#4F46E5] ring-2 ring-[#4F46E5]/20'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${!isFree ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-gray-900 font-heading block">Paid Course (₹ INR)</span>
                  <p className="text-[11px] text-gray-500">Set a custom listing price for student enrollments.</p>
                </div>
              </button>

              {/* Option B: Free Course */}
              <button
                type="button"
                onClick={() => {
                  setIsFree(true);
                  setPrice('0');
                  setOriginalPrice('0');
                }}
                className={`p-4 rounded-[12px] border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isFree
                    ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isFree ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Gift className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-gray-900 font-heading block flex items-center gap-1.5">
                    Free Course (₹0)
                    <Badge variant="success" size="sm">FREE</Badge>
                  </span>
                  <p className="text-[11px] text-gray-500">100% free access. Students enroll instantly with 1-click.</p>
                </div>
              </button>

            </div>
          </div>

          {/* Pricing Inputs or Free Course Notice */}
          {!isFree ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F8F9FC] rounded-[12px] border border-gray-200">
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
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[12px] flex items-center gap-3 text-xs text-emerald-800 font-medium">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold font-heading block">Listed as a 100% Free Course</span>
                <p className="text-[11px] text-emerald-700">This course skips cart & checkout entirely. Students get instant enrollment upon clicking "Enroll now — Free".</p>
              </div>
            </div>
          )}

          {/* Learning Objectives List */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700 font-heading">What Students Will Learn</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a key learning objective..."
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                className="flex-1 text-xs"
              />
              <Button variant="secondary" size="md" onClick={handleAddPoint}>
                Add Goal
              </Button>
            </div>

            <ul className="space-y-2 pt-2">
              {learningPoints.map((pt, idx) => (
                <li key={idx} className="flex items-center justify-between p-2.5 bg-[#F8F9FC] rounded-[8px] border border-gray-200 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                  <button
                    onClick={() => handleRemovePoint(idx)}
                    className="text-gray-400 hover:text-red-600 text-xs font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Form Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="md"
              leftIcon={ArrowLeft}
              onClick={() => setCurrentStep(1)}
            >
              Back to Step 1
            </Button>

            <Button
              variant="primary"
              size="lg"
              isLoading={isPublishing}
              rightIcon={CheckCircle2}
              onClick={handlePublish}
            >
              Submit Course for QA
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};

export default CreateCourse;
