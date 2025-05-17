import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
} from 'lucide-react';

type CustomerStatus = 'active' | 'inactive' | 'blocked';

const statusColors: Record<CustomerStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
  blocked: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
};

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    status: 'active' as CustomerStatus,
    addresses: [
      {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001'
      }
    ],
    totalOrders: 25,
    totalSpent: 2499.99,
    lastOrderDate: '2024-03-10T00:00:00Z',
    notes: 'Loyal customer',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    marketingPreferences: {
      email: true,
      sms: true,
      phone: false
    },
    tags: ['vip', 'loyal']
  },
  {
    id: 'CUST-002',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1 (555) 234-5678',
    status: 'active' as CustomerStatus,
    addresses: [
      {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        zipCode: '90001'
      }
    ],
    totalOrders: 3,
    totalSpent: 299.99,
    lastOrderDate: '2024-03-15T00:00:00Z',
    notes: 'New customer',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    marketingPreferences: {
      email: true,
      sms: false,
      phone: false
    },
    tags: ['new']
  },
  {
    id: 'CUST-003',
    email: 'robert.j@example.com',
    firstName: 'Robert',
    lastName: 'Johnson',
    phone: '+1 (555) 345-6789',
    status: 'inactive' as CustomerStatus,
    addresses: [
      {
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        zipCode: '60007'
      }
    ],
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
    notes: 'Inactive account',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2023-06-10T00:00:00Z',
    marketingPreferences: {
      email: false,
      sms: false,
      phone: false
    },
    tags: ['inactive']
  }
];

interface CustomersListProps {
  onViewCustomer: (customerId: string) => void;
  onEditCustomer: (customerId: string) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer
}) => {
  const { isDarkMode } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // In a real application, we would use the API query
  // const { data, isLoading, error } = useGetCustomersQuery({
  //   page,
  //   limit,
  //   search,
  //   status: selectedStatus,
  //   tags: selectedTags.join(','),
  //   startDate: dateRange.start ? dateRange.start.toISOString() : undefined,
  //   endDate: dateRange.end ? dateRange.end.toISOString() : undefined,
  //   sortField,
  //   sortDirection,
  // });

  // For now, use mock data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and sort the mock data
  const filteredCustomers = mockCustomers.filter(customer => {
    // Filter by search term
    const searchLower = search.toLowerCase();
    const matchesSearch = search === '' || 
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower);
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    // Filter by tags
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => customer.tags.includes(tag));
    
    // Filter by date range
    const createdDate = new Date(customer.createdAt);
    const matchesDateRange = 
      (!dateRange.start || createdDate >= dateRange.start) &&
      (!dateRange.end || createdDate <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesTags && matchesDateRange;
  }).sort((a, b) => {
    // Sort by selected field
    let aValue: any = a[sortField as keyof Customer];
    let bValue: any = b[sortField as keyof Customer];
    
    // Handle nested fields or special cases
    if (sortField === 'name') {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    }
    
    // Handle date fields
    if (typeof aValue === 'string' && (aValue.includes('T') || aValue.includes('-'))) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Paginate the results
  const paginatedCustomers = filteredCustomers.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredCustomers.length / limit);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
      isDarkMode
        ? 'bg-gray-800 border border-gray-700'
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
              value={selectedStatus}
              onChange={handleStatusChange}
              options={[
                { label: 'All', value: 'all' },
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
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
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
                onClick={() => handleSort('lastName')}
                className="font-semibold"
              >
                Customer
                {sortField === 'lastName' && (
                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1 inline" /> : <SortDesc className="h-4 w-4 ml-1 inline" />
                )}
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('totalOrders')}
                className="font-semibold"
              >
                Orders
                {sortField === 'totalOrders' && (
                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1 inline" /> : <SortDesc className="h-4 w-4 ml-1 inline" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('totalSpent')}
                className="font-semibold"
              >
                Total Spent
                {sortField === 'totalSpent' && (
                  sortDirection === 'asc' ? <SortAsc className="h-4 w-4 ml-1 inline" /> : <SortDesc className="h-4 w-4 ml-1 inline" />
                )}
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  )}>
                    <User className={cn(
                      "w-4 h-4",
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    )} />
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium",
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    )}>
                      {customer.firstName} {customer.lastName}
                    </div>
                    <div className={cn(
                      "text-sm",
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
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
                <Badge variant={customer.status === 'active' ? 'success' : 
                              customer.status === 'inactive' ? 'secondary' : 'danger'}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewCustomer(customer.id)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onEditCustomer(customer.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => onDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, filteredCustomers.length)} of {filteredCustomers.length} results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className={cn(
              "text-sm px-2",
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
