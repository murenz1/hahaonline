import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  Warehouse,
  Download,
  Calendar,
  BarChart,
  LineChart,
  PieChart,
  ArrowUpDown,
} from 'lucide-react';

interface InventoryData {
  id: string;
  period: string;
  totalItems: number;
  totalValue: number;
  stockLevels: {
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    turnoverRate: number;
    daysOfSupply: number;
  }[];
  agingAnalysis: {
    category: string;
    items: {
      age: string;
      count: number;
      value: number;
      percentage: number;
    }[];
  }[];
  stockoutPredictions: {
    product: string;
    currentStock: number;
    dailyUsage: number;
    predictedStockoutDate: string;
    riskLevel: 'high' | 'medium' | 'low';
  }[];
  reorderPoints: {
    product: string;
    currentStock: number;
    reorderPoint: number;
    leadTime: number;
    safetyStock: number;
    status: 'below' | 'above' | 'at';
  }[];
  warehouseMetrics: {
    location: string;
    utilization: number;
    throughput: number;
    accuracy: number;
    efficiency: number;
  }[];
}

interface InventoryAnalyticsProps {
  data: InventoryData[];
  onGenerateReport: (period: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({
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

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'below':
        return 'text-red-500';
      case 'above':
        return 'text-green-500';
      case 'at':
        return 'text-yellow-500';
      default:
        return '';
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
          Inventory Analytics
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Items</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.totalItems.toLocaleString()}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Value</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  ${report.totalValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Stock Levels and Turnover */}
            <div className="space-y-2">
              <h4 className="font-medium">Stock Levels & Turnover</h4>
              <div className="space-y-2">
                {report.stockLevels.map((category) => (
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
                        {category.currentStock} / {category.maxStock}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Turnover: {category.turnoverRate.toFixed(2)} • Days Supply: {category.daysOfSupply}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aging Analysis */}
            <div className="space-y-2">
              <h4 className="font-medium">Aging Analysis</h4>
              <div className="space-y-2">
                {report.agingAnalysis.map((category) => (
                  <div
                    key={category.category}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="font-medium">{category.category}</div>
                    <div className="space-y-1 mt-2">
                      {category.items.map((item) => (
                        <div key={item.age} className="flex justify-between text-sm">
                          <span>{item.age}</span>
                          <span>{item.count} items (${item.value.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stockout Predictions */}
            <div className="space-y-2">
              <h4 className="font-medium">Stockout Predictions</h4>
              <div className="space-y-2">
                {report.stockoutPredictions.map((prediction) => (
                  <div
                    key={prediction.product}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{prediction.product}</span>
                      <span className={cn("text-sm", getRiskLevelColor(prediction.riskLevel))}>
                        {prediction.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Current: {prediction.currentStock} • Daily: {prediction.dailyUsage}
                    </div>
                    <div className="text-sm mt-1">
                      Predicted Stockout: {prediction.predictedStockoutDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reorder Points */}
            <div className="space-y-2">
              <h4 className="font-medium">Reorder Points</h4>
              <div className="space-y-2">
                {report.reorderPoints.map((item) => (
                  <div
                    key={item.product}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.product}</span>
                      <span className={cn("text-sm", getStatusColor(item.status))}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Current: {item.currentStock} • Reorder: {item.reorderPoint}
                    </div>
                    <div className="text-sm mt-1">
                      Lead Time: {item.leadTime} days • Safety Stock: {item.safetyStock}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warehouse Performance */}
            <div className="space-y-2">
              <h4 className="font-medium">Warehouse Performance</h4>
              <div className="space-y-2">
                {report.warehouseMetrics.map((location) => (
                  <div
                    key={location.location}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="font-medium">{location.location}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Utilization:</span> {location.utilization}%
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Throughput:</span> {location.throughput}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Accuracy:</span> {location.accuracy}%
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Efficiency:</span> {location.efficiency}%
                      </div>
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