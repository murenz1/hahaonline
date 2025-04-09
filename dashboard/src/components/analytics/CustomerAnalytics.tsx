import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import {
  Users,
  ShoppingCart,
  Clock,
  MapPin,
  CreditCard,
  Star,
  Download,
  Calendar,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface CustomerData {
  id: string;
  period: string;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderFrequency: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  demographics: {
    ageGroups: {
      group: string;
      count: number;
      percentage: number;
    }[];
    locations: {
      location: string;
      count: number;
      percentage: number;
    }[];
    gender: {
      male: number;
      female: number;
      other: number;
    };
  };
  behavior: {
    purchaseFrequency: {
      frequency: string;
      count: number;
      percentage: number;
    }[];
    preferredCategories: {
      category: string;
      count: number;
      percentage: number;
    }[];
    averageSessionDuration: string;
    pagesPerSession: number;
  };
  satisfaction: {
    averageRating: number;
    reviews: {
      rating: number;
      count: number;
      percentage: number;
    }[];
    complaints: {
      type: string;
      count: number;
      percentage: number;
    }[];
  };
}

interface CustomerAnalyticsProps {
  data: CustomerData[];
  onGenerateReport: (period: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
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
          Customer Analytics
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
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Total Customers</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.totalCustomers.toLocaleString()}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">New Customers</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {report.newCustomers}
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-500" />
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
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Customer LTV</span>
                </div>
                <div className="text-2xl font-semibold mt-1">
                  ${report.customerLifetimeValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-2">
              <h4 className="font-medium">Demographics</h4>
              <div className="space-y-2">
                <div className={cn(
                  "p-3 rounded-md",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <span>Age Groups</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    {report.demographics.ageGroups.map((group) => (
                      <div key={group.group} className="flex justify-between text-sm">
                        <span>{group.group}</span>
                        <span>{group.count} ({group.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cn(
                  "p-3 rounded-md",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <span>Top Locations</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    {report.demographics.locations.map((location) => (
                      <div key={location.location} className="flex justify-between text-sm">
                        <span>{location.location}</span>
                        <span>{location.count} ({location.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Behavior */}
            <div className="space-y-2">
              <h4 className="font-medium">Customer Behavior</h4>
              <div className="space-y-2">
                <div className={cn(
                  "p-3 rounded-md",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <span>Purchase Frequency</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    {report.behavior.purchaseFrequency.map((freq) => (
                      <div key={freq.frequency} className="flex justify-between text-sm">
                        <span>{freq.frequency}</span>
                        <span>{freq.count} ({freq.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cn(
                  "p-3 rounded-md",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <span>Preferred Categories</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    {report.behavior.preferredCategories.map((category) => (
                      <div key={category.category} className="flex justify-between text-sm">
                        <span>{category.category}</span>
                        <span>{category.count} ({category.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="space-y-2">
              <h4 className="font-medium">Customer Satisfaction</h4>
              <div className="space-y-2">
                <div className={cn(
                  "p-3 rounded-md",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <span>Average Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{report.satisfaction.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    {report.satisfaction.reviews.map((review) => (
                      <div key={review.rating} className="flex justify-between text-sm">
                        <span>{review.rating} Stars</span>
                        <span>{review.count} ({review.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cn(
                  "p-3 rounded-md",
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}>
                  <div className="flex items-center justify-between">
                    <span>Common Complaints</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    {report.satisfaction.complaints.map((complaint) => (
                      <div key={complaint.type} className="flex justify-between text-sm">
                        <span>{complaint.type}</span>
                        <span>{complaint.count} ({complaint.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 