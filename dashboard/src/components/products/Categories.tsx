import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Category, categoryService } from '../../utils/productUtils';
import CategoryForm from './CategoryForm';

const Categories: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | undefined>();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const loadedCategories = categoryService.getCategories();
    setCategories(loadedCategories);
  };

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      categoryService.deleteCategory(categoryToDelete.id);
      loadCategories();
      setShowDeleteConfirm(false);
      setCategoryToDelete(undefined);
    }
  };

  const handleSubmit = (data: { name: string; description?: string }) => {
    if (selectedCategory) {
      categoryService.updateCategory(selectedCategory.id, data);
    } else {
      categoryService.addCategory(data.name, data.description);
    }
    loadCategories();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={cn(
          "text-xl font-semibold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Categories
        </h2>
        <button
          onClick={handleAddCategory}
          className="flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            className={cn(
              "p-4 rounded-lg border",
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className={cn(
                "font-medium",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {category.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className={cn(
                    "p-1 rounded-lg",
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className={cn(
                    "p-1 rounded-lg",
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                      : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                {category.description}
              </p>
            )}
            <div className={cn(
              "mt-2 text-xs",
              isDarkMode ? "text-gray-500" : "text-gray-400"
            )}>
              Created: {category.createdAt.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showDeleteConfirm && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={cn(
            "w-full max-w-md rounded-lg shadow-lg p-6",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Delete Category
              </h3>
            </div>
            <p className={cn(
              "mb-4",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Are you sure you want to delete the category "{categoryToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
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
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories; 