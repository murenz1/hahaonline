import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Search,
  Plus,
  Filter,
  BarChart2,
  Package,
  Tag,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ProductForm from './products/ProductForm';
import ProductDetails from './products/ProductDetails';
import { productService } from '../services/productService';
import ProductStats from './products/ProductStats';

interface ProductsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

interface Product {
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
}

const Products: React.FC<ProductsProps> = ({ searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useTheme();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const itemsPerPage = 10;

  // Initialize products from localStorage
  useEffect(() => {
    productService.initializeWithSampleData();
    setProducts(productService.getProducts());
  }, []);

  const sortProducts = (products: Product[]) => {
    switch (sortBy) {
      case 'newest':
        return [...products].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'oldest':
        return [...products].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'name-asc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'stock-asc':
        return [...products].sort((a, b) => a.stock - b.stock);
      case 'stock-desc':
        return [...products].sort((a, b) => b.stock - a.stock);
      default:
        return products;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = sortProducts(filteredProducts);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

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

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const success = productService.deleteProduct(productToDelete);
      if (success) {
        setProducts(productService.getProducts());
      }
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = (formData: any) => {
    if (selectedProduct) {
      // Update existing product
      const updatedProduct = productService.updateProduct(selectedProduct.id, formData);
      if (updatedProduct) {
        setProducts(productService.getProducts());
      }
    } else {
      // Add new product
      const newProduct = productService.addProduct(formData);
      setProducts(productService.getProducts());
    }
    setShowAddModal(false);
    setSelectedProduct(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset selected product when changing pages
    setSelectedProduct(null);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handleFilterChange = (type: 'category' | 'status', value: string) => {
    if (type === 'category') {
      setFilterCategory(value);
    } else {
      setFilterStatus(value);
    }
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProductForDetails(product);
    setShowDetailsModal(true);
  };

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Products</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage your product catalog
        </p>
      </div>

      {/* Product Stats */}
      <div className="mb-8">
        <ProductStats products={products} />
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Categories</option>
            <option value="Gaming Peripherals">Gaming Peripherals</option>
            <option value="Components">Components</option>
            <option value="Accessories">Accessories</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowAddModal(true);
          }}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>

        <div className="flex items-center space-x-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className={cn(
                "px-4 py-2 rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              )}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Products Table */}
      {paginatedProducts.length === 0 ? (
        <div className={cn(
          "text-center py-12",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={cn(
            "w-full border-collapse",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            <thead>
              <tr className={cn(
                "text-left border-b",
                isDarkMode ? "border-gray-700" : "border-gray-200"
              )}>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className={cn(
                  "border-b",
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                )}>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      )}>
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className={cn(
                            "font-medium hover:underline",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}
                        >
                          {product.name}
                        </button>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{product.category}</td>
                  <td className="py-4 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span>{product.stock}</span>
                      {getStockStatusBadge(product.stock)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(product.status)
                    )}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className={cn(
                          "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className={cn(
                          "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
          </div>
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium",
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <ProductForm
          product={selectedProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProductForDetails && (
        <ProductDetails
          product={selectedProductForDetails}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProductForDetails(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={cn(
            "w-full max-w-md rounded-lg shadow-lg p-6",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-4",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Confirm Delete
            </h3>
            <p className={cn(
              "mb-6",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProductToDelete(null);
                }}
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
                className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

export default Products; 