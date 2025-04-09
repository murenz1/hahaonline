import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Filter, TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, Receipt } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { exportData } from '../utils/exportData';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'credit' | 'bank_transfer' | 'other';
  status: 'pending' | 'completed' | 'cancelled';
  reference: string;
  attachments: string[];
}

interface AccountingProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Accounting: React.FC<AccountingProps> = ({ searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  // Mock data - replace with actual API calls
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TRX-001',
      date: '2024-03-20T10:30:00Z',
      type: 'income',
      category: 'Sales',
      description: 'Product sales for March',
      amount: 1500.00,
      paymentMethod: 'credit',
      status: 'completed',
      reference: 'INV-2024-001',
      attachments: ['invoice.pdf'],
    },
    // Add more mock transactions as needed
  ]);

  // Keyboard navigation
  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    items: transactions,
    onSelect: (index) => toggleTransactionSelection(transactions[index].id),
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = activeTab === 'all' || transaction.type === activeTab;

      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, activeTab]);

  const toggleTransactionSelection = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleExport = async () => {
    const dataToExport = selectedTransactions.length
      ? transactions.filter(transaction => selectedTransactions.includes(transaction.id))
      : transactions;

    await exportData(dataToExport, {
      filename: `transactions-${new Date().toISOString().split('T')[0]}`,
      format: exportFormat,
    });
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetIncome = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <div className={`h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-fadeIn">
            <h1 className={`text-2xl font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Accounting
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search transactions..."
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
                New Transaction
              </button>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Total Income
                </h3>
                <TrendingUp className={isDarkMode ? 'text-green-400' : 'text-green-500'} size={20} />
              </div>
              <p className={`mt-2 text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${getTotalIncome().toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Total Expenses
                </h3>
                <TrendingDown className={isDarkMode ? 'text-red-400' : 'text-red-500'} size={20} />
              </div>
              <p className={`mt-2 text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${getTotalExpenses().toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Net Income
                </h3>
                <DollarSign className={isDarkMode ? 'text-blue-400' : 'text-blue-500'} size={20} />
              </div>
              <p className={`mt-2 text-2xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${getNetIncome().toFixed(2)}
              </p>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
                    className={`w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-200'
                    }`}
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Type Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {(['all', 'income', 'expense'] as const).map((tab) => (
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

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
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
                          checked={selectedTransactions.includes(transaction.id)}
                          onChange={() => toggleTransactionSelection(transaction.id)}
                          className={`h-4 w-4 rounded ${
                            isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}
                        />
                        <h3 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {transaction.description}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income'
                            ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                            : isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {transaction.category}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {transaction.reference}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-lg font-semibold ${
                        transaction.type === 'income'
                          ? isDarkMode ? 'text-green-400' : 'text-green-600'
                          : isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                      {transaction.paymentMethod === 'credit' && <CreditCard size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />}
                      {transaction.paymentMethod === 'cash' && <DollarSign size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                    {transaction.attachments.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Receipt size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {transaction.attachments.length} attachments
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting; 