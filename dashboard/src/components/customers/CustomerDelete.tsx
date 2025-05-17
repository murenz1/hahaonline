import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Customer } from '../../store/slices/customersSlice';
import { useDeleteCustomerMutation } from '../../store/api';
import { Button } from '../ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface CustomerDeleteProps {
  customer: Customer;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CustomerDelete: React.FC<CustomerDeleteProps> = ({
  customer,
  onSuccess,
  onCancel
}) => {
  const { isDarkMode } = useTheme();
  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();
  const [confirmText, setConfirmText] = useState('');
  
  const handleDelete = async () => {
    try {
      await deleteCustomer(customer.id).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };
  
  const isConfirmed = confirmText === customer.email;
  
  return (
    <div className={cn(
      "rounded-lg transition-colors duration-200 p-6 max-w-md mx-auto",
      isDarkMode
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    )}>
      <div className="flex items-center justify-center mb-4 text-red-500">
        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6" />
        </div>
      </div>
      
      <h2 className={cn(
        "text-xl font-semibold text-center mb-4",
        isDarkMode ? 'text-white' : 'text-gray-900'
      )}>
        Delete Customer
      </h2>
      
      <p className={cn(
        "text-center mb-6",
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      )}>
        Are you sure you want to delete <strong>{customer.firstName} {customer.lastName}</strong>? 
        This action cannot be undone and all associated data will be permanently removed.
      </p>
      
      <div className="mb-6">
        <label className={cn(
          "block text-sm font-medium mb-2",
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        )}>
          To confirm, type <span className="font-mono">{customer.email}</span>
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className={cn(
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2",
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-red-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:ring-red-500'
          )}
          placeholder={customer.email}
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={!isConfirmed || isLoading}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Customer
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
