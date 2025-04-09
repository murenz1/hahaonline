import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Download,
  Calendar,
  BarChart,
  PieChart,
  Map,
  Clock,
  Truck,
  User,
  Package,
} from 'lucide-react';

interface DeliveryReport {
  id: string;
  period: string;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  averageDeliveryTime: string;
  onTimeDeliveries: number;
  lateDeliveries: number;
  deliveryPartners: {
    id: string;
    name: string;
    totalDeliveries: number;
    successRate: number;
    averageRating: number;
  }[];
  zones: {
    id: string;
    name: string;
    totalDeliveries: number;
    successRate: number;
    averageDeliveryTime: string;
  }[];
  issues: {
    type: string;
    count: number;
    percentage: number;
  }[];
}

interface DeliveryStatusReportsProps {
  reports: DeliveryReport[];
  onGenerateReport: (period: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const DeliveryStatusReports: React.FC<DeliveryStatusReportsProps> = ({
  reports,
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
          Delivery Status Reports
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

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
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

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Deliveries</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.totalDeliveries}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Average Time</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.averageDeliveryTime}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">On Time</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.onTimeDeliveries}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {((report.successfulDeliveries / report.totalDeliveries) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Delivery Partners Performance */}
            <div className="space-y-2">
              <h4 className="font-medium">Top Delivery Partners</h4>
              <div className="space-y-2">
                {report.deliveryPartners.slice(0, 3).map((partner) => (
                  <div
                    key={partner.id}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{partner.name}</span>
                      <span className="text-sm">
                        {partner.successRate}% Success
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {partner.totalDeliveries} Deliveries • {partner.averageRating}★ Rating
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Performance */}
            <div className="space-y-2">
              <h4 className="font-medium">Zone Performance</h4>
              <div className="space-y-2">
                {report.zones.slice(0, 3).map((zone) => (
                  <div
                    key={zone.id}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{zone.name}</span>
                      <span className="text-sm">
                        {zone.successRate}% Success
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {zone.totalDeliveries} Deliveries • Avg. Time: {zone.averageDeliveryTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Issues */}
            <div className="space-y-2">
              <h4 className="font-medium">Common Issues</h4>
              <div className="space-y-2">
                {report.issues.map((issue) => (
                  <div
                    key={issue.type}
                    className={cn(
                      "p-3 rounded-md",
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{issue.type}</span>
                      <span className="text-sm">
                        {issue.count} cases ({issue.percentage}%)
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