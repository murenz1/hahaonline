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
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface TaxRecord {
  id: string;
  type: string;
  period: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  jurisdiction: string;
  rate: number;
  taxableAmount: number;
  deductions: number;
  lastUpdated: string;
}

interface TaxManagementProps {
  taxRecords: TaxRecord[];
  onAddRecord: () => void;
  onEditRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onPayTax: (id: string) => void;
  onExport: () => void;
}

export const TaxManagement: React.FC<TaxManagementProps> = ({
  taxRecords,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onPayTax,
  onExport,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const filteredRecords = taxRecords.filter(record => {
    const matchesSearch = record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
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
        return <AlertCircle className="w-4 h-4" />;
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
          Tax Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={onAddRecord}>
            <Plus className="w-4 h-4 mr-2" />
            New Tax Record
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
            placeholder="Search tax records..."
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
            <Calculator className="w-4 h-4 mr-2" />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Types</Select.Item>
            <Select.Item value="income">Income Tax</Select.Item>
            <Select.Item value="sales">Sales Tax</Select.Item>
            <Select.Item value="property">Property Tax</Select.Item>
            <Select.Item value="payroll">Payroll Tax</Select.Item>
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
            <Select.Item value="paid">Paid</Select.Item>
            <Select.Item value="overdue">Overdue</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Tax Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className={cn(
              "rounded-lg border p-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{record.type}</h3>
                <div className="text-sm text-gray-500">{record.jurisdiction}</div>
              </div>
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(record.status)
              )}>
                {getStatusIcon(record.status)}
                <span>{record.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">${record.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Rate</div>
                  <div className="font-medium">{record.rate}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Taxable Amount</div>
                  <div className="font-medium">${record.taxableAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Deductions</div>
                  <div className="font-medium">${record.deductions.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Period</div>
                  <div className="font-medium">{record.period}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Due Date</div>
                  <div className="font-medium">{record.dueDate}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Last updated: {record.lastUpdated}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRecord(record.id)}
                  >
                    Edit
                  </Button>
                  {record.status !== 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPayTax(record.id)}
                    >
                      Pay
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteRecord(record.id)}
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