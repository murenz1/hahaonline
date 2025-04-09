import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import {
  Filter,
  X,
} from 'lucide-react';

interface ProductFilterProps {
  onFilter: (filters: {
    category?: string;
    brand?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilter,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    category: '',
    brand: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const handleApplyFilters = () => {
    onFilter({
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      status: filters.status || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      inStock: filters.inStock || undefined,
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    });
    onFilter({});
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
      </Button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 w-80 p-4 rounded-lg shadow-lg z-50",
            theme === 'dark' ? 'bg-[#1F2436]' : 'bg-white',
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn(
              "font-medium",
              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
            )}>
              Filters
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={cn(
                "block text-sm font-medium mb-1",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select category" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="electronics">Electronics</Select.Item>
                  <Select.Item value="clothing">Clothing</Select.Item>
                  <Select.Item value="books">Books</Select.Item>
                  <Select.Item value="home">Home & Garden</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-1",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Brand
              </label>
              <Select
                value={filters.brand}
                onValueChange={(value) => setFilters({ ...filters, brand: value })}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select brand" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="samsung">Samsung</Select.Item>
                  <Select.Item value="sony">Sony</Select.Item>
                  <Select.Item value="lg">LG</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div>
              <label className={cn(
                "block text-sm font-medium mb-1",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select status" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="draft">Draft</Select.Item>
                  <Select.Item value="archived">Archived</Select.Item>
                </Select.Content>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="inStock"
                className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}
              >
                In Stock Only
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 