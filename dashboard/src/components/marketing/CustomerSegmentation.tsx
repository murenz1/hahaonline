import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertTriangle,
  ChevronRight,
  Tag,
  MessageSquare,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  criteria: SegmentCriteria;
  customerCount: number;
  createdAt: Date;
  updatedAt: Date;
  filters?: {
    purchaseAmount?: {
      enabled: boolean;
      min?: number;
      max?: number;
    };
    purchaseFrequency?: {
      enabled: boolean;
      min?: number;
      period?: number;
    };
    customerAge?: {
      enabled: boolean;
      min?: number;
      max?: number;
    };
  };
}

interface SegmentCriteria {
  type: 'AND' | 'OR';
  conditions: SegmentCondition[];
}

interface SegmentCondition {
  field: string;
  operator: string;
  value: any;
}

interface CustomerSegmentationProps {
  initialSegments?: CustomerSegment[];
  onCreateSegment?: (segment: Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateSegment?: (id: string, segment: Partial<CustomerSegment>) => Promise<void>;
  onDeleteSegment?: (id: string) => Promise<void>;
}

const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({
  initialSegments = [],
  onCreateSegment,
  onUpdateSegment,
  onDeleteSegment
}) => {
  const { isDarkMode } = useTheme();
  const [segments, setSegments] = useState<CustomerSegment[]>(initialSegments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<Partial<CustomerSegment> | null>(null);
  const [expandedSegmentId, setExpandedSegmentId] = useState<string | null>(null);

  useEffect(() => {
    if (initialSegments.length === 0) {
      fetchSegments();
    }
  }, [initialSegments]);

  const fetchSegments = async () => {
    try {
      const response = await fetch('/api/marketing/segments');
      const data = await response.json();
      setSegments(data);
    } catch (error) {
      console.error('Failed to fetch customer segments:', error);
    }
  };

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = 
      segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (segment.description && segment.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleCreateSegment = async (segment: Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (onCreateSegment) {
      await onCreateSegment(segment);
      setIsCreateModalOpen(false);
      fetchSegments();
    }
  };

  const handleUpdateSegment = async (id: string, segment: Partial<CustomerSegment>) => {
    if (onUpdateSegment) {
      await onUpdateSegment(id, segment);
      setCurrentSegment(null);
      fetchSegments();
    }
  };

  const handleDeleteSegment = async (id: string) => {
    if (onDeleteSegment) {
      await onDeleteSegment(id);
      fetchSegments();
    }
  };

  const getSegmentIcon = (segment: CustomerSegment) => {
    // Check segment criteria to determine most appropriate icon
    const fieldTypes = segment.criteria.conditions.map(c => c.field.split('.')[0]);
    
    if (fieldTypes.includes('purchase')) {
      return <DollarSign className="w-5 h-5 text-green-500" />;
    } else if (fieldTypes.includes('email')) {
      return <Mail className="w-5 h-5 text-blue-500" />;
    } else if (fieldTypes.includes('location')) {
      return <MapPin className="w-5 h-5 text-red-500" />;
    } else if (fieldTypes.includes('date')) {
      return <Calendar className="w-5 h-5 text-purple-500" />;
    }
    
    return <Users className="w-5 h-5 text-gray-500" />;
  };

  const formatSegmentCriteria = (criteria: SegmentCriteria): string => {
    if (!criteria || !criteria.conditions || criteria.conditions.length === 0) {
      return 'No conditions defined';
    }

    const operator = criteria.type === 'AND' ? 'and' : 'or';
    
    const conditionStrings = criteria.conditions.map(condition => {
      let fieldLabel = condition.field;
      
      // Format field for display
      if (fieldLabel.includes('.')) {
        fieldLabel = fieldLabel.split('.').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
      } else {
        fieldLabel = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1);
      }
      
      // Format operator for display
      let operatorLabel = condition.operator;
      switch (operatorLabel) {
        case 'eq': operatorLabel = 'equals'; break;
        case 'neq': operatorLabel = 'not equals'; break;
        case 'gt': operatorLabel = 'greater than'; break;
        case 'lt': operatorLabel = 'less than'; break;
        case 'gte': operatorLabel = 'greater than or equal to'; break;
        case 'lte': operatorLabel = 'less than or equal to'; break;
        case 'contains': operatorLabel = 'contains'; break;
        case 'startsWith': operatorLabel = 'starts with'; break;
        case 'endsWith': operatorLabel = 'ends with'; break;
      }
      
      return `${fieldLabel} ${operatorLabel} ${condition.value}`;
    });

    if (conditionStrings.length === 1) {
      return conditionStrings[0];
    }
    
    return `${conditionStrings.slice(0, -1).join(`, `)} ${operator} ${conditionStrings.slice(-1)}`;
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Segmentation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and manage customer segments for targeted marketing
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-3 md:mt-0 flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Segment
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full md:w-1/3 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {filteredSegments.length === 0 ? (
        <div className={`p-8 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No segments found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or create a new segment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSegments.map((segment) => (
            <div
              key={segment.id}
              className={`rounded-lg border overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div 
                className={`px-6 py-4 flex items-center cursor-pointer ${
                  expandedSegmentId === segment.id 
                    ? isDarkMode ? 'bg-gray-700' : 'bg-gray-50' 
                    : ''
                }`}
                onClick={() => setExpandedSegmentId(
                  expandedSegmentId === segment.id ? null : segment.id
                )}
              >
                <div className="flex-shrink-0 mr-4">
                  {getSegmentIcon(segment)}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{segment.name}</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {segment.customerCount.toLocaleString()} customers
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Updated {formatDate(new Date(segment.updatedAt))}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSegment(segment);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSegment(segment.id);
                    }}
                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                  <ChevronRight 
                    className={`transition-transform ${
                      expandedSegmentId === segment.id ? 'transform rotate-90' : ''
                    }`}
                    size={20} 
                  />
                </div>
              </div>
              
              {expandedSegmentId === segment.id && (
                <div className={`px-6 py-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  {segment.description && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Description:</h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {segment.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Segment Criteria:</h4>
                    <div className={`p-3 rounded-lg text-sm ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                    }`}>
                      <div className="flex items-start">
                        <Filter className="w-4 h-4 mr-2 mt-0.5" />
                        <span>{formatSegmentCriteria(segment.criteria)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Update Customers
                    </button>
                    <button
                      className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </button>
                    <button
                      className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      Create Promotion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Segment Modal */}
      {(isCreateModalOpen || currentSegment) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg max-w-3xl w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className="text-lg font-medium mb-4">
              {currentSegment?.id ? 'Edit Customer Segment' : 'Create Customer Segment'}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Segment Name *
                </label>
                <input
                  type="text"
                  value={currentSegment?.name || ''}
                  onChange={(e) => setCurrentSegment(prev => ({ ...prev as CustomerSegment, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="High-Value Customers"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  value={currentSegment?.description || ''}
                  onChange={(e) => setCurrentSegment(prev => ({ ...prev as CustomerSegment, description: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Customers who have spent over $500 in the last 3 months"
                  rows={3}
                />
              </div>
              
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter Criteria
                </h4>
                
                <div className="space-y-3">
                  {/* Purchase Amount Filter */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Purchase Amount
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enablePurchaseAmount"
                          checked={currentSegment?.filters?.purchaseAmount?.enabled || false}
                          onChange={(e) => {
                            if (currentSegment) {
                              const updatedSegment = { ...currentSegment };
                              if (!updatedSegment.filters) {
                                updatedSegment.filters = {};
                              }
                              if (!updatedSegment.filters.purchaseAmount) {
                                updatedSegment.filters.purchaseAmount = { enabled: e.target.checked };
                              } else {
                                updatedSegment.filters.purchaseAmount.enabled = e.target.checked;
                              }
                              setCurrentSegment(updatedSegment);
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="enablePurchaseAmount" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Enable
                        </label>
                      </div>
                    </div>
                    
                    {currentSegment?.filters?.purchaseAmount?.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Minimum ($)
                          </label>
                          <input
                            type="number"
                            value={currentSegment?.filters?.purchaseAmount?.min || ''}
                            onChange={(e) => {
                              if (currentSegment) {
                                const updatedSegment = { ...currentSegment };
                                if (!updatedSegment.filters) {
                                  updatedSegment.filters = {};
                                }
                                if (!updatedSegment.filters.purchaseAmount) {
                                  updatedSegment.filters.purchaseAmount = { enabled: true };
                                }
                                updatedSegment.filters.purchaseAmount.min = e.target.value ? Number(e.target.value) : undefined;
                                setCurrentSegment(updatedSegment);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="100"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Maximum ($)
                          </label>
                          <input
                            type="number"
                            value={currentSegment?.filters?.purchaseAmount?.max || ''}
                            onChange={(e) => {
                              if (currentSegment) {
                                const updatedSegment = { ...currentSegment };
                                if (!updatedSegment.filters) {
                                  updatedSegment.filters = {};
                                }
                                if (!updatedSegment.filters.purchaseAmount) {
                                  updatedSegment.filters.purchaseAmount = { enabled: true };
                                }
                                updatedSegment.filters.purchaseAmount.max = e.target.value ? Number(e.target.value) : undefined;
                                setCurrentSegment(updatedSegment);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="1000"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Purchase Frequency Filter */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Purchase Frequency
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enablePurchaseFrequency"
                          checked={currentSegment?.filters?.purchaseFrequency?.enabled || false}
                          onChange={(e) => {
                            if (currentSegment) {
                              const updatedSegment = { ...currentSegment };
                              if (!updatedSegment.filters) {
                                updatedSegment.filters = {};
                              }
                              if (!updatedSegment.filters.purchaseFrequency) {
                                updatedSegment.filters.purchaseFrequency = { enabled: e.target.checked };
                              } else {
                                updatedSegment.filters.purchaseFrequency.enabled = e.target.checked;
                              }
                              setCurrentSegment(updatedSegment);
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="enablePurchaseFrequency" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Enable
                        </label>
                      </div>
                    </div>
                    
                    {currentSegment?.filters?.purchaseFrequency?.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Minimum (orders)
                          </label>
                          <input
                            type="number"
                            value={currentSegment?.filters?.purchaseFrequency?.min || ''}
                            onChange={(e) => {
                              if (currentSegment) {
                                const updatedSegment = { ...currentSegment };
                                if (!updatedSegment.filters) {
                                  updatedSegment.filters = {};
                                }
                                if (!updatedSegment.filters.purchaseFrequency) {
                                  updatedSegment.filters.purchaseFrequency = { enabled: true };
                                }
                                updatedSegment.filters.purchaseFrequency.min = e.target.value ? Number(e.target.value) : undefined;
                                setCurrentSegment(updatedSegment);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="2"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Time Period (days)
                          </label>
                          <input
                            type="number"
                            value={currentSegment?.filters?.purchaseFrequency?.period || ''}
                            onChange={(e) => {
                              if (currentSegment) {
                                const updatedSegment = { ...currentSegment };
                                if (!updatedSegment.filters) {
                                  updatedSegment.filters = {};
                                }
                                if (!updatedSegment.filters.purchaseFrequency) {
                                  updatedSegment.filters.purchaseFrequency = { enabled: true };
                                }
                                updatedSegment.filters.purchaseFrequency.period = e.target.value ? Number(e.target.value) : undefined;
                                setCurrentSegment(updatedSegment);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="90"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Customer Age Filter */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Customer Age
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableCustomerAge"
                          checked={currentSegment?.filters?.customerAge?.enabled || false}
                          onChange={(e) => {
                            if (currentSegment) {
                              const updatedSegment = { ...currentSegment };
                              if (!updatedSegment.filters) {
                                updatedSegment.filters = {};
                              }
                              if (!updatedSegment.filters.customerAge) {
                                updatedSegment.filters.customerAge = { enabled: e.target.checked };
                              } else {
                                updatedSegment.filters.customerAge.enabled = e.target.checked;
                              }
                              setCurrentSegment(updatedSegment);
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor="enableCustomerAge" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Enable
                        </label>
                      </div>
                    </div>
                    
                    {currentSegment?.filters?.customerAge?.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Minimum (years)
                          </label>
                          <input
                            type="number"
                            value={currentSegment?.filters?.customerAge?.min || ''}
                            onChange={(e) => {
                              if (currentSegment) {
                                const updatedSegment = { ...currentSegment };
                                if (!updatedSegment.filters) {
                                  updatedSegment.filters = {};
                                }
                                if (!updatedSegment.filters.customerAge) {
                                  updatedSegment.filters.customerAge = { enabled: true };
                                }
                                updatedSegment.filters.customerAge.min = e.target.value ? Number(e.target.value) : undefined;
                                setCurrentSegment(updatedSegment);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="18"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Maximum (years)
                          </label>
                          <input
                            type="number"
                            value={currentSegment?.filters?.customerAge?.max || ''}
                            onChange={(e) => {
                              if (currentSegment) {
                                const updatedSegment = { ...currentSegment };
                                if (!updatedSegment.filters) {
                                  updatedSegment.filters = {};
                                }
                                if (!updatedSegment.filters.customerAge) {
                                  updatedSegment.filters.customerAge = { enabled: true };
                                }
                                updatedSegment.filters.customerAge.max = e.target.value ? Number(e.target.value) : undefined;
                                setCurrentSegment(updatedSegment);
                              }
                            }}
                            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="35"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCurrentSegment(null);
                }}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentSegment && currentSegment.name) {
                    if (!currentSegment.id) {
                      // Create a valid segment object with required fields
                      const newSegment: Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt'> = {
                        name: currentSegment.name,
                        description: currentSegment.description,
                        criteria: currentSegment.criteria || { type: 'AND', conditions: [] },
                        customerCount: currentSegment.customerCount || 0,
                        filters: currentSegment.filters
                      };
                      handleCreateSegment(newSegment);
                    } else {
                      handleUpdateSegment(currentSegment.id, currentSegment);
                    }
                    setIsCreateModalOpen(false);
                    setCurrentSegment(null);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!currentSegment?.name}
              >
                {currentSegment?.id ? 'Update Segment' : 'Create Segment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSegmentation; 