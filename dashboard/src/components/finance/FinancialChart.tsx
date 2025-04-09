import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface RevenueByPeriod {
  period: string;
  income: number;
  expenses: number;
  net: number;
}

interface FinancialChartProps {
  data: RevenueByPeriod[];
  periodType: 'daily' | 'weekly' | 'monthly';
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  periodType
}) => {
  const { isDarkMode } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={cn(
      "w-full h-[400px] p-4 rounded-lg",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="period"
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            formatter={(value: number) => [formatCurrency(value), 'Amount']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart; 