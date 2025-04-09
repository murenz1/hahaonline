import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Search,
  Plus,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  Star,
  AlertTriangle
} from 'lucide-react';

interface CustomersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  type: 'regular' | 'vip' | 'new';
  lastOrder?: Date;
  notes?: string;
}

const Customers: React.FC<CustomersProps> = ({ searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useTheme();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data for customers
  const customers: Customer[] = [
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      joinDate: new Date('2023-01-15'),
      totalOrders: 25,
      totalSpent: 2499.99,
      status: 'active',
      type: 'vip',
      lastOrder: new Date('2024-03-10')
    },
    {
      id: 'CUST-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, USA',
      joinDate: new Date('2024-02-20'),
      totalOrders: 3,
      totalSpent: 299.99,
      status: 'active',
      type: 'new',
      lastOrder: new Date('2024-03-15')
    },
    {
      id: 'CUST-003',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, USA',
      joinDate: new Date('2023-06-10'),
      totalOrders: 0,
      totalSpent: 0,
      status: 'inactive',
      type: 'regular'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesType = filterType === 'all' || customer.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'vip':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'new':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Customers</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage your customer relationships
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {/* Type Filter */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Types</option>
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
            <option value="new">New</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <button
          className={cn(
            "flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>

        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "px-4 py-2 rounded-lg font-medium",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <User className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-gray-200" : "text-gray-900")}>No customers found</h3>
          <p className={cn("mt-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={cn("min-w-full divide-y", isDarkMode ? "divide-gray-700" : "divide-gray-200")}>
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Orders</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Spent</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white")}>
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id}
                  className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      )}>
                        {getCustomerTypeIcon(customer.type)}
                      </div>
                      <div className="ml-4">
                        <div className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>{customer.name}</div>
                        <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{customer.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(customer.status)
                    )}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {customer.totalOrders} orders
                    </div>
                    {customer.lastOrder && (
                      <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Last order: {customer.lastOrder.toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      ${customer.totalSpent.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mx-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mx-1">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers; 