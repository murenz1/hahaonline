import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';
import {
  ShoppingCart,
  UserPlus,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'order' | 'customer' | 'payment' | 'product' | 'alert';
  title: string;
  description: string;
  status: 'success' | 'pending' | 'error';
  timestamp: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order #1234',
    description: 'John Doe placed an order for $299.99',
    status: 'success',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    type: 'customer',
    title: 'New Customer',
    description: 'Jane Smith created an account',
    status: 'success',
    timestamp: '15 minutes ago',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: 'Payment of $150.00 received for Order #1232',
    status: 'success',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'product',
    title: 'Low Stock Alert',
    description: 'Product "Gaming Mouse" is running low on stock',
    status: 'pending',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    type: 'alert',
    title: 'Failed Payment',
    description: 'Payment for Order #1230 failed',
    status: 'error',
    timestamp: '3 hours ago',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return ShoppingCart;
    case 'customer':
      return UserPlus;
    case 'payment':
      return DollarSign;
    case 'product':
      return Package;
    case 'alert':
      return AlertTriangle;
  }
};

const getStatusIcon = (status: Activity['status']) => {
  switch (status) {
    case 'success':
      return CheckCircle;
    case 'pending':
      return Clock;
    case 'error':
      return XCircle;
  }
};

const getStatusColor = (status: Activity['status'], isDark: boolean) => {
  switch (status) {
    case 'success':
      return isDark ? 'text-emerald-400' : 'text-emerald-600';
    case 'pending':
      return isDark ? 'text-amber-400' : 'text-amber-600';
    case 'error':
      return isDark ? 'text-red-400' : 'text-red-600';
  }
};

export const RecentActivity: React.FC = () => {
  const { theme } = useTheme();

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
        Recent Activity
      </h2>
      <div className="space-y-4">
        {mockActivities.map((activity) => {
          const ActivityIcon = getActivityIcon(activity.type);
          const StatusIcon = getStatusIcon(activity.status);
          const statusColor = getStatusColor(activity.status, theme === 'dark');

          return (
            <div
              key={activity.id}
              className={cn(
                "p-4 rounded-lg transition-colors duration-200",
                theme === 'dark'
                  ? 'bg-[#1F2436] hover:bg-[#2A2F41]'
                  : 'bg-gray-50 hover:bg-gray-100'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  theme === 'dark' ? 'bg-[#2A2F41]' : 'bg-gray-100'
                )}>
                  <ActivityIcon className={cn(
                    "h-5 w-5",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn(
                      "font-medium truncate",
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    )}>
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("h-5 w-5", statusColor)} />
                      <span className={cn(
                        "text-sm",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className={cn(
                    "text-sm mt-1",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 