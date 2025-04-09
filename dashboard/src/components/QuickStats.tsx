import React from 'react';
import { Button } from './ui/Button';
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../hooks/useTheme';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export const QuickStats: React.FC = () => {
  const { theme } = useTheme();

  const stats: StatCard[] = [
    {
      title: 'Total Customers',
      value: '2,420',
      change: '+20%',
      icon: <Users className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />,
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: '$45,200',
      change: '+12.5%',
      icon: <DollarSign className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />,
      trend: 'up',
    },
    {
      title: 'Orders',
      value: '1,210',
      change: '-3.2%',
      icon: <ShoppingCart className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} />,
      trend: 'down',
    },
    {
      title: 'Growth Rate',
      value: '15.2%',
      change: '+4.5%',
      icon: <TrendingUp className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />,
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "rounded-lg p-6 transition-colors duration-200",
            theme === 'dark'
              ? 'bg-[#161926] border border-[#1F2436]'
              : 'bg-white hover:bg-gray-50'
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn(
              "p-2 rounded-lg",
              theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-100'
            )}>
              {stat.icon}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                  : 'text-gray-700 hover:text-gray-900'
              )}
            >
              <span className="sr-only">View details for {stat.title}</span>
              {stat.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="mt-4">
            <h3 className={cn(
              "text-sm font-medium",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {stat.title}
            </h3>
            <div className="flex items-baseline mt-2">
              <p className={cn(
                "text-2xl font-semibold",
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              )}>
                {stat.value}
              </p>
              <span className={cn(
                "ml-2 text-sm",
                stat.trend === 'up'
                  ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  : theme === 'dark' ? 'text-red-400' : 'text-red-600'
              )}>
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 