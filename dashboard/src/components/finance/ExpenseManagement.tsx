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
  Receipt,
  CreditCard,
  Cash,
  Banknote,
  Calendar,
  Tag,
} from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: 'credit_card' | 'cash' | 'bank_transfer';
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  notes?: string;
}

interface ExpenseManagementProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onApproveExpense: (id: string) => void;
  onRejectExpense: (id: string) => void;
  onExport: () => void;
}

export const ExpenseManagement: React.FC<ExpenseManagementProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onApproveExpense,
  onRejectExpense,
  onExport,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || expense.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'cash':
        return <Cash className="w-4 h-4" />;
      case 'bank_transfer':
        return <Banknote className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
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
          Expense Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={onAddExpense}>
            <Plus className="w-4 h-4 mr-2" />
            New Expense
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
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-500" />}
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <Select.Trigger>
            <Tag className="w-4 h-4 mr-2" />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            <Select.Item value="travel">Travel</Select.Item>
            <Select.Item value="office">Office</Select.Item>
            <Select.Item value="entertainment">Entertainment</Select.Item>
            <Select.Item value="meals">Meals</Select.Item>
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
            <Select.Item value="approved">Approved</Select.Item>
            <Select.Item value="rejected">Rejected</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Expenses List */}
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
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Payment Method</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className={cn(
                    "border-b",
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{expense.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{expense.description}</div>
                    {expense.notes && (
                      <div className="text-sm text-gray-500">{expense.notes}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      <Tag className="w-3 h-3" />
                      <span>{expense.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">${expense.amount.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(expense.paymentMethod)}
                      <span className="capitalize">{expense.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(expense.status)
                    )}>
                      <span>{expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      {expense.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onApproveExpense(expense.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRejectExpense(expense.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditExpense(expense.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteExpense(expense.id)}
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