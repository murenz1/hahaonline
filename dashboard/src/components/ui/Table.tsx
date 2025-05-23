import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom text-sm',
            isDarkMode ? 'text-gray-200' : 'text-gray-900',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = 'Table';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <thead
        ref={ref}
        className={cn(
          isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700',
          className
        )}
        {...props}
      />
    );
  }
);
TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <tbody
        ref={ref}
        className={cn(
          isDarkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200',
          'divide-y',
          className
        )}
        {...props}
      />
    );
  }
);
TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <tr
        ref={ref}
        className={cn(
          isDarkMode 
            ? 'border-gray-700 hover:bg-gray-800/50' 
            : 'border-gray-200 hover:bg-gray-50',
          'transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-left align-middle font-medium',
          isDarkMode ? 'text-gray-300' : 'text-gray-700',
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    return (
      <td
        ref={ref}
        className={cn(
          'p-4 align-middle',
          isDarkMode ? 'text-gray-300' : 'text-gray-700',
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = 'TableCell';
