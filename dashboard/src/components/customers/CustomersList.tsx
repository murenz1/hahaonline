import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { useGetCustomersQuery } from '../../store/api';
import { Customer } from '../../store/slices/customersSlice';
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
import { Badge } from '../ui/Badge';
import { DateRangePicker } from '../ui/DateRangePicker';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  Mail,
  Search,
  SortAsc,
  SortDesc,
  Tag,
  User,
} from 'lucide-react';

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const CustomersList: React.FC = () => {
  const { theme } = useTheme();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [sort, setSort] = React.useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc',
  });

  const { data, isLoading, error } = useGetCustomersQuery({
    page,
    limit,
    search,
    status: status.join(','),
    tags: tags.join(','),
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
        Error loading customers
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
              placeholder="Search customers..."
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
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Blocked', value: 'blocked' },
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
                onClick={() => handleSort('lastName')}
                className="font-semibold"
              >
                Customer
                {sort.field === 'lastName' && (
                  sort.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                )}
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('totalOrders')}
                className="font-semibold"
              >
                Orders
                {sort.field === 'totalOrders' && (
                  sort.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('totalSpent')}
                className="font-semibold"
              >
                Total Spent
                {sort.field === 'totalSpent' && (
                  sort.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                )}
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.customers.map((customer: Customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-100'
                  )}>
                    <User className={cn(
                      "w-4 h-4",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )} />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium",
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    )}>
                      {customer.firstName} {customer.lastName}
                    </div>
                    <div className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {customer.phone}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
              <TableCell>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  statusColors[customer.status]
                )}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
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