import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Plus,
  Search,
  Filter,
  Download,
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from 'lucide-react';

interface Payment {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: string;
  description: string;
  reference: string;
  customer: {
    name: string;
    email: string;
  };
  paymentMethod: {
    last4?: string;
    bankName?: string;
    accountNumber?: string;
  };
}

interface PaymentProcessingProps {
  payments: Payment[];
  onAddPayment: () => void;
  onEditPayment: (id: string) => void;
  onDeletePayment: (id: string) => void;
  onProcessPayment: (id: string) => void;
  onRefundPayment: (id: string) => void;
  onExport: () => void;
}

export const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  payments,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  onProcessPayment,
  onRefundPayment,
  onExport,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || payment.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <Banknote className="w-4 h-4" />;
      case 'cash':
        return <Wallet className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'refunded':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
          Payment Processing
        </h1>
        <div className="flex gap-2">
          <Button onClick={onAddPayment}>
            <Plus className="w-4 h-4 mr-2" />
            New Payment
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-500" />}
          />
        </div>
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <Select.Trigger>
            <CreditCard className="w-4 h-4 mr-2" />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Types</Select.Item>
            <Select.Item value="credit_card">Credit Card</Select.Item>
            <Select.Item value="bank_transfer">Bank Transfer</Select.Item>
            <Select.Item value="cash">Cash</Select.Item>
            <Select.Item value="other">Other</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <Select.Trigger>
            <Filter className="w-4 h-4 mr-2" />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Status</Select.Item>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="completed">Completed</Select.Item>
            <Select.Item value="failed">Failed</Select.Item>
            <Select.Item value="refunded">Refunded</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Payments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={cn(
              "rounded-lg border p-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getPaymentIcon(payment.type)}
                <div>
                  <h3 className="font-semibold">{payment.description}</h3>
                  <div className="text-sm text-gray-500">Ref: {payment.reference}</div>
                </div>
              </div>
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(payment.status)
              )}>
                {getStatusIcon(payment.status)}
                <span>{payment.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">${payment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{payment.date}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Customer</div>
                <div className="font-medium">{payment.customer.name}</div>
                <div className="text-sm text-gray-500">{payment.customer.email}</div>
              </div>

              {payment.paymentMethod && (
                <div>
                  <div className="text-sm text-gray-500">Payment Method</div>
                  {payment.type === 'credit_card' && payment.paymentMethod.last4 && (
                    <div className="font-medium">•••• {payment.paymentMethod.last4}</div>
                  )}
                  {payment.type === 'bank_transfer' && payment.paymentMethod.bankName && (
                    <div className="font-medium">{payment.paymentMethod.bankName}</div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Last updated: {payment.date}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPayment(payment.id)}
                  >
                    Edit
                  </Button>
                  {payment.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProcessPayment(payment.id)}
                    >
                      Process
                    </Button>
                  )}
                  {payment.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRefundPayment(payment.id)}
                    >
                      Refund
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeletePayment(payment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 