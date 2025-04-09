import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Product } from '../../store/slices/productsSlice';
import { ProductCard } from './ProductCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ProductFilter } from './ProductFilter';
import { ProductSort } from './ProductSort';
import { ProductSearch } from './ProductSearch';
import {
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onMore: (product: Product) => void;
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  onSort: (sort: { by: string; direction: 'asc' | 'desc' }) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onView,
  onAddToCart,
  onAddToWishlist,
  onMore,
  onSearch,
  onFilter,
  onSort,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  viewMode,
  onViewModeChange,
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <ProductSearch onSearch={onSearch} />
          <ProductFilter onFilter={onFilter} />
          <ProductSort onSort={onSort} />
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === 'grid'
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={onView}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onMore={onMore}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            Items per page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <Select.Trigger className="w-[70px]">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="12">12</Select.Item>
              <Select.Item value="24">24</Select.Item>
              <Select.Item value="36">36</Select.Item>
              <Select.Item value="48">48</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 