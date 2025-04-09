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
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
}

interface InvoiceManagementProps {
  invoices: Invoice[];
  onAddInvoice: () => void;
  onEditInvoice: (id: string) => void;
  onDeleteInvoice: (id: string) => void;
  onSendInvoice: (id: string) => void;
  onExport: () => void;
}

export const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  invoices,
  onAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onSendInvoice,
  onExport,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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
          Invoice Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={onAddInvoice}>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
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
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-500" />}
          />
        </div>
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
            <Select.Item value="paid">Paid</Select.Item>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="overdue">Overdue</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Invoices List */}
      <div className={cn(
        "rounded-lg border",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b",
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}>
                <th className="text-left py-3 px-4">Invoice #</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Due Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={cn(
                    "border-b",
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{invoice.number}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{invoice.customer.name}</div>
                      <div className="text-sm text-gray-500">{invoice.customer.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{invoice.amount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{invoice.dueDate}</td>
                  <td className="py-3 px-4">
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(invoice.status)
                    )}>
                      {getStatusIcon(invoice.status)}
                      <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditInvoice(invoice.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSendInvoice(invoice.id)}
                      >
                        Send
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteInvoice(invoice.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 