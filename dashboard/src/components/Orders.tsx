import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, Plus, ChevronDown, ChevronUp, Filter, RefreshCw, MoreVertical, Download } from 'lucide-react';
import NewOrderModal from './NewOrderModal';
import LoadingSpinner from './LoadingSpinner';
import Skeleton from './Skeleton';
import SearchSuggestions from './SearchSuggestions';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { exportData } from '../utils/exportData';

interface OrdersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

interface Order {
  id: string;
  customerName: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

const Orders: React.FC<OrdersProps> = ({ searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useTheme();
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'John Doe',
      items: [
        { name: 'Product 1', size: 'M', quantity: 2, price: 29.99 },
        { name: 'Product 2', size: 'L', quantity: 1, price: 39.99 },
      ],
      total: 99.97,
      status: 'pending',
      date: '2024-03-20T10:30:00Z',
    },
    // Add more mock orders as needed
  ]);

  // Keyboard navigation
  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    items: orders,
    onSelect: (index) => toggleOrderSelection(orders[index].id),
    onExpand: (index) => toggleOrderExpansion(orders[index].id),
  });

  // Drag and drop
  const { draggedItem, dragOverId, handleDragStart, handleDragOver, handleDragEnd, handleDrop } = useDragAndDrop({
    items: orders,
    onReorder: setOrders,
  });

  // Search suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm) return [];

    const results: Array<{
      type: 'customer' | 'order' | 'recent';
      text: string;
      value: string;
    }> = [];

    // Add matching customers
    orders.forEach((order) => {
      if (
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !results.some((r) => r.text === order.customerName)
      ) {
        results.push({
          type: 'customer',
          text: order.customerName,
          value: order.customerName,
        });
      }
    });

    // Add matching order IDs
    orders.forEach((order) => {
      if (order.id.includes(searchTerm)) {
        results.push({
          type: 'order',
          text: `Order #${order.id}`,
          value: order.id,
        });
      }
    });

    // Add recent searches
    recentSearches.forEach((search) => {
      if (
        search.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !results.some((r) => r.value === search)
      ) {
        results.push({
          type: 'recent',
          text: search,
          value: search,
        });
      }
    });

    return results.slice(0, 5);
  }, [searchTerm, orders, recentSearches]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    if (value && !recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev].slice(0, 5));
    }
  };

  const handleExport = async () => {
    const dataToExport = selectedOrders.length
      ? orders.filter((order) => selectedOrders.includes(order.id))
      : orders;

    await exportData(dataToExport, {
      filename: `orders-${new Date().toISOString().split('T')[0]}`,
      format: exportFormat,
    });
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNewOrder = (order: { customerName: string; items: any[] }) => {
    const newOrder: Order = {
      id: String(orders.length + 1),
      customerName: order.customerName,
      items: order.items,
      total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      date: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleBulkAction = (action: 'process' | 'complete' | 'cancel') => {
    setOrders((prev) =>
      prev.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, status: action === 'process' ? 'processing' : action === 'complete' ? 'completed' : 'cancelled' }
          : order
      )
    );
    setSelectedOrders([]);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.total - a.total;
      case 'lowest':
        return a.total - b.total;
      default:
        return 0;
    }
  });

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearch = order.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      processing: isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800',
      completed: isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800',
      cancelled: isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  if (isLoading) {
    return (
      <div className={`h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="w-32 h-8" />
              <Skeleton className="w-40 h-10" variant="rectangular" />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-24 h-10" variant="rectangular" />
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-24" variant="rectangular" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-fadeIn">
            <h1 className={`text-2xl font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Orders
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search orders..."
                  className={`w-64 px-4 py-2 pl-10 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 text-white border-gray-700 focus:border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200 focus:border-gray-300'
                  }`}
                />
                <Search className={`absolute left-3 top-2.5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={20} />
                {showSuggestions && (
                  <SearchSuggestions
                    query={searchTerm}
                    suggestions={suggestions}
                    onSelect={handleSearch}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
              </div>
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                disabled={isRefreshing}
              >
                <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                  } ${showFilters ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
                >
                  <Filter size={20} />
                </button>
              </div>
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
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-green-600"
              >
                <Plus size={20} className="mr-2" />
                New Order
              </button>
            </div>
          </div>

          <div className={`flex flex-col space-y-4 transition-all duration-200 ${showFilters ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <div className="flex flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 animate-slideUp">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map((tab) => (
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
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg animate-slideDown bg-opacity-90 backdrop-blur-sm fixed bottom-4 left-4 right-4 z-10 bg-gray-800 text-white">
              <span>{selectedOrders.length} orders selected</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('process')}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Process
                </button>
                <button
                  onClick={() => handleBulkAction('complete')}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                draggable
                onDragStart={() => handleDragStart(order)}
                onDragOver={(e) => handleDragOver(e, order.id)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, order.id)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`rounded-lg transition-all duration-200 transform hover:translate-x-1 animate-slideUp ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow ${
                  dragOverId === order.id ? 'border-2 border-green-500' : ''
                } ${
                  focusedIndex === index ? 'ring-2 ring-green-500' : ''
                }`}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <div className="flex items-center p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="mr-4 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div
                    className="flex-1 cursor-pointer transition-colors duration-200"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Order #{order.id}
                          </h3>
                          <p className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {order.customerName}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-medium transition-colors duration-200 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${order.total.toFixed(2)}
                        </span>
                        <div className="transition-transform duration-200 transform">
                          {expandedOrders.includes(order.id) ? (
                            <ChevronUp size={20} className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          ) : (
                            <ChevronDown size={20} className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedOrders.includes(order.id) && (
                  <div className={`p-4 border-t transition-all duration-300 animate-slideDown ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="space-y-4">
                      <div className={`text-sm transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Order Date: {new Date(order.date).toLocaleString()}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`text-sm transition-colors duration-200 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <th className="text-left font-medium py-2">Item</th>
                              <th className="text-left font-medium py-2">Size</th>
                              <th className="text-right font-medium py-2">Quantity</th>
                              <th className="text-right font-medium py-2">Price</th>
                              <th className="text-right font-medium py-2">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {order.items.map((item, itemIndex) => (
                              <tr
                                key={itemIndex}
                                style={{ animationDelay: `${itemIndex * 50}ms` }}
                                className={`text-sm animate-fadeIn transition-colors duration-200 ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                              >
                                <td className="py-2">{item.name}</td>
                                <td className="py-2">{item.size}</td>
                                <td className="text-right py-2">{item.quantity}</td>
                                <td className="text-right py-2">${item.price.toFixed(2)}</td>
                                <td className="text-right py-2">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewOrder}
      />
    </div>
  );
};

export default Orders;