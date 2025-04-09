import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { useGetProductsQuery } from '../../store/api';
import { Product } from '../../store/slices/productsSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Edit2,
  Package,
  Tag,
  DollarSign,
  Box,
  Scale,
  Ruler,
} from 'lucide-react';

const statusColors = {
  active: 'success',
  draft: 'secondary',
  archived: 'destructive',
} as const;

export const ProductsList: React.FC = () => {
  const { theme } = useTheme();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [inStock, setInStock] = React.useState<boolean | null>(null);
  const [sortBy, setSortBy] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit,
    search,
    category,
    brand,
    status,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    inStock,
    sortBy,
    sortDirection,
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleStockChange = (value: string) => {
    setInStock(value === 'inStock' ? true : value === 'outOfStock' ? false : null);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Error loading products
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg transition-colors duration-200",
      theme === 'dark'
        ? 'bg-[#161926] border border-[#1F2436]'
        : 'bg-white border border-gray-200'
    )}>
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )} />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={handleStatusChange}
          >
            <Select.Trigger>
              <Select.Value placeholder="Status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All Statuses</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="draft">Draft</Select.Item>
              <Select.Item value="archived">Archived</Select.Item>
            </Select.Content>
          </Select>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={inStock === true ? 'inStock' : inStock === false ? 'outOfStock' : ''}
            onValueChange={handleStockChange}
          >
            <Select.Trigger>
              <Select.Value placeholder="Stock Status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All Stock</Select.Item>
              <Select.Item value="inStock">In Stock</Select.Item>
              <Select.Item value="outOfStock">Out of Stock</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Product
                  {sortBy === 'name' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </div>
              </Table.Head>
              <Table.Head
                className="cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category
                  {sortBy === 'category' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </div>
              </Table.Head>
              <Table.Head
                className="cursor-pointer"
                onClick={() => handleSort('brand')}
              >
                <div className="flex items-center gap-1">
                  Brand
                  {sortBy === 'brand' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </div>
              </Table.Head>
              <Table.Head
                className="cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-1">
                  Price
                  {sortBy === 'price' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </div>
              </Table.Head>
              <Table.Head
                className="cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center gap-1">
                  Stock
                  {sortBy === 'stock' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </div>
              </Table.Head>
              <Table.Head
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortBy === 'status' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    <ChevronsUpDown className="w-4 h-4" />
                  )}
                </div>
              </Table.Head>
              <Table.Head>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.products.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-md flex items-center justify-center",
                      theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-100'
                    )}>
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className={cn(
                          "w-5 h-5",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )} />
                      )}
                    </div>
                    <div>
                      <div className={cn(
                        "font-medium",
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      )}>
                        {product.name}
                      </div>
                      <div className={cn(
                        "text-sm",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        SKU: {product.sku}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn(
                    "flex items-center gap-2",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <Tag className="w-4 h-4" />
                    {product.category}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn(
                    "flex items-center gap-2",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <Box className="w-4 h-4" />
                    {product.brand}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn(
                    "flex items-center gap-2",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <DollarSign className="w-4 h-4" />
                    ${product.variants.reduce((min, variant) => Math.min(min, variant.price), Infinity).toFixed(2)}
                    {product.variants.length > 1 && (
                      <span className="text-xs">
                        - ${product.variants.reduce((max, variant) => Math.max(max, variant.price), 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className={cn(
                    "flex items-center gap-2",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    <Scale className="w-4 h-4" />
                    {product.variants.reduce((total, variant) => total + variant.stock, 0)}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={statusColors[product.status]}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Navigate to product details
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Navigate to edit product
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Show
            </span>
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <Select.Trigger className="w-20">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="10">10</Select.Item>
                <Select.Item value="25">25</Select.Item>
                <Select.Item value="50">50</Select.Item>
                <Select.Item value="100">100</Select.Item>
              </Select.Content>
            </Select>
            <span className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Page {page} of {data?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === data?.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 