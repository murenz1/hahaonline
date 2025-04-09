import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  Search,
  X,
} from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )} />
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearch}
        className={cn(
          "pl-9 pr-9",
          theme === 'dark' ? 'bg-[#1F2436]' : 'bg-white'
        )}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          onClick={handleClear}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}; 