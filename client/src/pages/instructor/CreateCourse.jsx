import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, DollarSign, BookOpen, Layers } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Intermediate');
  const [description, setDescription] = useState('');

  // Step 2 Form
  const [price, setPrice] = useState('89.99');
  const [originalPrice, setOriginalPrice] = useState('149.99');
  const [learningPoints, setLearningPoints] = useState([
    'Master React 19 Server Actions & Hooks',
    'Design RESTful & GraphQL APIs',
  ]);
  const [newPoint, setNewPoint] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAddPoint = (e) => {
    e.preventDefault();
    if (newPoint.trim()) {
      setLearningPoints([...learningPoints, newPoint.trim()]);
      setNewPoint('');
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsPublishing(false);
    toast.success(`🎉 Course "${title || 'New Course'}" created successfully!`);
    navigate('/instructor/my-courses');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="space-y-2">
        <Badge variant="amber" size="sm">COURSE CREATION WIZARD</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Create New Course
        </h1>
        <p className="text-xs text-gray-500">
          Fill out course details, pricing, and learning objectives to submit your curriculum.
        </p>
      </div>

      {/* Multi-Step Wizard Progress Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 text-xs font-semibold">
        <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#4F46E5]' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${currentStep >= 1 ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'}`}>1</div>
          <span>Basic Information</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#4F46E5]' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${currentStep >= 2 ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'}`}>2</div>
          <span>Pricing & Learning Goals</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#4F46E5]' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${currentStep >= 3 ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'}`}>3</div>
          <span>Review & Publish</span>
        </div>
      </div>

      {/* Step Contents */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-4 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Step 1: Course Basics
          </h2>

          <Input
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next.js 15 App Router & Server Components"
            isRequired
          />

          <Input
            label="Subtitle / Short Tagline"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Master full-stack web applications with React 19 and Tailwind CSS v4."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none"
              >
                <option value="Web Development">Web Development</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX & Design Systems">UI/UX & Design Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Course Thumbnail Upload</label>
            <div className="border-2 border-dashed border-gray-200 rounded-[12px] p-8 text-center bg-[#F8F9FC] space-y-2 cursor-pointer hover:border-[#4F46E5] transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-700">Click to upload thumbnail image</p>
              <p className="text-[11px] text-gray-400">PNG, JPG or WEBP up to 5MB (16:9 aspect ratio recommended)</p>
            </div>
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
              label="Listing Price ($ USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              leftIcon={DollarSign}
              isRequired
            />
            <Input
              label="Original / List Price ($ USD)"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              leftIcon={DollarSign}
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
                    onClick={() => setLearningPoints(learningPoints.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button variant="outline" size="md" leftIcon={ArrowLeft} onClick={() => setCurrentStep(1)}>
              Back to Step 1
            </Button>
            <Button variant="primary" size="md" rightIcon={ArrowRight} onClick={() => setCurrentStep(3)}>
              Continue to Step 3
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Step 3: Review & Publish
          </h2>

          <div className="bg-[#F8F9FC] p-4 rounded-[12px] border border-gray-200 space-y-3 text-xs">
            <div>
              <span className="text-gray-400 font-mono">Title:</span>
              <h3 className="text-sm font-bold text-gray-900 font-heading">{title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 font-mono">Category & Level:</span>
                <p className="font-semibold text-gray-800">{category} • {level}</p>
              </div>
              <div>
                <span className="text-gray-400 font-mono">Price:</span>
                <p className="font-bold text-[#4F46E5] font-mono">${price} USD</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button variant="outline" size="md" leftIcon={ArrowLeft} onClick={() => setCurrentStep(2)}>
              Back to Step 2
            </Button>
            <Button variant="primary" size="lg" isLoading={isPublishing} leftIcon={CheckCircle2} onClick={handlePublish}>
              Publish Course to Marketplace
            </Button>
          </div>
        </Card>
      )}

    </div>
  );
};

export default CreateCourse;
