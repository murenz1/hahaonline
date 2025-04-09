import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  Package,
  Tag,
  DollarSign,
  Box,
  Calendar,
  Clock,
  BarChart2,
  Truck,
  Star,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ProductDetailsProps {
  product: {
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
    createdAt: Date;
    updatedAt: Date;
  };
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose }) => {
  const { isDarkMode } = useTheme();

  const getStockStatusBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </span>
      );
    } else if (stock < 10) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Low Stock
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          In Stock
        </span>
      );
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={cn(
        "w-full max-w-4xl rounded-lg shadow-lg",
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
            Product Details
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Image */}
            <div className="col-span-1">
              <div className={cn(
                "aspect-square rounded-lg flex items-center justify-center",
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              )}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-span-2 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className={cn(
                  "text-2xl font-semibold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {product.name}
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                    getStatusBadgeClass(product.status)
                  )}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                </div>
                <p className={cn(
                  "text-base",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  {product.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className={cn(
                  "p-4 rounded-lg",
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Price
                    </span>
                    <DollarSign className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className={cn(
                    "text-xl font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg",
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Stock
                    </span>
                    <Box className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className={cn(
                      "text-xl font-semibold",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {product.stock}
                    </p>
                    {getStockStatusBadge(product.stock)}
                  </div>
                </div>

                <div className={cn(
                  "p-4 rounded-lg",
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Category
                    </span>
                    <Tag className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className={cn(
                    "text-xl font-semibold",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {product.category}
                  </p>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4 className={cn(
                    "text-lg font-semibold mb-3",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    Variants
                  </h4>
                  <div className="space-y-2">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={cn(
                          "p-3 rounded-lg flex items-center justify-between",
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        )}
                      >
                        <div>
                          <p className={cn(
                            "font-medium",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}>
                            {variant.name}
                          </p>
                          <p className={cn(
                            "text-sm",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>
                            Stock: {variant.stock}
                          </p>
                        </div>
                        <p className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                          ${variant.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Created: {product.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    Updated: {product.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 