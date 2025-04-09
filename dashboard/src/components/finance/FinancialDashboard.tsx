import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  profitMargin: number;
  growthRate: number;
}

interface FinancialDashboardProps {
  metrics: FinancialMetrics;
  onPeriodChange: (period: string) => void;
  onExport: () => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  metrics,
  onPeriodChange,
  onExport,
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Financial Dashboard
        </h1>
        <div className="flex gap-2">
          <Select
            defaultValue="30"
            onValueChange={onPeriodChange}
          >
            <Select.Trigger>
              <Calendar className="w-4 h-4 mr-2" />
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="7">Last 7 Days</Select.Item>
              <Select.Item value="30">Last 30 Days</Select.Item>
              <Select.Item value="90">Last 90 Days</Select.Item>
              <Select.Item value="365">Last Year</Select.Item>
            </Select.Content>
          </Select>
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">${metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className={cn(
              "p-2 rounded-full",
              metrics.growthRate >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            )}>
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className={cn(
              "text-sm",
              metrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {metrics.growthRate >= 0 ? '+' : ''}{metrics.growthRate}% vs last period
            </span>
          </div>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <p className="text-2xl font-semibold">${metrics.netIncome.toLocaleString()}</p>
            </div>
            <div className={cn(
              "p-2 rounded-full",
              metrics.netIncome >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            )}>
              {metrics.netIncome >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Profit Margin: {metrics.profitMargin}%</span>
          </div>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cash Flow</p>
              <p className="text-2xl font-semibold">${metrics.cashFlow.toLocaleString()}</p>
            </div>
            <div className={cn(
              "p-2 rounded-full",
              metrics.cashFlow >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            )}>
              {metrics.cashFlow >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Operating Cash Flow</span>
          </div>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Accounts Receivable</p>
              <p className="text-2xl font-semibold">${metrics.accountsReceivable.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">Outstanding Invoices</span>
          </div>
        </div>
      </div>

      {/* Financial Statements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn(
          "rounded-lg border p-6",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <h2 className="text-lg font-semibold mb-4">Income Statement</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Revenue</span>
              <span className="font-medium">${metrics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expenses</span>
              <span className="font-medium">${metrics.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-semibold">Net Income</span>
              <span className={cn(
                "font-semibold",
                metrics.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                ${metrics.netIncome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className={cn(
          "rounded-lg border p-6",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <h2 className="text-lg font-semibold mb-4">Balance Sheet</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Accounts Receivable</span>
              <span className="font-medium">${metrics.accountsReceivable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Accounts Payable</span>
              <span className="font-medium">${metrics.accountsPayable.toLocaleString()}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-semibold">Net Working Capital</span>
              <span className={cn(
                "font-semibold",
                (metrics.accountsReceivable - metrics.accountsPayable) >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                ${(metrics.accountsReceivable - metrics.accountsPayable).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 