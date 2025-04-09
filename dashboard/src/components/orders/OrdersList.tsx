import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { useGetOrdersQuery } from '../../store/api';
import { Order } from '../../store/slices/ordersSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DateRangePicker } from '../ui/DateRangePicker';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  Search,
  SortAsc,
  SortDesc,
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export const OrdersList: React.FC = () => {
  const { theme } = useTheme();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [sort, setSort] = React.useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc',
  });

  const { data, isLoading, error } = useGetOrdersQuery({
    page,
    limit,
    search,
    status: status.join(','),
    startDate: dateRange.start?.toISOString(),
    endDate: dateRange.end?.toISOString(),
    sortBy: sort.field,
    sortDirection: sort.direction,
  });

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleStatusChange = (value: string) => {
    setStatus(prev => prev.includes(value)
      ? prev.filter(s => s !== value)
      : [...prev, value]
    );
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
        Error loading orders
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              placeholder="Status"
              value={status}
              onChange={handleStatusChange}
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Shipped', value: 'shipped' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Refunded', value: 'refunded' },
              ]}
              leftIcon={<Filter className="h-4 w-4" />}
            />
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={setDateRange}
            />
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('orderNumber')}
                className="font-semibold"
              >
                Order #
                {sort.field === 'orderNumber' && (
                  sort.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                )}
              </Button>
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('createdAt')}
                className="font-semibold"
              >
                Date
                {sort.field === 'createdAt' && (
                  sort.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                )}
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('total')}
                className="font-semibold"
              >
                Total
                {sort.field === 'total' && (
                  sort.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                )}
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.orders.map((order: Order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  statusColors[order.status]
                )}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={limit.toString()}
              onChange={(value) => setLimit(Number(value))}
              options={[
                { label: '10 per page', value: '10' },
                { label: '25 per page', value: '25' },
                { label: '50 per page', value: '50' },
                { label: '100 per page', value: '100' },
              ]}
            />
            <span className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.total || 0)} of {data?.total || 0} results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className={cn(
              "text-sm font-medium",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              Page {page} of {Math.ceil((data?.total || 0) / limit)}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page === Math.ceil((data?.total || 0) / limit)}
              onClick={() => setPage(prev => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === Math.ceil((data?.total || 0) / limit)}
              onClick={() => setPage(Math.ceil((data?.total || 0) / limit))}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 