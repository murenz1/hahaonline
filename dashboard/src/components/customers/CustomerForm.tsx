import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Customer } from '../../store/slices/customersSlice';
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '../../store/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  Save,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSuccess,
  onCancel
}) => {
  const { isDarkMode } = useTheme();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [newTag, setNewTag] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isEditing = !!customer;
  const isLoading = isCreating || isUpdating;

  const emptyAddress = {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  };

  const [formData, setFormData] = useState<Partial<Customer>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    addresses: [emptyAddress],
    tags: [],
    marketingPreferences: {
      email: false,
      sms: false,
      phone: false
    },
    notes: '',
    totalOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    const newAddresses = [...(formData.addresses || [])];
    if (!newAddresses[index]) {
      newAddresses[index] = { ...emptyAddress };
    }
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), { ...emptyAddress }]
    }));
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...(formData.addresses || [])];
    newAddresses.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  const handleMarketingPreferenceChange = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      marketingPreferences: {
        ...(prev.marketingPreferences || {}),
        [key]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && customer) {
        await updateCustomer({
          id: customer.id,
          ...formData
        }).unwrap();
      } else {
        await createCustomer(formData as Omit<Customer, 'id'>).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  return (
    <div className={cn(
      "rounded-lg transition-colors duration-200 p-6",
      isDarkMode
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
    )}>
      <h2 className={cn(
        "text-xl font-semibold mb-6",
        isDarkMode ? 'text-white' : 'text-gray-900'
      )}>
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className={cn(
            "p-4 rounded-lg",
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          )}>
            <h3 className={cn(
              "text-lg font-medium mb-4",
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            )}>
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  First Name*
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  leftIcon={<User className="h-4 w-4" />}
                  className={formErrors.firstName ? 'border-red-500' : ''}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Last Name*
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  leftIcon={<User className="h-4 w-4" />}
                  className={formErrors.lastName ? 'border-red-500' : ''}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Email*
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  leftIcon={<Mail className="h-4 w-4" />}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Phone*
                </label>
                <Input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  leftIcon={<Phone className="h-4 w-4" />}
                  className={formErrors.phone ? 'border-red-500' : ''}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Status
                </label>
                <Select
                  value={formData.status || 'active'}
                  onChange={(value) => handleSelectChange('status', value)}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Blocked', value: 'blocked' }
                  ]}
                />
              </div>
              
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange(e as any)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  )}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className={cn(
            "p-4 rounded-lg",
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          )}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={cn(
                "text-lg font-medium",
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              )}>
                Address Information
              </h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddAddress}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Address
              </Button>
            </div>
            
            <div className="space-y-6">
              {formData.addresses?.map((address, index) => (
                <div key={index} className="space-y-4 border-b pb-4 border-gray-200 dark:border-gray-600 last:border-0">
                  <div className="flex justify-between items-center">
                    <h4 className={cn(
                      "text-sm font-medium",
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Address {index + 1}
                    </h4>
                    {formData.addresses && formData.addresses.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveAddress(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <label className={cn(
                      "block text-sm font-medium mb-1",
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Street
                    </label>
                    <Input
                      value={address.street || ''}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      leftIcon={<MapPin className="h-4 w-4" />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        City
                      </label>
                      <Input
                        value={address.city || ''}
                        onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        State
                      </label>
                      <Input
                        value={address.state || ''}
                        onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Country
                      </label>
                      <Input
                        value={address.country || ''}
                        onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      )}>
                        Zip Code
                      </label>
                      <Input
                        value={address.zipCode || ''}
                        onChange={(e) => handleAddressChange(index, 'zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div className={cn(
            "p-4 rounded-lg",
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          )}>
            <h3 className={cn(
              "text-lg font-medium mb-4",
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            )}>
              Tags
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <Badge key={tag} variant="primary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {!formData.tags?.length && (
                  <span className={cn(
                    "text-sm",
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    No tags added yet
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1"
                  leftIcon={<Tag className="h-4 w-4" />}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Marketing Preferences */}
          <div className={cn(
            "p-4 rounded-lg",
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          )}>
            <h3 className={cn(
              "text-lg font-medium mb-4",
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            )}>
              Marketing Preferences
            </h3>
            
            <div className="space-y-4">
              {formData.marketingPreferences && Object.entries(formData.marketingPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`marketing-${key}`}
                    checked={value}
                    onChange={(e) => handleMarketingPreferenceChange(key, e.target.checked)}
                    className={cn(
                      "h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500",
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    )}
                  />
                  <label
                    htmlFor={`marketing-${key}`}
                    className={cn(
                      "text-sm font-medium",
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Customer' : 'Create Customer'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
