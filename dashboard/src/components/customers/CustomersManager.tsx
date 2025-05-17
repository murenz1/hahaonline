import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { useGetCustomersQuery, useDeleteCustomerMutation } from '../../store/api';
import { Customer } from '../../store/slices/customersSlice';
import { CustomersList } from './CustomersList';
import { CustomerDetails } from './CustomerDetails';
import { CustomerForm } from './CustomerForm';
import { CustomerDelete } from './CustomerDelete';
import { Button } from '../ui/Button';
import { Plus, RefreshCw } from 'lucide-react';

enum ViewMode {
  LIST = 'list',
  DETAILS = 'details',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete'
}

export const CustomersManager: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Use mock data for now, but this will be replaced with the API call in production
  // const { data, isLoading, error, refetch } = useGetCustomersQuery({
  //   page,
  //   limit,
  //   search: searchTerm,
  // });
  
  // For development, we'll use the mock data from CustomersList
  const isLoading = false;
  const error = null;
  const refetch = () => console.log('Refetching customers...');
  
  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setViewMode(ViewMode.DETAILS);
  };
  
  const handleCreateCustomer = () => {
    setSelectedCustomerId(null);
    setViewMode(ViewMode.CREATE);
  };
  
  const handleEditCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setViewMode(ViewMode.EDIT);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setViewMode(ViewMode.DELETE);
  };
  
  const handleSuccess = () => {
    refetch();
    setViewMode(ViewMode.LIST);
    setSelectedCustomerId(null);
  };
  
  const handleCancel = () => {
    setViewMode(ViewMode.LIST);
    setSelectedCustomerId(null);
  };
  
  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.DETAILS:
        if (!selectedCustomerId) return null;
        return (
          <div>
            <div className="mb-4 flex items-center">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="mr-2"
              >
                Back to List
              </Button>
              <Button
                variant="outline"
                onClick={() => handleEditCustomer(selectedCustomerId)}
                className="mr-2"
              >
                Edit Customer
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteCustomer(selectedCustomerId)}
                className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Delete Customer
              </Button>
            </div>
            <CustomerDetails customerId={selectedCustomerId} />
          </div>
        );
        
      case ViewMode.CREATE:
        return (
          <div>
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
            <CustomerForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        );
        
      case ViewMode.EDIT:
        if (!selectedCustomerId) return null;
        // In a real app, we would fetch the customer data here
        // For now, we'll pass a mock customer
        const mockCustomer: Customer = {
          id: selectedCustomerId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          status: 'active',
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
        };
        
        return (
          <div>
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
            <CustomerForm
              customer={mockCustomer}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        );
        
      case ViewMode.DELETE:
        if (!selectedCustomerId) return null;
        // In a real app, we would fetch the customer data here
        // For now, we'll pass a mock customer
        const mockCustomerForDelete: Customer = {
          id: selectedCustomerId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          status: 'active',
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
        };
        
        return (
          <CustomerDelete
            customer={mockCustomerForDelete}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
        
      case ViewMode.LIST:
      default:
        return (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h1 className={cn(
                "text-2xl font-semibold",
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Customers
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={handleCreateCustomer}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>
            <CustomersList 
              onViewCustomer={handleViewCustomer}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          </div>
        );
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
      "p-6 rounded-lg transition-colors duration-200",
      isDarkMode
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    )}>
      {renderContent()}
    </div>
  );
};
