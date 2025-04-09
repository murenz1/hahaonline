import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { format, addMonths, addWeeks, addDays } from 'date-fns';
import { Transaction } from '../../types';
import { financeService } from '../../services/financeService';
import { X, Plus, Tag, Upload, Calendar, AlertCircle, Check, Trash2 } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Transaction;
  onCancel?: () => void;
}

interface FormErrors {
  amount?: string;
  description?: string;
  category?: string;
  date?: string;
  recurringFrequency?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  onCancel
}) => {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState(initialData?.recurringFrequency || 'monthly');
  const [nextOccurrence, setNextOccurrence] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount?.toString() || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    date: initialData?.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    status: initialData?.status || 'pending',
    reference: initialData?.reference || '',
    tags: initialData?.tags || []
  });

  const categories = financeService.getCategories();

  useEffect(() => {
    if (isRecurring && formData.date) {
      const date = new Date(formData.date);
      switch (recurringFrequency) {
        case 'daily':
          setNextOccurrence(addDays(date, 1));
          break;
        case 'weekly':
          setNextOccurrence(addWeeks(date, 1));
          break;
        case 'monthly':
          setNextOccurrence(addMonths(date, 1));
          break;
        default:
          setNextOccurrence(null);
      }
    } else {
      setNextOccurrence(null);
    }
  }, [isRecurring, recurringFrequency, formData.date]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select or add a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (isRecurring && !recurringFrequency) {
      newErrors.recurringFrequency = 'Please select a frequency for recurring transactions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          // In a real app, you would upload the file to a server and get a URL
          // For now, we'll create an object URL
          return URL.createObjectURL(file);
        })
      );

      const transaction = {
        type: formData.type as 'income' | 'expense',
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: new Date(formData.date),
        status: formData.status as 'completed' | 'pending' | 'failed',
        reference: formData.reference || undefined,
        tags: formData.tags,
        attachments: fileUrls,
        isRecurring: isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : undefined
      };

      onSubmit(transaction);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
      }
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      financeService.addCategory(formData.type, newCategory.trim());
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Validate file types and sizes
      const validFiles = newFiles.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        return isValidType && isValidSize;
      });
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={cn(
              "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              className={cn(
                "block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
                errors.amount ? "border-red-500" : "",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          {showNewCategoryInput ? (
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="New category name"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Add
              </button>
            </div>
          ) : (
            <div className="flex rounded-md shadow-sm">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={cn(
                  "flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
                  errors.category ? "border-red-500" : "",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
                <option value="">Select a category</option>
                {formData.type === 'income'
                  ? categories.income.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  : categories.expense.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                }
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategoryInput(true)}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          )}
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={cn(
                "block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
                errors.date ? "border-red-500" : "",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.date}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={cn(
              "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
              errors.description ? "border-red-500" : "",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
            placeholder="Enter transaction description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reference
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className={cn(
              "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
            placeholder="Optional reference number or note"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recurring Transaction
            </label>
          </div>

          {isRecurring && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency
                </label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value)}
                  className={cn(
                    "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600",
                    errors.recurringFrequency ? "border-red-500" : "",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {errors.recurringFrequency && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.recurringFrequency}
                  </p>
                )}
              </div>

              {nextOccurrence && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Next occurrence: {format(nextOccurrence, 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                const newTag = prompt('Enter a new tag:');
                if (newTag) handleAddTag(newTag);
              }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Tag
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attachments
          </label>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Max file size: 5MB. Supported formats: JPG, PNG, PDF
              </span>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              {initialData ? 'Update Transaction' : 'Add Transaction'}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}; 