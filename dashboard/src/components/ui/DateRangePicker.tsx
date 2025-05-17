import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { start: Date | null; end: Date | null }) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className,
}) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onChange({ start: null, end: endDate });
      return;
    }
    
    const newStartDate = new Date(e.target.value);
    onChange({ start: newStartDate, end: endDate });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onChange({ start: startDate, end: null });
      return;
    }
    
    const newEndDate = new Date(e.target.value);
    onChange({ start: startDate, end: newEndDate });
  };

  const clearDates = () => {
    onChange({ start: null, end: null });
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex items-center px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          isDarkMode 
            ? "bg-gray-700 border-gray-600 text-white" 
            : "bg-white border-gray-300 text-gray-900",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className={cn(
          "h-4 w-4 mr-2",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )} />
        <span>
          {startDate || endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : "Select date range"}
        </span>
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-10 mt-1 p-4 rounded-md shadow-lg",
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        )}>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className={cn(
                "text-sm font-medium mb-1",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={handleStartDateChange}
                className={cn(
                  "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                )}
              />
            </div>
            
            <div className="flex flex-col">
              <label className={cn(
                "text-sm font-medium mb-1",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                End Date
              </label>
              <input
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={handleEndDateChange}
                min={startDate ? startDate.toISOString().split('T')[0] : ''}
                className={cn(
                  "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                )}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={clearDates}
                className={cn(
                  "px-3 py-2 text-sm rounded-md",
                  isDarkMode 
                    ? "text-gray-300 hover:bg-gray-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-3 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
