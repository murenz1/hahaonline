import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
} from 'lucide-react';

interface SalesData {
  id: string;
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  newCustomers: number;
  returningCustomers: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
    quantity: number;
  }[];
  salesByCategory: {
    category: string;
    sales: number;
    percentage: number;
  }[];
  salesTrend: {
    date: string;
    sales: number;
    orders: number;
  }[];
  customerSegments: {
    segment: string;
    count: number;
    percentage: number;
  }[];
}

interface SalesAnalyticsProps {
  data: SalesData[];
  onGenerateReport: (period: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({
  data,
  onGenerateReport,
  onExport,
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = React.useState('');

  const handleGenerateReport = () => {
    if (selectedPeriod) {
      onGenerateReport(selectedPeriod);
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
          Sales Analytics
        </h1>
        <div className="flex gap-2">
          <Select
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="Select Period" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="today">Today</Select.Item>
              <Select.Item value="yesterday">Yesterday</Select.Item>
              <Select.Item value="this_week">This Week</Select.Item>
              <Select.Item value="last_week">Last Week</Select.Item>
              <Select.Item value="this_month">This Month</Select.Item>
              <Select.Item value="last_month">Last Month</Select.Item>
              <Select.Item value="this_year">This Year</Select.Item>
            </Select.Content>
          </Select>
          <Button onClick={handleGenerateReport}>
            Generate Report
          </Button>
          <Button variant="outline" onClick={() => onExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((report) => (
          <div
            key={report.id}
            className={cn(
              "rounded-lg border p-6 space-y-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold">{report.period}</h3>
              </div>
              <Button variant="outline" onClick={() => onExport('pdf')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Sales</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  ${report.totalSales.toLocaleString()}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Orders</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.totalOrders}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Avg. Order Value</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  ${report.averageOrderValue.toLocaleString()}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">New Customers</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.newCustomers}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="space-y-2">
              <h4 className="font-medium">Top Products</h4>
              <div className="space-y-2">
                {report.topProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{product.name}</span>
                      <span className="text-sm">
                        ${product.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {product.quantity} units sold
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales by Category */}
            <div className="space-y-2">
              <h4 className="font-medium">Sales by Category</h4>
              <div className="space-y-2">
                {report.salesByCategory.map((category) => (
                  <div
                    key={category.category}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.category}</span>
                      <span className="text-sm">
                        ${category.sales.toLocaleString()} ({category.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Segments */}
            <div className="space-y-2">
              <h4 className="font-medium">Customer Segments</h4>
              <div className="space-y-2">
                {report.customerSegments.map((segment) => (
                  <div
                    key={segment.segment}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{segment.segment}</span>
                      <span className="text-sm">
                        {segment.count} customers ({segment.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 