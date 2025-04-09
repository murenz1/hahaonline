import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  FileText,
  CreditCard,
  User,
  Building2,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  vendor: {
    id: string;
    name: string;
  };
  commission: number;
  date: string;
  refundedAmount?: number;
}

interface PaymentTransactionsProps {
  transactions: Transaction[];
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  onSort: (sort: { by: string; direction: 'asc' | 'desc' }) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const PaymentTransactions: React.FC<PaymentTransactionsProps> = ({
  transactions,
  onSearch,
  onFilter,
  onSort,
  onExport,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedMethod, setSelectedMethod] = React.useState('');
  const [selectedVendor, setSelectedVendor] = React.useState('');
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilter({ ...selectedStatus, status: value });
  };

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onFilter({ ...selectedMethod, paymentMethod: value });
  };

  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
    onFilter({ ...selectedVendor, vendorId: value });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [type]: value }));
    onFilter({ ...dateRange, [type]: value });
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
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
          Payment Transactions
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => onExport('pdf')}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
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
            placeholder="Search transactions..."
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
            <Select.Item value="completed">Completed</Select.Item>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="failed">Failed</Select.Item>
            <Select.Item value="refunded">Refunded</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedMethod}
          onValueChange={handleMethodChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Payment Method" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="credit_card">Credit Card</Select.Item>
            <Select.Item value="paypal">PayPal</Select.Item>
            <Select.Item value="bank_transfer">Bank Transfer</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedVendor}
          onValueChange={handleVendorChange}
        >
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="Vendor" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="vendor1">Vendor 1</Select.Item>
            <Select.Item value="vendor2">Vendor 2</Select.Item>
            <Select.Item value="vendor3">Vendor 3</Select.Item>
          </Select.Content>
        </Select>
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="w-[150px]"
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="w-[150px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "border-b",
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            )}>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Order ID</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Customer</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Vendor</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Amount</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Commission</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Payment Method</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Status</span>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-sm font-medium">Date</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={cn(
                  "border-b",
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{transaction.orderId}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{transaction.customer.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>{transaction.vendor.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>{transaction.amount} {transaction.currency}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>{transaction.commission} {transaction.currency}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>{transaction.paymentMethod}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{transaction.date}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 