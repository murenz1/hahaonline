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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
} from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  category: string;
  period: string;
  amount: number;
  spent: number;
  remaining: number;
  status: 'on_track' | 'over_budget' | 'under_budget';
  lastUpdated: string;
}

interface BudgetManagementProps {
  budgets: Budget[];
  onAddBudget: () => void;
  onEditBudget: (id: string) => void;
  onDeleteBudget: (id: string) => void;
  onExport: () => void;
}

export const BudgetManagement: React.FC<BudgetManagementProps> = ({
  budgets,
  onAddBudget,
  onEditBudget,
  onDeleteBudget,
  onExport,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('all');

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || budget.category === selectedCategory;
    const matchesPeriod = selectedPeriod === 'all' || budget.period === selectedPeriod;
    return matchesSearch && matchesCategory && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'text-green-600 bg-green-100';
      case 'over_budget':
        return 'text-red-600 bg-red-100';
      case 'under_budget':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressPercentage = (spent: number, amount: number) => {
    return Math.min((spent / amount) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Budget Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={onAddBudget}>
            <Plus className="w-4 h-4 mr-2" />
            New Budget
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
            placeholder="Search budgets..."
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
            <PieChart className="w-4 h-4 mr-2" />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            <Select.Item value="marketing">Marketing</Select.Item>
            <Select.Item value="operations">Operations</Select.Item>
            <Select.Item value="development">Development</Select.Item>
            <Select.Item value="sales">Sales</Select.Item>
            <Select.Item value="other">Other</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        >
          <Select.Trigger>
            <Calendar className="w-4 h-4 mr-2" />
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Periods</Select.Item>
            <Select.Item value="monthly">Monthly</Select.Item>
            <Select.Item value="quarterly">Quarterly</Select.Item>
            <Select.Item value="yearly">Yearly</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Budgets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBudgets.map((budget) => (
          <div
            key={budget.id}
            className={cn(
              "rounded-lg border p-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{budget.name}</h3>
                <div className="text-sm text-gray-500">{budget.category}</div>
              </div>
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(budget.status)
              )}>
                <span>{budget.status.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">
                    ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      getProgressPercentage(budget.spent, budget.amount) > 100
                        ? 'bg-red-500'
                        : getProgressPercentage(budget.spent, budget.amount) > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    )}
                    style={{
                      width: `${getProgressPercentage(budget.spent, budget.amount)}%`
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Remaining</div>
                  <div className="font-medium">${budget.remaining.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Period</div>
                  <div className="font-medium">{budget.period}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Last updated: {budget.lastUpdated}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditBudget(budget.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteBudget(budget.id)}
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