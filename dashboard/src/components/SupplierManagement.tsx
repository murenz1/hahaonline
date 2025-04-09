import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Filter, Package, Truck, CreditCard, Phone, Mail, Globe, Building } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { exportData } from '../utils/exportData';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms: string;
  leadTime: number;
  rating: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
}

interface SupplierManagementProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SupplierManagement: React.FC<SupplierManagementProps> = ({ searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders'>('suppliers');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  // Mock data - replace with actual API calls
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 'SUP-001',
      name: 'Global Electronics Inc.',
      contactPerson: 'John Smith',
      email: 'john@globalelectronics.com',
      phone: '+1 234-567-8901',
      address: '123 Tech Park, Silicon Valley, CA',
      website: 'www.globalelectronics.com',
      status: 'active',
      paymentTerms: 'Net 30',
      leadTime: 7,
      rating: 4.5,
      totalOrders: 25,
      totalSpent: 150000,
      lastOrderDate: '2024-03-15T10:30:00Z',
    },
    // Add more mock suppliers as needed
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-001',
      supplierId: 'SUP-001',
      date: '2024-03-20T10:30:00Z',
      items: [
        {
          name: 'Laptop Pro X1',
          quantity: 10,
          unitPrice: 1200,
          total: 12000,
        },
      ],
      status: 'pending',
      totalAmount: 12000,
      paymentStatus: 'pending',
      expectedDeliveryDate: '2024-03-27T10:30:00Z',
    },
    // Add more mock orders as needed
  ]);

  // Keyboard navigation
  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    items: activeTab === 'suppliers' ? suppliers : purchaseOrders,
    onSelect: (index) => {
      if (activeTab === 'suppliers') {
        toggleSupplierSelection(suppliers[index].id);
      } else {
        toggleOrderSelection(purchaseOrders[index].id);
      }
    },
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchTerm, statusFilter]);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suppliers.find(s => s.id === order.supplierId)?.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [purchaseOrders, suppliers, searchTerm]);

  const toggleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const toggleOrderSelection = (orderId: string) => {
    // Implement order selection logic if needed
  };

  const handleExport = async () => {
    const dataToExport = activeTab === 'suppliers'
      ? (selectedSuppliers.length
          ? suppliers.filter(supplier => selectedSuppliers.includes(supplier.id))
          : suppliers)
      : purchaseOrders;

    await exportData(dataToExport, {
      filename: `${activeTab}-${new Date().toISOString().split('T')[0]}`,
      format: exportFormat,
    });
  };

  const getStatusColor = (status: Supplier['status']) => {
    switch (status) {
      case 'active':
        return isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800';
      case 'inactive':
        return isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800';
      case 'pending':
        return isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      default:
        return '';
    }
  };

  const getOrderStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'pending':
        return isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'shipped':
        return isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800';
      case 'delivered':
        return isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800';
      case 'cancelled':
        return isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  return (
    <div className={`h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-fadeIn">
            <h1 className={`text-2xl font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Supplier Management
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className={`w-64 px-4 py-2 pl-10 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 text-white border-gray-700 focus:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 focus:border-gray-300'
                  }`}
                />
                <Search className={`absolute left-3 top-2.5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={20} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                } ${showFilters ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
              >
                <Filter size={20} />
              </button>
              <div className="relative">
                <button
                  onClick={handleExport}
                  className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Download size={20} />
                </button>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                  className={`absolute right-0 mt-2 w-24 py-1 rounded-lg shadow-lg ${
                    isDarkMode
                      ? 'bg-gray-800 text-white border-gray-700'
                      : 'bg-white text-gray-900 border-gray-200'
                  }`}
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <button
                className="flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-green-600"
              >
                <Plus size={20} className="mr-2" />
                {activeTab === 'suppliers' ? 'New Supplier' : 'New Order'}
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeTab === 'suppliers' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-white text-gray-900 border-gray-200'
                      }`}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {(['suppliers', 'orders'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                  activeTab === tab
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-900 shadow'
                    : isDarkMode
                      ? 'text-gray-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'suppliers' ? (
            <div className="space-y-4">
              {filteredSuppliers.map((supplier, index) => (
                <div
                  key={supplier.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`rounded-lg transition-all duration-200 transform hover:translate-x-1 animate-slideUp ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow ${
                    focusedIndex === index ? 'ring-2 ring-green-500' : ''
                  }`}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedSuppliers.includes(supplier.id)}
                            onChange={() => toggleSupplierSelection(supplier.id)}
                            className={`h-4 w-4 rounded ${
                              isDarkMode ? 'border-gray-600' : 'border-gray-300'
                            }`}
                          />
                          <h3 className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {supplier.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                            {supplier.status}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Building size={16} className="inline mr-1" />
                            {supplier.contactPerson}
                          </span>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Mail size={16} className="inline mr-1" />
                            {supplier.email}
                          </span>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Phone size={16} className="inline mr-1" />
                            {supplier.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Total Orders
                          </p>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {supplier.totalOrders}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Total Spent
                          </p>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ${supplier.totalSpent.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Globe size={16} className="inline mr-1" />
                          {supplier.website}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Payment Terms: {supplier.paymentTerms}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Lead Time: {supplier.leadTime} days
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Rating: {supplier.rating}/5
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Last Order: {new Date(supplier.lastOrderDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`rounded-lg transition-all duration-200 transform hover:translate-x-1 animate-slideUp ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } shadow ${
                    focusedIndex === index ? 'ring-2 ring-green-500' : ''
                  }`}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {order.id}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Supplier: {suppliers.find(s => s.id === order.supplierId)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Total Amount
                          </p>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ${order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <th className="text-left py-2">Item</th>
                              <th className="text-right py-2">Quantity</th>
                              <th className="text-right py-2">Unit Price</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, itemIndex) => (
                              <tr key={itemIndex} className={`text-sm ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                <td className="py-2">{item.name}</td>
                                <td className="text-right py-2">{item.quantity}</td>
                                <td className="text-right py-2">${item.unitPrice.toLocaleString()}</td>
                                <td className="text-right py-2">${item.total.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar size={16} className="inline mr-1" />
                          Order Date: {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Truck size={16} className="inline mr-1" />
                          Expected: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement; 