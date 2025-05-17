import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
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
  X,
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
  const { isDarkMode } = useTheme();
  const [selectedType, setSelectedType] = useState<Campaign['type'] | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<Campaign['status'] | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Partial<Campaign> | null>(null);

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
          isDarkMode ? 'text-gray-200' : 'text-gray-900'
        )}>
          Campaign Management
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => {
            setCurrentCampaign({
              name: '',
              type: 'email',
              status: 'draft',
              period: { start: '', end: '' },
              budget: { total: 0, spent: 0 },
              targetAudience: { size: 0, segments: [] },
              performance: { reach: 0, impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, roi: 0 },
              channels: [],
              content: [],
            });
            setIsModalOpen(true);
          }}>
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
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as Campaign['type'])}
          className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
        >
          <option value="">All Types</option>
          <option value="email">Email</option>
          <option value="social">Social</option>
          <option value="push">Push</option>
          <option value="sms">SMS</option>
          <option value="display">Display</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Campaign['status'])}
          className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Campaign List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.name}</h3>
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
                  onClick={() => {
                    setCurrentCampaign({ ...campaign });
                    setIsModalOpen(true);
                  }}
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.type}</p>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                <p className={`font-medium ${getStatusColor(campaign.status)}`}>{campaign.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Period</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.period.start} - {campaign.period.end}</p>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Budget</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${campaign.budget.spent.toLocaleString()} / ${campaign.budget.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target Audience</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.targetAudience.size.toLocaleString()} users</p>
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ROI</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.performance.roi.toFixed(2)}%</p>
              </div>
            </div>

            <div className="mt-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Target Audience</p>
              <div className="flex flex-wrap gap-1">
                {campaign.targetAudience.segments.map((segment, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                    {segment}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium mb-2">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reach</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.performance.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Impressions</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.performance.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Clicks</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.performance.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Conversions</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.performance.conversions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Channel Performance</h3>
                <div className="space-y-2">
                  {campaign.channels.map((channel) => (
                    <div key={channel.name} className="flex justify-between items-center">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{channel.name}</p>
                      <div className="flex gap-4">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>${channel.spend.toLocaleString()}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{channel.performance.conversions.toLocaleString()} conv.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Content Status</h3>
              <div className="flex flex-wrap gap-1">
                {campaign.content.map((item) => (
                  <span
                    key={item.type}
                    className={`px-2 py-1 text-xs rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-600' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  >
                    {item.type} - {item.status}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg max-w-3xl w-full mx-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {currentCampaign?.id ? 'Edit Campaign' : 'Create Campaign'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentCampaign(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={currentCampaign?.name || ''}
                  onChange={(e) => setCurrentCampaign(prev => ({ ...prev as Campaign, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Summer Sale 2023"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type *
                  </label>
                  <select
                    value={currentCampaign?.type || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({ ...prev as Campaign, type: e.target.value as Campaign['type'] }))}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="email">Email</option>
                    <option value="social">Social</option>
                    <option value="push">Push</option>
                    <option value="sms">SMS</option>
                    <option value="display">Display</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status *
                  </label>
                  <select
                    value={currentCampaign?.status || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({ ...prev as Campaign, status: e.target.value as Campaign['status'] }))}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={currentCampaign?.period?.start || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({
                      ...prev as Campaign,
                      period: { ...prev?.period as any, start: e.target.value }
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={currentCampaign?.period?.end || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({
                      ...prev as Campaign,
                      period: { ...prev?.period as any, end: e.target.value }
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Budget Total ($)
                  </label>
                  <input
                    type="number"
                    value={currentCampaign?.budget?.total || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({
                      ...prev as Campaign,
                      budget: { ...prev?.budget as any, total: Number(e.target.value) }
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="1000.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Target Audience Size
                  </label>
                  <input
                    type="number"
                    value={currentCampaign?.targetAudience?.size || ''}
                    onChange={(e) => setCurrentCampaign(prev => ({
                      ...prev as Campaign,
                      targetAudience: { ...prev?.targetAudience as any, size: Number(e.target.value) }
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="1000"
                    min="0"
                  />
                </div>
              </div>
            </form>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentCampaign(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (currentCampaign) {
                    if (currentCampaign.id) {
                      onEditCampaign(currentCampaign.id, currentCampaign);
                    } else {
                      onAddCampaign(currentCampaign as Omit<Campaign, 'id'>);
                    }
                    setIsModalOpen(false);
                    setCurrentCampaign(null);
                  }
                }}
                disabled={!currentCampaign?.name || !currentCampaign?.type || !currentCampaign?.status || !currentCampaign?.period?.start || !currentCampaign?.period?.end}
              >
                {currentCampaign?.id ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};