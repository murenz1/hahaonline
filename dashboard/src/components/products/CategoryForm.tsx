import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { Category } from '../../utils/productUtils';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-lg rounded-lg shadow-lg",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className={cn(
          "flex items-center justify-between p-6 border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <h2 className={cn(
            "text-xl font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={cn(
              "block text-sm font-medium mb-1",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={cn(
              "block text-sm font-medium mb-1",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={cn(
                "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                errors.description && "border-red-500"
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "px-4 py-2 rounded-lg font-medium",
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-white",
                isDirty
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              )}
            >
              {category ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; 