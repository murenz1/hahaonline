import React, { useEffect, useRef } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SearchSuggestionsProps {
  query: string;
  suggestions: Array<{
    type: 'customer' | 'order' | 'recent';
    text: string;
    value: string;
  }>;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  onSelect,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!query || !suggestions.length) return null;

  return (
    <div
      ref={ref}
      className={`absolute left-0 right-0 mt-2 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-200 animate-slideDown ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      <div className="p-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion.value)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              {suggestion.type === 'customer' ? (
                <Search size={16} className="mr-2 opacity-50" />
              ) : (
                <ArrowUpRight size={16} className="mr-2 opacity-50" />
              )}
              <span className="flex-1">{suggestion.text}</span>
              {suggestion.type === 'recent' && (
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Recent
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions; 