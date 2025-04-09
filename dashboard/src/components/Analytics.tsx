import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  BarChart,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Clock,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  PieChart,
  Map,
  Package,
  Star
} from 'lucide-react';

interface AnalyticsProps {}

interface Metric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down';
  unit: string;
  category: 'revenue' | 'users' | 'orders' | 'products';
}

interface ChartData {
  labels: string[];
  values: number[];
}

const Analytics: React.FC<AnalyticsProps> = () => {
  const { isDarkMode } = useTheme();
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'orders']);

  // Mock metrics data
  const metrics: Metric[] = [
    {
      id: 'MET-001',
      name: 'Total Revenue',
      value: 124589.99,
      previousValue: 115678.50,
      change: 7.7,
      trend: 'up',
      unit: 'USD',
      category: 'revenue'
    },
    {
      id: 'MET-002',
      name: 'Total Orders',
      value: 1567,
      previousValue: 1489,
      change: 5.2,
      trend: 'up',
      unit: 'orders',
      category: 'orders'
    },
    {
      id: 'MET-003',
      name: 'New Customers',
      value: 256,
      previousValue: 234,
      change: 9.4,
      trend: 'up',
      unit: 'users',
      category: 'users'
    },
    {
      id: 'MET-004',
      name: 'Average Order Value',
      value: 79.50,
      previousValue: 77.69,
      change: 2.3,
      trend: 'up',
      unit: 'USD',
      category: 'orders'
    }
  ];

  // Mock chart data
  const revenueData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12500, 15600, 14200, 16800, 19200, 18100, 17900]
  };

  const ordersData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [145, 189, 156, 178, 212, 198, 167]
  };

  // Mock top products data
  const topProducts = [
    { name: 'Product A', revenue: 12450, orders: 145, rating: 4.8 },
    { name: 'Product B', revenue: 9870, orders: 98, rating: 4.6 },
    { name: 'Product C', revenue: 7650, orders: 87, rating: 4.7 },
    { name: 'Product D', revenue: 6540, orders: 76, rating: 4.5 }
  ];

  // Mock sales by region data
  const salesByRegion = [
    { region: 'North America', revenue: 45600, percentage: 35 },
    { region: 'Europe', revenue: 32400, percentage: 25 },
    { region: 'Asia', revenue: 28900, percentage: 22 },
    { region: 'Other', revenue: 23400, percentage: 18 }
  ];

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'users':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'orders':
        return <ShoppingCart className="w-5 h-5 text-orange-500" />;
      case 'products':
        return <Package className="w-5 h-5 text-green-500" />;
      default:
        return <BarChart className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        )}
      />
    ));
  };

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Analytics</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Monitor your business performance and insights
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={cn(
              "px-4 py-2 rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "flex items-center px-4 py-2 rounded-lg font-medium",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button
            className={cn(
              "p-2 rounded-lg",
              isDarkMode 
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={cn(
              "p-6 rounded-lg border",
              isDarkMode 
                ? "bg-gray-700 border-gray-600" 
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {metric.name}
              </h3>
              {getMetricIcon(metric.category)}
            </div>
            <p className={cn("text-2xl font-semibold mb-2", isDarkMode ? "text-white" : "text-gray-900")}>
              {metric.unit === 'USD' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit === 'USD' ? '' : ` ${metric.unit}`}
            </p>
            <div className="flex items-center">
              {getTrendIcon(metric.trend)}
              <span className={cn(
                "ml-1 text-sm",
                metric.trend === 'up' ? "text-green-500" : "text-red-500"
              )}>
                {metric.change}%
              </span>
              <span className={cn("ml-1 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                vs. previous period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className={cn(
          "p-6 rounded-lg border",
          isDarkMode 
            ? "bg-gray-700 border-gray-600" 
            : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>Revenue</h3>
            <div className="flex items-center space-x-2">
              <button
                className={cn(
                  "p-1 rounded",
                  isDarkMode 
                    ? "hover:bg-gray-600" 
                    : "hover:bg-gray-100"
                )}
              >
                <LineChart className="w-4 h-4 text-gray-400" />
              </button>
              <button
                className={cn(
                  "p-1 rounded",
                  isDarkMode 
                    ? "hover:bg-gray-600" 
                    : "hover:bg-gray-100"
                )}
              >
                <BarChart className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              Chart visualization would go here
            </p>
          </div>
        </div>

        {/* Orders Chart */}
        <div className={cn(
          "p-6 rounded-lg border",
          isDarkMode 
            ? "bg-gray-700 border-gray-600" 
            : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>Orders</h3>
            <div className="flex items-center space-x-2">
              <button
                className={cn(
                  "p-1 rounded",
                  isDarkMode 
                    ? "hover:bg-gray-600" 
                    : "hover:bg-gray-100"
                )}
              >
                <LineChart className="w-4 h-4 text-gray-400" />
              </button>
              <button
                className={cn(
                  "p-1 rounded",
                  isDarkMode 
                    ? "hover:bg-gray-600" 
                    : "hover:bg-gray-100"
                )}
              >
                <BarChart className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              Chart visualization would go here
            </p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className={cn(
          "p-6 rounded-lg border",
          isDarkMode 
            ? "bg-gray-700 border-gray-600" 
            : "bg-white border-gray-200"
        )}>
          <h3 className={cn("font-medium mb-4", isDarkMode ? "text-white" : "text-gray-900")}>Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    {product.name}
                  </h4>
                  <div className="flex items-center mt-1">
                    {getRatingStars(product.rating)}
                    <span className={cn("ml-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      ({product.rating})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    ${product.revenue.toLocaleString()}
                  </p>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    {product.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Region */}
        <div className={cn(
          "p-6 rounded-lg border",
          isDarkMode 
            ? "bg-gray-700 border-gray-600" 
            : "bg-white border-gray-200"
        )}>
          <h3 className={cn("font-medium mb-4", isDarkMode ? "text-white" : "text-gray-900")}>Sales by Region</h3>
          <div className="space-y-4">
            {salesByRegion.map((region, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                    {region.region}
                  </span>
                  <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    ${region.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 