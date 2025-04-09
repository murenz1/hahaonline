import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  CreditCard,
  DollarSign,
  Calendar,
  User,
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
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface PaymentsProps {}

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'chargeback';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  customer: string;
  paymentMethod: string;
  date: Date;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

const Payments: React.FC<PaymentsProps> = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: 'TRX-001',
      type: 'payment',
      amount: 299.99,
      currency: 'USD',
      status: 'completed',
      customer: 'John Doe',
      paymentMethod: 'Visa ending in 4242',
      date: new Date('2024-03-15T10:30:00'),
      description: 'Premium Plan Subscription'
    },
    {
      id: 'TRX-002',
      type: 'refund',
      amount: 49.99,
      currency: 'USD',
      status: 'completed',
      customer: 'Jane Smith',
      paymentMethod: 'Mastercard ending in 5555',
      date: new Date('2024-03-15T09:45:00'),
      description: 'Product Return - Order #12345'
    },
    {
      id: 'TRX-003',
      type: 'payment',
      amount: 149.99,
      currency: 'USD',
      status: 'pending',
      customer: 'Robert Johnson',
      paymentMethod: 'PayPal',
      date: new Date('2024-03-15T09:30:00'),
      description: 'Basic Plan Subscription'
    }
  ];

  // Mock payment methods data
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'PM-001',
      type: 'card',
      name: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 'PM-002',
      type: 'card',
      name: 'Mastercard',
      last4: '5555',
      expiryDate: '08/24',
      isDefault: false
    },
    {
      id: 'PM-003',
      type: 'wallet',
      name: 'PayPal',
      last4: '',
      isDefault: false
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'refund':
        return <ArrowDownRight className="w-4 h-4 text-yellow-500" />;
      case 'chargeback':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Payments</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage payments and transactions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: '$12,458.99', trend: '+12.5%', icon: DollarSign },
          { label: 'Successful Payments', value: '156', trend: '+8.2%', icon: CheckCircle },
          { label: 'Failed Payments', value: '3', trend: '-2.1%', icon: XCircle },
          { label: 'Pending Payments', value: '8', trend: '+1.5%', icon: AlertTriangle }
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
                index === 2 ? "text-red-500" :
                "text-yellow-500"
              )} />
            </div>
            <p className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
              {stat.value}
            </p>
            <p className={cn(
              "text-sm",
              stat.trend.startsWith('+') ? "text-green-500" : "text-red-500"
            )}>
              {stat.trend} vs. last period
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
            placeholder="Search transactions..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Types</option>
            <option value="payment">Payments</option>
            <option value="refund">Refunds</option>
            <option value="chargeback">Chargebacks</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
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
          New Payment
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

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-gray-200" : "text-gray-900")}>No transactions found</h3>
          <p className={cn("mt-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={cn("min-w-full divide-y", isDarkMode ? "divide-gray-700" : "divide-gray-200")}>
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Transaction</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Method</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white")}>
              {filteredTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTransactionTypeIcon(transaction.type)}
                      <div className="ml-3">
                        <div className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                          {transaction.id}
                        </div>
                        <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {transaction.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {transaction.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn(
                      "text-sm font-medium",
                      transaction.type === 'payment' 
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {transaction.type === 'payment' ? '+' : '-'}
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(transaction.status)
                    )}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {transaction.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mx-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mt-8">
        <div className="mb-4 flex justify-between items-center">
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
            Payment Methods
          </h3>
          <button
            className={cn(
              "flex items-center px-4 py-2 rounded-lg text-sm font-medium",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "p-4 rounded-lg border",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      {method.name}
                    </h4>
                    {method.last4 && (
                      <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        •••• {method.last4}
                      </p>
                    )}
                  </div>
                </div>
                {method.isDefault && (
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded",
                    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                  )}>
                    Default
                  </span>
                )}
              </div>
              {method.expiryDate && (
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Expires: {method.expiryDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payments; 