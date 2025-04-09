import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Plus,
  Download,
  Search,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import { financeService } from '../../services/financeService';
import { Transaction, RevenueByPeriod, FinancialSummary } from '../../types';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import FinancialChart from './FinancialChart';
import TransactionDetails from './TransactionDetails';
import TransactionStats from './TransactionStats';

const Finance: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | '90d'>('30d');
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [revenueData, setRevenueData] = useState<RevenueByPeriod[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyNet: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    categoryTotals: {} as Record<string, number>
  });

  useEffect(() => {
    loadTransactions();
    // Process recurring transactions when component mounts
    const newTransactions = financeService.processRecurringTransactions();
    if (newTransactions.length > 0) {
      loadTransactions(); // Reload transactions if new ones were created
    }
  }, []);

  useEffect(() => {
    updateRevenueData();
  }, [transactions, dateRange, periodType]);

  useEffect(() => {
    updateStats();
  }, []);

  const loadTransactions = () => {
    const loadedTransactions = financeService.getTransactions();
    setTransactions(loadedTransactions);
  };

  const updateRevenueData = () => {
    const periods = dateRange === 'all' ? 12 : parseInt(dateRange);
    const data = financeService.getRevenueByPeriod(periodType, periods);
    setRevenueData(data);
  };

  const updateStats = () => {
    const newStats = financeService.getTransactionStats();
    setStats(newStats);
  };

  const handleTransactionSubmit = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTransaction) {
      financeService.updateTransaction(selectedTransaction.id, data);
    } else {
      financeService.addTransaction(data);
    }
    loadTransactions();
    setShowTransactionForm(false);
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      financeService.deleteTransaction(id);
      loadTransactions();
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const exportFinancialReport = () => {
    const summary = financeService.getFinancialSummary();
    const reportData = {
      summary,
      revenueByPeriod: revenueData,
      transactions
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    className?: string;
  }> = ({ title, value, icon, trend, trendLabel, className }) => (
    <div className={cn(
      "p-6 rounded-lg",
      "bg-white dark:bg-gray-800",
      "border dark:border-gray-700",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-semibold">{value}</span>
        {trend !== undefined && (
          <span className={cn(
            "ml-2 text-sm",
            trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
            {trendLabel && <span className="text-gray-500 dark:text-gray-400 ml-1">{trendLabel}</span>}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-bold",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Finance Management
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTransactionForm(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white",
              "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
          <button
            onClick={exportFinancialReport}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium",
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <TransactionStats
        transactions={filteredTransactions}
        dateRange={dateRange}
      />

      {/* Chart */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Financial Overview
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className={cn(
                "px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              )}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'all' | '7d' | '30d' | '90d')}
              className={cn(
                "px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              )}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        <FinancialChart
          data={revenueData}
          periodType={periodType}
        />
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Transactions
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:flex-none md:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none",
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                )}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className={cn(
                "px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              )}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed' | 'failed')}
              className={cn(
                "px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none",
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              )}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className={cn(
                "text-xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <button
                onClick={() => {
                  setShowTransactionForm(false);
                  setSelectedTransaction(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <TransactionForm
              onSubmit={handleTransactionSubmit}
              initialData={selectedTransaction || undefined}
              onCancel={() => {
                setShowTransactionForm(false);
                setSelectedTransaction(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Total Balance"
          value={`$${stats.netIncome.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={stats.monthlyNet > 0 ? 5.3 : -5.3}
          trendLabel="vs last month"
        />
        <StatCard
          title="Monthly Income"
          value={`$${stats.monthlyIncome.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5" />}
          className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${stats.monthlyExpenses.toFixed(2)}`}
          icon={<TrendingDown className="w-5 h-5" />}
          className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900"
        />
        <StatCard
          title="Pending Transactions"
          value={stats.pendingTransactions.toString()}
          icon={<Clock className="w-5 h-5" />}
          className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900"
        />
      </div>

      {stats.failedTransactions > 0 && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5" />
          <span>You have {stats.failedTransactions} failed transaction{stats.failedTransactions > 1 ? 's' : ''}. Please review them.</span>
        </div>
      )}
    </div>
  );
};

export default Finance; 