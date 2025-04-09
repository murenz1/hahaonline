import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { categoryService, generateSKU } from '../../utils/productUtils';

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'draft' | 'archived';
    image?: string;
    sku: string;
    variants?: {
      id: string;
      name: string;
      price: number;
      stock: number;
    }[];
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
  sku?: string;
  variants?: {
    name?: string;
    price?: string;
    stock?: string;
  }[];
  image?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [categories, setCategories] = useState(categoryService.getCategories());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categories[0]?.name || '',
    price: '',
    stock: '',
    status: 'active',
    sku: '',
    image: '',
    variants: [] as { id: string; name: string; price: string; stock: string }[]
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
        sku: product.sku,
        image: product.image || '',
        variants: product.variants?.map(v => ({
          id: v.id,
          name: v.name,
          price: v.price.toString(),
          stock: v.stock.toString()
        })) || []
      });
      if (product.image) {
        setImagePreview(product.image);
      }
    } else {
      // Generate initial SKU if adding new product
      handleGenerateSKU();
    }
  }, [product]);

  const handleGenerateSKU = () => {
    if (formData.name && formData.category) {
      const newSKU = generateSKU(formData.category, formData.name);
      setFormData(prev => ({
        ...prev,
        sku: newSKU
      }));
      setIsDirty(true);
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    // Validate variants
    if (formData.variants.length > 0) {
      newErrors.variants = formData.variants.map(variant => {
        const variantErrors: {
          name?: string;
          price?: string;
          stock?: string;
        } = {};

        if (!variant.name.trim()) {
          variantErrors.name = 'Variant name is required';
        }
        
        if (!variant.price || isNaN(Number(variant.price)) || Number(variant.price) <= 0) {
          variantErrors.price = 'Valid price is required';
        }
        
        if (!variant.stock || isNaN(Number(variant.stock)) || Number(variant.stock) < 0) {
          variantErrors.stock = 'Valid stock quantity is required';
        }

        return Object.keys(variantErrors).length ? variantErrors : undefined;
      });

      if (newErrors.variants.every(v => v === undefined)) {
        delete newErrors.variants;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        variants: formData.variants.map(v => ({
          id: v.id || `VAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: v.name,
          price: Number(v.price),
          stock: Number(v.stock)
        }))
      };
      onSubmit(submissionData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);

    // Auto-generate SKU when name or category changes
    if ((name === 'name' || name === 'category') && formData.name && formData.category) {
      const newSKU = generateSKU(
        name === 'category' ? value : formData.category,
        name === 'name' ? value : formData.name
      );
      setFormData(prev => ({
        ...prev,
        [name]: value,
        sku: newSKU
      }));
    }
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: '', name: '', price: '', stock: '' }
      ]
    }));
    setIsDirty(true);
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
    setIsDirty(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload an image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          image: base64String
        }));
        setImagePreview(base64String);
        setErrors(prev => ({
          ...prev,
          image: undefined
        }));
      };
      reader.readAsDataURL(file);
    }
    setIsDirty(true);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh]",
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
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="col-span-2">
              <div className={cn(
                "border-2 border-dashed rounded-lg p-4",
                isDarkMode ? "border-gray-700" : "border-gray-300",
                errors.image ? "border-red-500" : "hover:border-blue-500"
              )}>
                <div className="flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className={cn(
                      "w-32 h-32 rounded-lg flex items-center justify-center mb-4",
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    )}>
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                      isDarkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </button>
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-500">{errors.image}</p>
                  )}
                  <p className={cn(
                    "mt-2 text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    Supported formats: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Product Name *
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
                  Description *
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

              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                    errors.category && "border-red-500"
                  )}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                    Price *
                </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={cn(
                        "w-full pl-8 pr-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                        errors.price && "border-red-500"
                      )}
                />
              </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                    Stock *
                </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                      errors.stock && "border-red-500"
                    )}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  SKU *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none pr-10",
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                      errors.sku && "border-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSKU}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md",
                      isDarkMode
                        ? "hover:bg-gray-600 text-gray-400 hover:text-gray-300"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    )}
                    title="Generate SKU"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-500">{errors.sku}</p>
                )}
              </div>

              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  )}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Variants
              </h3>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Variant
              </button>
            </div>

            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg mb-4",
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    Variant {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      placeholder="Variant Name"
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                        isDarkMode
                          ? "bg-gray-600 border-gray-500 text-white focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                        errors.variants?.[index]?.name && "border-red-500"
                      )}
                    />
                    {errors.variants?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.variants[index].name}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        placeholder="Price"
                        step="0.01"
                        min="0"
                        className={cn(
                          "w-full pl-8 pr-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                          isDarkMode
                            ? "bg-gray-600 border-gray-500 text-white focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                          errors.variants?.[index]?.price && "border-red-500"
                        )}
                      />
              </div>
                    {errors.variants?.[index]?.price && (
                      <p className="mt-1 text-sm text-red-500">{errors.variants[index].price}</p>
                    )}
          </div>

            <div>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                      placeholder="Stock"
                      min="0"
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                        isDarkMode
                          ? "bg-gray-600 border-gray-500 text-white focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
                        errors.variants?.[index]?.stock && "border-red-500"
                      )}
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="mt-1 text-sm text-red-500">{errors.variants[index].stock}</p>
                    )}
            </div>
                </div>
              </div>
            ))}
            </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
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
              {product ? 'Update Product' : 'Add Product'}
                      </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 

export default ProductForm; 