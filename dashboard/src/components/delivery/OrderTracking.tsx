import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  Search,
  MapPin,
  Package,
  User,
  Clock,
  Truck,
  Phone,
  Mail,
  Navigation,
  AlertCircle,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  deliveryPartner: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
  };
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  trackingHistory: {
    timestamp: string;
    status: string;
    location?: string;
    notes?: string;
  }[];
}

interface OrderTrackingProps {
  orders: Order[];
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  onViewDetails: (order: Order) => void;
  onAssignDeliveryPartner: (order: Order) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orders,
  onSearch,
  onFilter,
  onViewDetails,
  onAssignDeliveryPartner,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilter({ ...selectedStatus, status: value });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'assigned':
        return <Badge variant="warning">Assigned</Badge>;
      case 'picked_up':
        return <Badge variant="info">Picked Up</Badge>;
      case 'in_transit':
        return <Badge variant="primary">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
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
          Order Tracking
        </h1>
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
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Status" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="assigned">Assigned</Select.Item>
            <Select.Item value="picked_up">Picked Up</Select.Item>
            <Select.Item value="in_transit">In Transit</Select.Item>
            <Select.Item value="delivered">Delivered</Select.Item>
            <Select.Item value="failed">Failed</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className={cn(
              "rounded-lg border p-6 space-y-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {order.estimatedDeliveryTime}
                  </p>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <h4 className="font-medium">Customer Details</h4>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{order.customer.address}</span>
              </div>
            </div>

            {/* Delivery Partner Info */}
            {order.deliveryPartner && (
              <div className="space-y-2">
                <h4 className="font-medium">Delivery Partner</h4>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{order.deliveryPartner.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>{order.deliveryPartner.vehicleType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{order.deliveryPartner.phone}</span>
                </div>
              </div>
            )}

            {/* Current Location */}
            {order.currentLocation && (
              <div className="space-y-2">
                <h4 className="font-medium">Current Location</h4>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{order.currentLocation.address}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {order.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={() => onAssignDeliveryPartner(order)}
                >
                  Assign Partner
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onViewDetails(order)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 