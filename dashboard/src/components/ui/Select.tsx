import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, value, onChange, leftIcon, placeholder, ...props }, ref) => {
    const { isDarkMode } = useTheme();
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500',
            leftIcon && 'pl-10',
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900',
            className
          )}
          value={Array.isArray(value) ? value[0] : value}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className={cn(
            "h-4 w-4",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )} />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
