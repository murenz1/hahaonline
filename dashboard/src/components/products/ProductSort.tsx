import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface ProductSortProps {
  onSort: (sort: { by: string; direction: 'asc' | 'desc' }) => void;
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stock', label: 'Stock' },
  { value: 'createdAt', label: 'Date Added' },
];

export const ProductSort: React.FC<ProductSortProps> = ({
  onSort,
}) => {
  const { theme } = useTheme();
  const [sortBy, setSortBy] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSort({ by: value, direction: sortDirection });
  };

  const handleDirectionChange = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    onSort({ by: sortBy, direction: newDirection });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={sortBy}
        onValueChange={handleSortChange}
      >
        <Select.Trigger className="w-[180px]">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {sortOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDirectionChange}
        className="flex-shrink-0"
      >
        {sortDirection === 'asc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}; 