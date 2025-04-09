import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  BarChart3,
  Users,
  Clock,
  Smartphone,
  Download,
  AlertTriangle,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface AppAnalyticsData {
  id: string;
  period: string;
  metrics: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
    avgSessionDuration: string;
    crashRate: number;
    retentionRate: number;
    downloads: number;
    ratings: {
      average: number;
      count: number;
      distribution: {
        '1': number;
        '2': number;
        '3': number;
        '4': number;
        '5': number;
      };
    };
    performance: {
      loadTime: string;
      responseTime: string;
      errorRate: number;
    };
    devices: {
      platform: {
        ios: number;
        android: number;
      };
      osVersions: Record<string, number>;
      deviceModels: Record<string, number>;
    };
    features: {
      name: string;
      usage: number;
      satisfaction: number;
    }[];
  };
}

interface AppAnalyticsProps {
  data: AppAnalyticsData[];
  onPeriodChange: (period: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const AppAnalytics: React.FC<AppAnalyticsProps> = ({
  data,
  onPeriodChange,
  onExport,
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = React.useState('7d');

  const currentData = data.find(d => d.period === selectedPeriod)?.metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          App Analytics
        </h1>
        <div className="flex gap-2">
          <Select
            value={selectedPeriod}
            onValueChange={(value) => {
              setSelectedPeriod(value);
              onPeriodChange(value);
            }}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="24h">Last 24 Hours</Select.Item>
              <Select.Item value="7d">Last 7 Days</Select.Item>
              <Select.Item value="30d">Last 30 Days</Select.Item>
              <Select.Item value="90d">Last 90 Days</Select.Item>
            </Select.Content>
          </Select>
          <Button variant="outline" onClick={() => onExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Active Users</h3>
          </div>
          <div className="text-2xl font-bold">{currentData?.activeUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-500">+12% from last period</div>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Avg. Session Duration</h3>
          </div>
          <div className="text-2xl font-bold">{currentData?.avgSessionDuration}</div>
          <div className="text-sm text-gray-500">+5% from last period</div>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-medium">Crash Rate</h3>
          </div>
          <div className="text-2xl font-bold">{currentData?.crashRate.toFixed(2)}%</div>
          <div className="text-sm text-gray-500">-0.5% from last period</div>
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Retention Rate</h3>
          </div>
          <div className="text-2xl font-bold">{currentData?.retentionRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">+2% from last period</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium mb-2">Load Time</h3>
            <div className="text-2xl font-bold">{currentData?.performance.loadTime}</div>
            <div className="text-sm text-gray-500">Average app load time</div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Response Time</h3>
            <div className="text-2xl font-bold">{currentData?.performance.responseTime}</div>
            <div className="text-sm text-gray-500">Average API response time</div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Error Rate</h3>
            <div className="text-2xl font-bold">{currentData?.performance.errorRate.toFixed(2)}%</div>
            <div className="text-sm text-gray-500">Percentage of failed requests</div>
          </div>
        </div>
      </div>

      {/* Device Distribution */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Device Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Platform</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>iOS</span>
                <span>{currentData?.devices.platform.ios.toLocaleString()} users</span>
              </div>
              <div className="flex justify-between">
                <span>Android</span>
                <span>{currentData?.devices.platform.android.toLocaleString()} users</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Top OS Versions</h3>
            <div className="space-y-2">
              {Object.entries(currentData?.devices.osVersions || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([version, count]) => (
                  <div key={version} className="flex justify-between">
                    <span>{version}</span>
                    <span>{count.toLocaleString()} users</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Feature Usage</h2>
        </div>
        <div className="space-y-4">
          {currentData?.features.map((feature) => (
            <div key={feature.name}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{feature.name}</span>
                <span>{feature.usage.toLocaleString()} users</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(feature.usage / currentData.activeUsers) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Satisfaction: {feature.satisfaction.toFixed(1)}/5
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 