import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { MoreVertical, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  subItems?: DropdownItem[];
  disabled?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  align?: 'start' | 'end';
  trigger?: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  align = 'end',
  trigger,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (item.subItems) {
      setActiveSubMenu(item.label);
    } else {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  const renderItems = (itemsToRender: DropdownItem[]) => (
    <div className="py-1">
      {itemsToRender.map((item, index) => (
        <div key={index}>
          <button
            className={cn(
              'flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !item.disabled && handleItemClick(item)}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span className="flex-1 text-left">{item.label}</span>
            {item.subItems && (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </button>
          {activeSubMenu === item.label && item.subItems && (
            <div className="absolute left-full top-0 mt-0 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              {renderItems(item.subItems)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative" ref={menuRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={className}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      )}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {renderItems(items)}
        </div>
      )}
    </div>
  );
}; 