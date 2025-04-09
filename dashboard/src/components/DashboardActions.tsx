import React from 'react';
import { Button } from './ui/Button';
import { DropdownMenu } from './ui/DropdownMenu';
import {
  Search,
  Filter,
  SortAsc,
  Download,
  Upload,
  MoreVertical,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../hooks/useTheme';

export const DashboardActions: React.FC = () => {
  const { theme } = useTheme();

  const menuItems = [
    {
      label: 'Export Data',
      onClick: () => {/* Handle export */},
    },
    {
      label: 'Import Data',
      onClick: () => {/* Handle import */},
    },
    {
      label: 'Refresh Data',
      onClick: () => {/* Handle refresh */},
    },
  ];

  return (
    <div className={cn(
      "rounded-lg p-4 transition-colors duration-200",
      theme === 'dark'
        ? 'bg-[#161926] border border-[#1F2436]'
        : 'bg-white border border-gray-200'
    )}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className={cn(
            "flex items-center rounded-lg px-3 transition-colors duration-200",
            theme === 'dark'
              ? 'bg-[#1F2436] text-gray-400'
              : 'bg-gray-100 text-gray-500'
          )}>
            <Search className="h-5 w-5" />
            <input
              type="text"
              placeholder="Search..."
              className={cn(
                "flex-1 px-3 py-2 bg-transparent outline-none text-sm",
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-700 hover:text-gray-900'
            )}
          >
            <Filter className="h-5 w-5" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-700 hover:text-gray-900'
            )}
          >
            <SortAsc className="h-5 w-5" />
            <span className="sr-only">Sort</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-700 hover:text-gray-900'
            )}
          >
            <Download className="h-5 w-5" />
            <span className="sr-only">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9",
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                : 'text-gray-700 hover:text-gray-900'
            )}
          >
            <Upload className="h-5 w-5" />
            <span className="sr-only">Import</span>
          </Button>
          <DropdownMenu
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9",
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-100 hover:bg-[#1F2436]'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More actions</span>
              </Button>
            }
            items={menuItems}
          />
        </div>
      </div>
    </div>
  );
}; 