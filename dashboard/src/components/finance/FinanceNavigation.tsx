import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import {
  Home,
  BarChart2,
  FileText,
  CreditCard,
  Calculator,
  DollarSign,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/finance/dashboard',
    label: 'Financial Dashboard',
    icon: <Home className="w-5 h-5" />,
    description: 'Overview of financial metrics and performance',
  },
  {
    path: '/finance/invoices',
    label: 'Invoice Management',
    icon: <FileText className="w-5 h-5" />,
    description: 'Manage and track invoices',
  },
  {
    path: '/finance/expenses',
    label: 'Expense Management',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Track and manage expenses',
  },
  {
    path: '/finance/budgets',
    label: 'Budget Management',
    icon: <BarChart2 className="w-5 h-5" />,
    description: 'Create and monitor budgets',
  },
  {
    path: '/finance/taxes',
    label: 'Tax Management',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Handle tax calculations and compliance',
  },
  {
    path: '/finance/reports',
    label: 'Financial Reports',
    icon: <FileText className="w-5 h-5" />,
    description: 'Generate and view financial reports',
  },
  {
    path: '/finance/payments',
    label: 'Payment Processing',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Process and manage payments',
  },
  {
    path: '/finance/settings',
    label: 'Finance Settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Configure finance settings',
  },
];

export const FinanceNavigation: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Finance Management
        </h1>
        <Button variant="outline">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "rounded-lg border p-4 transition-colors",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white',
              location.pathname === item.path
                ? theme === 'dark'
                  ? 'border-blue-500 bg-blue-900/20'
                  : 'border-blue-500 bg-blue-50'
                : 'hover:border-blue-500'
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "p-2 rounded-full",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
                location.pathname === item.path
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-600'
              )}>
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.label}</h3>
            </div>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}; 