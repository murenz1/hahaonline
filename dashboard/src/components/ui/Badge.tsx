import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    
    const variantStyles = {
      default: isDarkMode 
        ? 'bg-gray-700 text-gray-300' 
        : 'bg-gray-100 text-gray-800',
      primary: isDarkMode 
        ? 'bg-blue-900/20 text-blue-300' 
        : 'bg-blue-100 text-blue-800',
      secondary: isDarkMode 
        ? 'bg-purple-900/20 text-purple-300' 
        : 'bg-purple-100 text-purple-800',
      success: isDarkMode 
        ? 'bg-green-900/20 text-green-300' 
        : 'bg-green-100 text-green-800',
      warning: isDarkMode 
        ? 'bg-yellow-900/20 text-yellow-300' 
        : 'bg-yellow-100 text-yellow-800',
      danger: isDarkMode 
        ? 'bg-red-900/20 text-red-300' 
        : 'bg-red-100 text-red-800',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
