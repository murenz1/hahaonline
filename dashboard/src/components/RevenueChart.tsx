import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { useGetRevenueChartQuery } from '../store/api';
import { cn } from '../utils/cn';

interface RevenueChartProps {
  period: 'today' | 'week' | 'month' | 'year';
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ period }) => {
  const { theme } = useTheme();
  const { data, isLoading, error } = useGetRevenueChartQuery(period);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center text-red-500">
        Error loading revenue data
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 rounded-lg transition-colors duration-200",
      theme === 'dark'
        ? 'bg-[#161926] border border-[#1F2436]'
        : 'bg-white border border-gray-200'
    )}>
      <h2 className={cn(
        "text-xl font-semibold mb-6",
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      )}>
        Revenue Trends
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'dark' ? '#1F2436' : '#E5E7EB'}
            />
            <XAxis
              dataKey="date"
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            />
            <YAxis
              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2436' : '#FFFFFF',
                border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                borderRadius: '0.375rem',
              }}
              labelStyle={{
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
              }}
            />
            <Legend
              wrapperStyle={{
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              name="Revenue"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 