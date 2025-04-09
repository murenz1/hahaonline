import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Package,
  Clock,
  Star
} from 'lucide-react';

interface VendorsProps {}

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  totalOrders: number;
  totalSpent: number;
  lastOrder: Date;
  paymentTerms: string;
  products: number;
}

const Vendors: React.FC<VendorsProps> = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Mock vendors data
  const vendors: Vendor[] = [
    {
      id: 'VEN-001',
      name: 'Tech Supplies Co.',
      email: 'contact@techsupplies.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA 94025',
      category: 'Electronics',
      status: 'active',
      rating: 4.8,
      totalOrders: 156,
      totalSpent: 45890.50,
      lastOrder: new Date('2024-03-10'),
      paymentTerms: 'Net 30',
      products: 45
    },
    {
      id: 'VEN-002',
      name: 'Office Solutions Ltd.',
      email: 'sales@officesolutions.com',
      phone: '+1 (555) 987-6543',
      address: '456 Business Ave, New York, NY 10001',
      category: 'Office Supplies',
      status: 'active',
      rating: 4.5,
      totalOrders: 89,
      totalSpent: 23450.75,
      lastOrder: new Date('2024-03-12'),
      paymentTerms: 'Net 15',
      products: 128
    },
    {
      id: 'VEN-003',
      name: 'Global Imports Inc.',
      email: 'info@globalimports.com',
      phone: '+1 (555) 246-8135',
      address: '789 Trade Blvd, Miami, FL 33101',
      category: 'General Merchandise',
      status: 'pending',
      rating: 3.9,
      totalOrders: 12,
      totalSpent: 8750.25,
      lastOrder: new Date('2024-03-14'),
      paymentTerms: 'Net 45',
      products: 67
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        )}
      />
    ));
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(vendors.map(vendor => vendor.category)));

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Vendors</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage your vendors and suppliers
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Vendors', value: vendors.length, icon: Building2 },
          { label: 'Active Vendors', value: vendors.filter(v => v.status === 'active').length, icon: CheckCircle },
          { label: 'Total Products', value: vendors.reduce((acc, v) => acc + v.products, 0), icon: Package },
          { label: 'Total Spent', value: `$${vendors.reduce((acc, v) => acc + v.totalSpent, 0).toLocaleString()}`, icon: DollarSign }
        ].map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg border",
              isDarkMode 
                ? "bg-gray-700 border-gray-600" 
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {stat.label}
              </h3>
              <stat.icon className={cn(
                "w-5 h-5",
                index === 0 ? "text-blue-500" :
                index === 1 ? "text-green-500" :
                index === 2 ? "text-purple-500" :
                "text-orange-500"
              )} />
            </div>
            <p className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
        </div>
        
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="orders">Sort by Orders</option>
            <option value="spent">Sort by Total Spent</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <button
          className={cn(
            "flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </button>

        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "flex items-center px-4 py-2 rounded-lg font-medium",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            className={cn(
              "p-2 rounded-lg",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vendors List */}
      {filteredVendors.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-gray-200" : "text-gray-900")}>No vendors found</h3>
          <p className={cn("mt-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className={cn(
                "p-6 rounded-lg border",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-200"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className={cn("text-lg font-medium mr-3", isDarkMode ? "text-white" : "text-gray-900")}>
                      {vendor.name}
                    </h3>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(vendor.status)
                    )}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {vendor.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {vendor.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mx-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{vendor.category}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rating</div>
                  <div className="flex items-center">
                    {getRatingStars(vendor.rating)}
                    <span className={cn("ml-2 text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {vendor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Terms</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{vendor.paymentTerms}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Products</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{vendor.products} items</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Orders</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{vendor.totalOrders}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Spent</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                    ${vendor.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Order</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                    {vendor.lastOrder.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{vendor.address}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vendors; 