import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Store,
  Package,
  CreditCard,
  Truck,
  BarChart2,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  BrainCircuit,
  Shield,
  Smartphone
} from 'lucide-react';
import { Button } from './ui/Button';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'vendors', label: 'Vendors', icon: Store },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'support', label: 'Support', icon: MessageCircle },
  { id: 'ai', label: 'AI & Automation', icon: BrainCircuit },
  { id: 'security', label: 'Security', icon: Shield },
];

export const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <aside className={cn(
        "h-screen sticky top-0 flex flex-col transition-all duration-300",
        isCollapsed ? 'w-20' : 'w-64',
        theme === 'dark'
          ? 'bg-[#161926] border-r border-[#1F2436]'
          : 'bg-white border-r border-gray-200'
      )}>
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center px-6 border-b transition-colors duration-200",
          theme === 'dark' ? 'border-[#1F2436]' : 'border-gray-200'
        )}>
          <span className={cn(
            "font-bold transition-opacity duration-200",
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 text-xl',
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          )}>
            Dashboard
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  activeItem === item.id
                    ? theme === 'dark'
                      ? 'bg-[#1F2436] text-gray-100'
                      : 'bg-gray-100 text-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t transition-colors duration-200",
          theme === 'dark' ? 'border-[#1F2436]' : 'border-gray-200'
        )}>
          <button
            className={cn(
              "w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors duration-200 mb-2",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </button>
          <button
            className={cn(
              "w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors duration-200 mb-2",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <HelpCircle className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Help</span>}
          </button>
          <button
            className={cn(
              "w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed bottom-4 transition-all duration-300",
          isCollapsed ? 'left-24' : 'left-[17rem]',
          theme === 'dark'
            ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
            : 'text-gray-600 hover:text-gray-900'
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}; 