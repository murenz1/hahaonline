import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { Transaction } from '../../services/financeService';

interface TransactionStatsProps {
  transactions: Transaction[];
  dateRange: 'all' | '7d' | '30d' | '90d';
}

const TransactionStats: React.FC<TransactionStatsProps> = ({
  transactions,
  dateRange
}) => {
  const { isDarkMode } = useTheme();

  const stats = useMemo(() => {
    const now = new Date();
    const startDate = dateRange === 'all' ? undefined : new Date(now.setDate(now.getDate() - parseInt(dateRange)));

    const filteredTransactions = startDate
      ? transactions.filter(t => new Date(t.createdAt) >= startDate)
      : transactions;

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = income - expenses;

    const totalTransactions = filteredTransactions.length;

    return {
      income,
      expenses,
      profit,
      totalTransactions
    };
  }, [transactions, dateRange]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, trend }: {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div className={cn(
      "p-6 rounded-lg",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )} />
          </div>
          <div>
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-2xl font-semibold mt-1",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {value}
            </p>
          </div>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={formatAmount(stats.income)}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={formatAmount(stats.expenses)}
          icon={DollarSign}
          trend="down"
        />
        <StatCard
          title="Net Profit"
          value={formatAmount(stats.profit)}
          icon={DollarSign}
          trend={stats.profit >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toString()}
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn(
          "p-6 rounded-lg",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Transaction Types
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Income
              </span>
              <span className={cn(
                "text-sm font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {formatAmount(stats.income)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Expenses
              </span>
              <span className={cn(
                "text-sm font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {formatAmount(stats.expenses)}
              </span>
            </div>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-lg",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Date Range
          </h3>
          <div className="space-y-3">
            <div>
              <span className={cn(
                "text-sm font-medium block",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                From
              </span>
              <span className={cn(
                "text-sm font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {dateRange === 'all' ? 'All time' : dateRange}
              </span>
            </div>
            <div>
              <span className={cn(
                "text-sm font-medium block",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Total Transactions
              </span>
              <span className={cn(
                "text-sm font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {stats.totalTransactions}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats; 