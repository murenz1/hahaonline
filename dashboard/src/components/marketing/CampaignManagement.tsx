import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  BarChart3,
  Target,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Download,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'push' | 'sms' | 'display';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  period: {
    start: string;
    end: string;
  };
  budget: {
    total: number;
    spent: number;
  };
  targetAudience: {
    size: number;
    segments: string[];
  };
  performance: {
    reach: number;
    impressions: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
    roi: number;
  };
  channels: {
    name: string;
    spend: number;
    performance: {
      reach: number;
      clicks: number;
      conversions: number;
    };
  }[];
  content: {
    type: string;
    status: 'draft' | 'approved' | 'rejected';
    preview: string;
  }[];
}

interface CampaignManagementProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  onEditCampaign: (id: string, campaign: Partial<Campaign>) => void;
  onDeleteCampaign: (id: string) => void;
  onExportCampaigns: (format: 'csv' | 'pdf') => void;
}

export const CampaignManagement: React.FC<CampaignManagementProps> = ({
  campaigns,
  onAddCampaign,
  onEditCampaign,
  onDeleteCampaign,
  onExportCampaigns,
}) => {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = React.useState<Campaign['type'] | ''>('');
  const [selectedStatus, setSelectedStatus] = React.useState<Campaign['status'] | ''>('');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesType = selectedType === '' || campaign.type === selectedType;
    const matchesStatus = selectedStatus === '' || campaign.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500';
      case 'scheduled':
        return 'text-blue-500';
      case 'active':
        return 'text-green-500';
      case 'paused':
        return 'text-yellow-500';
      case 'completed':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
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
          Campaign Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => onAddCampaign({
            name: '',
            type: 'email',
            status: 'draft',
            period: { start: '', end: '' },
            budget: { total: 0, spent: 0 },
            targetAudience: { size: 0, segments: [] },
            performance: { reach: 0, impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, roi: 0 },
            channels: [],
            content: [],
          })}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
          <Button variant="outline" onClick={() => onExportCampaigns('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as Campaign['type'])}
        >
          <Select.Trigger>
            <Select.Value placeholder="Filter by type" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">All Types</Select.Item>
            <Select.Item value="email">Email</Select.Item>
            <Select.Item value="social">Social</Select.Item>
            <Select.Item value="push">Push</Select.Item>
            <Select.Item value="sms">SMS</Select.Item>
            <Select.Item value="display">Display</Select.Item>
          </Select.Content>
        </Select>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as Campaign['status'])}
        >
          <Select.Trigger>
            <Select.Value placeholder="Filter by status" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">All Statuses</Select.Item>
            <Select.Item value="draft">Draft</Select.Item>
            <Select.Item value="scheduled">Scheduled</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="paused">Paused</Select.Item>
            <Select.Item value="completed">Completed</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={cn(
              "rounded-lg border p-6",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{campaign.name}</h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm",
                    getStatusColor(campaign.status)
                  )}>
                    {campaign.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {campaign.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCampaign(campaign.id, campaign)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteCampaign(campaign.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Period</span>
                </div>
                <div className="text-sm">
                  {campaign.period.start} - {campaign.period.end}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Budget</span>
                </div>
                <div className="text-sm">
                  ${campaign.budget.spent.toLocaleString()} / ${campaign.budget.total.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Target Audience</span>
                </div>
                <div className="text-sm">
                  {campaign.targetAudience.size.toLocaleString()} users
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">ROI</span>
                </div>
                <div className="text-sm">
                  {campaign.performance.roi.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium mb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Reach</div>
                    <div className="text-lg font-bold">{campaign.performance.reach.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Impressions</div>
                    <div className="text-lg font-bold">{campaign.performance.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Clicks</div>
                    <div className="text-lg font-bold">{campaign.performance.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Conversions</div>
                    <div className="text-lg font-bold">{campaign.performance.conversions.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Channel Performance</h3>
                <div className="space-y-2">
                  {campaign.channels.map((channel) => (
                    <div key={channel.name} className="flex justify-between items-center">
                      <span className="text-sm">{channel.name}</span>
                      <div className="flex gap-4">
                        <span className="text-sm text-gray-500">
                          ${channel.spend.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {channel.performance.conversions.toLocaleString()} conv.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Content Status</h3>
              <div className="flex flex-wrap gap-2">
                {campaign.content.map((item) => (
                  <span
                    key={item.type}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      item.status === 'approved' ? 'bg-green-100 text-green-600' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    )}
                  >
                    {item.type} - {item.status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 