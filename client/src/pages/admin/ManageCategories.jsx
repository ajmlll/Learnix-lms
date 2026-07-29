import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Code, Brain, Cloud, Smartphone, Palette, Shield, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import courseService from '../../services/courseService';
import { toast } from 'react-toastify';

const iconMap = {
  Code,
  Brain,
  Cloud,
  Smartphone,
  Palette,
  Shield,
};

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('indigo');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('[ManageCategories API Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      await courseService.createCategory(catName);
      toast.success(`Category "${catName}" created!`);
      setCatName('');
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    }
  };

  const handleDelete = (id, name) => {
    setCategories(categories.filter((c) => (c.id !== id && c._id !== id)));
    toast.info(`Category "${name}" removed.`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-52" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-[12px] border border-gray-200 bg-white space-y-4 shadow-soft">
              <div className="flex justify-between">
                <Skeleton circle className="w-12 h-12" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="dark" size="sm" hasDot>TAXONOMY MANAGEMENT</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Course Categories ({categories.length})
          </h1>
          <p className="text-xs text-gray-500">
            Organize platform taxonomy, featured domain tags, and catalog filters.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catId = cat.id || cat._id;
          const IconComponent = iconMap[cat.iconName] || Code;
          return (
            <Card hoverable key={catId} className="p-5 space-y-4 flex flex-col justify-between shadow-soft">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-[10px] bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center font-bold">
                  <IconComponent className="w-6 h-6" />
                </div>
                <Badge variant="neutral" size="sm">{cat.count || 0} Courses</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold font-heading text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {catId}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 font-mono uppercase">Color: {cat.color || 'indigo'}</span>
                <button
                  onClick={() => handleDelete(catId, cat.name)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
        size="md"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category Name"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Artificial Intelligence & Machine Learning"
            isRequired
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">Color Theme Tag</label>
            <select
              value={catColor}
              onChange={(e) => setCatColor(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none"
            >
              <option value="indigo">Indigo / Primary</option>
              <option value="amber">Amber / Accent</option>
              <option value="emerald">Emerald / Success</option>
              <option value="purple">Purple</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" leftIcon={CheckCircle2}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManageCategories;
