import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { useGetOrderByIdQuery, useUpdateOrderMutation } from '../../store/api';
import { Order } from '../../store/slices/ordersSlice';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
}

const orderStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

const paymentStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock;
    case 'processing':
      return Package;
    case 'shipped':
      return Truck;
    case 'delivered':
      return CheckCircle;
    case 'cancelled':
      return XCircle;
    case 'refunded':
      return AlertTriangle;
    default:
      return Clock;
  }
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const { theme } = useTheme();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  const [updateOrder] = useUpdateOrderMutation();

  const handleStatusChange = async (status: Order['status']) => {
    try {
      await updateOrder({ id: orderId, status });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handlePaymentStatusChange = async (paymentStatus: Order['paymentStatus']) => {
    try {
      await updateOrder({ id: orderId, paymentStatus });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Error loading order details
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className={cn(
      "rounded-lg transition-colors duration-200",
      theme === 'dark'
        ? 'bg-[#161926] border border-[#1F2436]'
        : 'bg-white border border-gray-200'
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              "text-2xl font-bold",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              Order #{order.orderNumber}
            </h1>
            <p className={cn(
              "mt-1 text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={order.status}
              onChange={handleStatusChange}
              options={orderStatusOptions}
            />
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div>
            <h2 className={cn(
              "text-lg font-semibold mb-4",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 rounded-lg",
                    theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      )}>
                        {item.productName}
                      </h3>
                      <p className={cn(
                        "text-sm mt-1",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className={cn(
                      "text-right",
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    )}>
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className={cn(
            "p-4 rounded-lg",
            theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-50'
          )}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Subtotal
                </span>
                <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Tax
                </span>
                <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                  ${order.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Shipping
                </span>
                <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                  ${order.shipping.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between font-semibold">
                  <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    Total
                  </span>
                  <span className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h2 className={cn(
              "text-lg font-semibold mb-4 flex items-center gap-2",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              <User className="h-5 w-5" />
              Customer Information
            </h2>
            <div className={cn(
              "p-4 rounded-lg",
              theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <p className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                {order.customerName}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h2 className={cn(
              "text-lg font-semibold mb-4 flex items-center gap-2",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h2>
            <div className={cn(
              "p-4 rounded-lg",
              theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <p className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.country} {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h2 className={cn(
              "text-lg font-semibold mb-4 flex items-center gap-2",
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            )}>
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h2>
            <div className={cn(
              "p-4 rounded-lg",
              theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-50'
            )}>
              <div className="space-y-2">
                <div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Payment Method:
                  </span>
                  <p className={theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}>
                    {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Payment Status:
                  </span>
                  <div className="mt-1">
                    <Select
                      value={order.paymentStatus}
                      onChange={handlePaymentStatusChange}
                      options={paymentStatusOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h2 className={cn(
                "text-lg font-semibold mb-4 flex items-center gap-2",
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              )}>
                <FileText className="h-5 w-5" />
                Order Notes
              </h2>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-[#1F2436]' : 'bg-gray-50'
              )}>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {order.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 