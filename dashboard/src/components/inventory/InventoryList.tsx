import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MoreVertical,
  Package,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface InventoryListProps {
  items: InventoryItem[];
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
  onViewItem: (item: InventoryItem) => void;
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  onSort: (sort: { by: string; direction: 'asc' | 'desc' }) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  items,
  onAddItem,
  onEditItem,
  onViewItem,
  onSearch,
  onFilter,
  onSort,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [sortBy, setSortBy] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilter({ ...selectedCategory, category: value });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilter({ ...selectedStatus, status: value });
  };

  const handleSort = (field: string) => {
    const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDirection(newDirection);
    onSort({ by: field, direction: newDirection });
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return <Badge variant="success">In Stock</Badge>;
      case 'low-stock':
        return <Badge variant="warning">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Inventory Management
        </h1>
        <Button onClick={onAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )} />
          <Input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={handleCategoryChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Category" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="electronics">Electronics</Select.Item>
            <Select.Item value="clothing">Clothing</Select.Item>
            <Select.Item value="books">Books</Select.Item>
            <Select.Item value="home">Home & Garden</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Status" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="in-stock">In Stock</Select.Item>
            <Select.Item value="low-stock">Low Stock</Select.Item>
            <Select.Item value="out-of-stock">Out of Stock</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "border-b",
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            )}>
              <th
                className="text-left py-3 px-4 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Name</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">SKU</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Category</span>
              </th>
              <th
                className="text-left py-3 px-4 cursor-pointer"
                onClick={() => handleSort('currentStock')}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Stock</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Location</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Status</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Last Updated</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-b",
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{item.sku}</td>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span>{item.currentStock}</span>
                    {item.currentStock <= item.minStock && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{item.location}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(item.status)}
                </td>
                <td className="py-3 px-4">{item.lastUpdated}</td>
                <td className="py-3 px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewItem(item)}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 