import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from '../../store/api';
import { Customer } from '../../store/slices/customersSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  Clock,
  ShoppingCart,
  DollarSign,
  Bell,
  Edit2,
  Save,
  X,
  Plus,
} from 'lucide-react';

interface CustomerDetailsProps {
  customerId: string;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customerId }) => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedCustomer, setEditedCustomer] = React.useState<Partial<Customer>>({});
  const [newTag, setNewTag] = React.useState('');

  const { data: customer, isLoading, error } = useGetCustomerByIdQuery(customerId);
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCustomer(customer || {});
  };

  const handleSave = async () => {
    try {
      await updateCustomer({ id: customerId, ...editedCustomer });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update customer:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCustomer({});
  };

  const handleAddTag = () => {
    if (newTag && customer?.tags && !customer.tags.includes(newTag)) {
      setEditedCustomer(prev => ({
        ...prev,
        tags: [...(prev.tags || customer?.tags || []), newTag],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedCustomer(prev => ({
      ...prev,
      tags: (prev.tags || customer?.tags || []).filter(t => t !== tag),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Error loading customer details
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-lg transition-colors duration-200",
      isDarkMode
        ? 'bg-[#161926] border border-[#1F2436]'
        : 'bg-white border border-gray-200'
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              isDarkMode ? 'bg-[#1F2436]' : 'bg-gray-100'
            )}>
              <User className={cn(
                "w-8 h-8",
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )} />
            </div>
            <div>
              <h1 className={cn(
                "text-2xl font-semibold",
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              )}>
                {customer.firstName} {customer.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
                <span className={cn(
                  "text-sm",
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Customer since {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Customer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="details" className="p-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className={cn(
              "p-4 rounded-lg",
              isDarkMode ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <h2 className={cn(
                "text-lg font-semibold mb-4",
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              )}>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={editedCustomer.email || customer.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setEditedCustomer(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {customer.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <Input
                      value={editedCustomer.phone || customer.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setEditedCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {customer.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <div className="space-y-2 w-full">
                      {customer.addresses && customer.addresses.length > 0 && (
                        customer.addresses.map((address, index) => (
                          <div key={index} className="space-y-2">
                            <Input
                              placeholder="Street"
                              value={editedCustomer.addresses?.[index]?.street || address.street}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newAddresses = [...(editedCustomer.addresses || customer.addresses || [])];
                                if (!newAddresses[index]) {
                                  newAddresses[index] = { ...address };
                                }
                                newAddresses[index].street = e.target.value;
                                setEditedCustomer(prev => ({ ...prev, addresses: newAddresses }));
                              }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="City"
                                value={editedCustomer.addresses?.[index]?.city || address.city}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newAddresses = [...(editedCustomer.addresses || customer.addresses || [])];
                                  if (!newAddresses[index]) {
                                    newAddresses[index] = { ...address };
                                  }
                                  newAddresses[index].city = e.target.value;
                                  setEditedCustomer(prev => ({ ...prev, addresses: newAddresses }));
                                }}
                              />
                              <Input
                                placeholder="State"
                                value={editedCustomer.addresses?.[index]?.state || address.state}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newAddresses = [...(editedCustomer.addresses || customer.addresses || [])];
                                  if (!newAddresses[index]) {
                                    newAddresses[index] = { ...address };
                                  }
                                  newAddresses[index].state = e.target.value;
                                  setEditedCustomer(prev => ({ ...prev, addresses: newAddresses }));
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Country"
                                value={editedCustomer.addresses?.[index]?.country || address.country}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newAddresses = [...(editedCustomer.addresses || customer.addresses || [])];
                                  if (!newAddresses[index]) {
                                    newAddresses[index] = { ...address };
                                  }
                                  newAddresses[index].country = e.target.value;
                                  setEditedCustomer(prev => ({ ...prev, addresses: newAddresses }));
                                }}
                              />
                              <Input
                                placeholder="Zip Code"
                                value={editedCustomer.addresses?.[index]?.zipCode || address.zipCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newAddresses = [...(editedCustomer.addresses || customer.addresses || [])];
                                  if (!newAddresses[index]) {
                                    newAddresses[index] = { ...address };
                                  }
                                  newAddresses[index].zipCode = e.target.value;
                                  setEditedCustomer(prev => ({ ...prev, addresses: newAddresses }));
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div>
                      {customer.addresses && customer.addresses.length > 0 && (
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {customer.addresses[0].street}, {customer.addresses[0].city}, {customer.addresses[0].state}, {customer.addresses[0].country} {customer.addresses[0].zipCode}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className={cn(
              "p-4 rounded-lg",
              isDarkMode ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <h2 className={cn(
                "text-lg font-semibold mb-4",
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              )}>
                Tags
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(editedCustomer.tags || customer.tags || []).map(tag => (
                    <Badge key={tag} variant="primary" className="flex items-center gap-1">
                      {tag}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className={isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Statistics */}
            <div className={cn(
              "p-4 rounded-lg",
              isDarkMode ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <h2 className={cn(
                "text-lg font-semibold mb-4",
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              )}>
                Order Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Total Orders
                    </span>
                  </div>
                  <span className={cn(
                    "text-2xl font-semibold",
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  )}>
                    {customer.totalOrders}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Total Spent
                    </span>
                  </div>
                  <span className={cn(
                    "text-2xl font-semibold",
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  )}>
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Marketing Preferences */}
            <div className={cn(
              "p-4 rounded-lg",
              isDarkMode ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <h2 className={cn(
                "text-lg font-semibold mb-4",
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              )}>
                Marketing Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Communication Preferences
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    {Object.entries(customer.marketingPreferences).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editedCustomer.marketingPreferences?.[key as keyof typeof customer.marketingPreferences] ?? value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedCustomer(prev => ({
                            ...prev,
                            marketingPreferences: {
                              ...(prev.marketingPreferences || customer.marketingPreferences),
                              [key]: e.target.checked,
                            },
                          }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(customer.marketingPreferences).map(([key, value]) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-center gap-2",
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        )}
                      >
                        <span className={value ? 'text-green-500' : 'text-red-500'}>
                          {value ? '✓' : '✕'}
                        </span>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {/* Orders tab content will be implemented separately */}
          <div className="text-center text-gray-500 py-8">
            Orders history will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          {/* Preferences tab content will be implemented separately */}
          <div className="text-center text-gray-500 py-8">
            Detailed preferences will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
