import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  PercentIcon, 
  DollarSign, 
  Truck, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit, 
  Plus, 
  Search,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface Promotion {
  id: string;
  name: string;
  description?: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

interface PromotionManagementProps {
  initialPromotions?: Promotion[];
  onAddPromotion?: (promotion: Omit<Promotion, 'id'>) => Promise<void>;
  onEditPromotion?: (id: string, promotion: Partial<Promotion>) => Promise<void>;
  onDeletePromotion?: (id: string) => Promise<void>;
}

const PromotionManagement: React.FC<PromotionManagementProps> = ({
  initialPromotions = [],
  onAddPromotion,
  onEditPromotion,
  onDeletePromotion
}) => {
  const { theme } = useTheme();
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Partial<Promotion> | null>(null);

  useEffect(() => {
    // Fetch promotions from API if not provided
    if (initialPromotions.length === 0) {
      fetchPromotions();
    }
  }, [initialPromotions]);

  const fetchPromotions = async () => {
    try {
      // This would be replaced with an actual API call
      const response = await fetch('/api/marketing/promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    }
  };

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.description && promo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'ALL' || promo.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || promo.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    if (onAddPromotion) {
      await onAddPromotion(promotion);
      setIsAddModalOpen(false);
      fetchPromotions();
    }
  };

  const handleEditPromotion = async (id: string, promotion: Partial<Promotion>) => {
    if (onEditPromotion) {
      await onEditPromotion(id, promotion);
      setCurrentPromotion(null);
      fetchPromotions();
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (onDeletePromotion) {
      await onDeletePromotion(id);
      fetchPromotions();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return <PercentIcon className="w-4 h-4" />;
      case 'FIXED_AMOUNT':
        return <DollarSign className="w-4 h-4" />;
      case 'FREE_SHIPPING':
        return <Truck className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'INACTIVE':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
      case 'EXPIRED':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'PERCENTAGE':
        return `${promotion.value}%`;
      case 'FIXED_AMOUNT':
        return formatCurrency(promotion.value);
      case 'FREE_SHIPPING':
        return 'Free Shipping';
      default:
        return '';
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Promotion Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and manage promotional campaigns and discounts
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-3 md:mt-0 flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Promotion
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`px-4 py-2 w-full rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="ALL">All Types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed Amount</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-2 w-full rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {filteredPromotions.length === 0 ? (
        <div className={`p-8 text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No promotions found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Code & Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Type & Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Validity Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Usage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
              {filteredPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{promotion.code}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{promotion.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {getTypeIcon(promotion.type)}
                      </span>
                      <span className="ml-3">{getPromotionValue(promotion)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                      <span>
                        {formatDate(new Date(promotion.startDate))}
                        {promotion.endDate && ` - ${formatDate(new Date(promotion.endDate))}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{promotion.usageCount} used</div>
                    {promotion.usageLimit && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Limit: {promotion.usageLimit}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(promotion.status)}`}>
                      {promotion.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {/* View details logic */}}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPromotion(promotion)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || currentPromotion) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg max-w-2xl w-full mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className="text-lg font-medium mb-4">
              {currentPromotion ? 'Edit Promotion' : 'Add New Promotion'}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Promotion Name *
                </label>
                <input
                  type="text"
                  value={currentPromotion?.name || ''}
                  onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Summer Sale 2023"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Promotion Code *
                </label>
                <input
                  type="text"
                  value={currentPromotion?.code || ''}
                  onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, code: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="SUMMER23"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={currentPromotion?.description || ''}
                  onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, description: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Summer season discount for all products"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Promotion Type *
                  </label>
                  <select
                    value={currentPromotion?.type || 'PERCENTAGE'}
                    onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, type: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' }))}
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  >
                    <option value="PERCENTAGE">Percentage Discount</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Value *
                  </label>
                  <div className="relative">
                    {currentPromotion?.type === 'PERCENTAGE' && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>%</span>
                      </div>
                    )}
                    {currentPromotion?.type === 'FIXED_AMOUNT' && (
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>$</span>
                      </div>
                    )}
                    <input
                      type="number"
                      value={currentPromotion?.value || 0}
                      onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, value: parseFloat(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded-lg border ${currentPromotion?.type === 'FIXED_AMOUNT' ? 'pl-7' : ''} ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="10"
                      disabled={currentPromotion?.type === 'FREE_SHIPPING'}
                      required={currentPromotion?.type !== 'FREE_SHIPPING'}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={currentPromotion?.startDate ? new Date(currentPromotion.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, startDate: new Date(e.target.value) }))}
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={currentPromotion?.endDate ? new Date(currentPromotion.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, endDate: e.target.value ? new Date(e.target.value) : undefined }))}
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    min={currentPromotion?.startDate ? new Date(currentPromotion.startDate).toISOString().split('T')[0] : ''}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Minimum Purchase
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>$</span>
                    </div>
                    <input
                      type="number"
                      value={currentPromotion?.minPurchase || ''}
                      onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, minPurchase: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className={`w-full pl-7 px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Maximum Discount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>$</span>
                    </div>
                    <input
                      type="number"
                      value={currentPromotion?.maxDiscount || ''}
                      onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className={`w-full pl-7 px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="100"
                      disabled={currentPromotion?.type !== 'PERCENTAGE'}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={currentPromotion?.usageLimit || ''}
                    onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, usageLimit: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="100"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status *
                  </label>
                  <select
                    value={currentPromotion?.status || 'ACTIVE'}
                    onChange={(e) => setCurrentPromotion(prev => ({ ...prev as Promotion, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'EXPIRED' }))}
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>
            </form>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setCurrentPromotion(null);
                }}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentPromotion?.id) {
                    handleEditPromotion(currentPromotion.id, currentPromotion);
                  } else if (currentPromotion) {
                    handleAddPromotion(currentPromotion as Omit<Promotion, 'id'>);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!currentPromotion?.name || !currentPromotion?.code}
              >
                {currentPromotion?.id ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;