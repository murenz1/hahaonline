import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Mail,
  Edit,
  Trash2,
  Send,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Copy,
  XCircle,
  RefreshCw,
  Eye
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category?: string;
  isDefault: boolean;
  createdAt: Date;
}

interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  subject: string;
  recipientType: 'ALL' | 'SEGMENT' | 'INDIVIDUAL';
  recipientIds?: string[];
  scheduledFor: Date;
  status: 'SCHEDULED' | 'SENT' | 'FAILED';
  sentAt?: Date;
  sentCount?: number;
  openCount?: number;
  clickCount?: number;
  createdAt: Date;
}

interface EmailMarketingProps {
  initialTemplates?: EmailTemplate[];
  initialCampaigns?: EmailCampaign[];
  onCreateTemplate?: (template: Omit<EmailTemplate, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateTemplate?: (id: string, template: Partial<EmailTemplate>) => Promise<void>;
  onDeleteTemplate?: (id: string) => Promise<void>;
  onSendCampaign?: (campaign: Omit<EmailCampaign, 'id' | 'status' | 'sentAt' | 'createdAt'>) => Promise<void>;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  initialTemplates = [],
  initialCampaigns = [],
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onSendCampaign
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<EmailTemplate> | null>(null);

  useEffect(() => {
    if (initialTemplates.length === 0) {
      fetchTemplates();
    }
    if (initialCampaigns.length === 0) {
      fetchCampaigns();
    }
  }, [initialTemplates, initialCampaigns]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/marketing/email/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch email templates:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/marketing/email/campaigns');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch email campaigns:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'ALL' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTemplate = async (template: Omit<EmailTemplate, 'id' | 'createdAt'>) => {
    if (onCreateTemplate) {
      await onCreateTemplate(template);
      setIsTemplateModalOpen(false);
      fetchTemplates();
    }
  };

  const handleUpdateTemplate = async (id: string, template: Partial<EmailTemplate>) => {
    if (onUpdateTemplate) {
      await onUpdateTemplate(id, template);
      setCurrentTemplate(null);
      fetchTemplates();
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (onDeleteTemplate) {
      await onDeleteTemplate(id);
      fetchTemplates();
    }
  };

  const handleSendCampaign = async (campaign: Omit<EmailCampaign, 'id' | 'status' | 'sentAt' | 'createdAt'>) => {
    if (onSendCampaign) {
      await onSendCampaign(campaign);
      setIsCampaignModalOpen(false);
      fetchCampaigns();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'SCHEDULED':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'FAILED':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <CheckCircle className="w-4 h-4" />;
      case 'SCHEDULED':
        return <Clock className="w-4 h-4" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const renderTemplatesTab = () => (
    <>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-4 py-2 w-full rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="ALL">All Categories</option>
            <option value="WELCOME">Welcome</option>
            <option value="ORDER_CONFIRMATION">Order Confirmation</option>
            <option value="MARKETING">Marketing</option>
            <option value="NEWSLETTER">Newsletter</option>
          </select>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className={`p-8 text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No templates found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`rounded-lg border overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className={`px-4 py-3 flex justify-between items-center border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div>
                  <h3 className="font-medium truncate">{template.name}</h3>
                  {template.category && (
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {template.category}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentTemplate(template)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-medium">Subject: {template.subject}</p>
                <p className={`mt-2 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } line-clamp-3`}>
                  {template.content.replace(/<[^>]*>?/gm, '')}
                </p>
              </div>
              <div className={`px-4 py-3 border-t flex justify-between items-center ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Created {formatDate(new Date(template.createdAt))}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      /* Open preview */
                    }}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      /* Duplicate template */
                    }}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setIsCampaignModalOpen(true);
                      /* Pre-populate campaign with this template */
                    }}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCampaignsTab = () => (
    <>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 w-full rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className={`p-8 text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No campaigns found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Campaign
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Scheduled For
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{campaign.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div>{campaign.recipientType}</div>
                        {campaign.recipientIds && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {campaign.recipientIds.length} recipients
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(new Date(campaign.scheduledFor))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{campaign.status}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.status === 'SENT' ? (
                      <div>
                        <div>
                          {campaign.sentCount || 0} sent
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {campaign.openCount || 0} opens, {campaign.clickCount || 0} clicks
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {campaign.status === 'SCHEDULED' ? (
                      <>
                        <button
                          onClick={() => {/* Edit campaign */}}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {/* Cancel campaign */}}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : campaign.status === 'FAILED' ? (
                      <button
                        onClick={() => {/* Retry campaign */}}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {/* View report */}}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Marketing</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage email templates and send campaigns
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex space-x-3">
          {activeTab === 'templates' ? (
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
          ) : (
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex border-b space-x-6">
        <button
          onClick={() => {
            setActiveTab('templates');
            setSearchQuery('');
            setCategoryFilter('ALL');
          }}
          className={`pb-2 px-1 ${
            activeTab === 'templates'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => {
            setActiveTab('campaigns');
            setSearchQuery('');
            setStatusFilter('ALL');
          }}
          className={`pb-2 px-1 ${
            activeTab === 'campaigns'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Campaigns
        </button>
      </div>

      {activeTab === 'templates' ? renderTemplatesTab() : renderCampaignsTab()}

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg max-w-3xl w-full mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className="text-lg font-medium mb-4">
              Create Email Template
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Template Name *
                </label>
                <input
                  type="text"
                  value={currentTemplate?.name || ''}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev as EmailTemplate, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Welcome Email"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject Line *
                </label>
                <input
                  type="text"
                  value={currentTemplate?.subject || ''}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev as EmailTemplate, subject: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Welcome to our store!"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  value={currentTemplate?.category || ''}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev as EmailTemplate, category: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select a category</option>
                  <option value="WELCOME">Welcome</option>
                  <option value="ORDER_CONFIRMATION">Order Confirmation</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="NEWSLETTER">Newsletter</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Content *
                </label>
                <textarea
                  value={currentTemplate?.content || ''}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev as EmailTemplate, content: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="<h1>Welcome to our store!</h1><p>Thank you for signing up...</p>"
                  rows={10}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={currentTemplate?.isDefault || false}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev as EmailTemplate, isDefault: e.target.checked }))}
                  className={`mr-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <label htmlFor="isDefault" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Set as default template for this category
                </label>
              </div>
            </form>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsTemplateModalOpen(false);
                  setCurrentTemplate(null);
                }}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentTemplate && !currentTemplate.id) {
                    handleCreateTemplate({
                      name: currentTemplate.name,
                      subject: currentTemplate.subject,
                      content: currentTemplate.content,
                      category: currentTemplate.category,
                      isDefault: currentTemplate.isDefault || false
                    });
                  } else if (currentTemplate && currentTemplate.id) {
                    handleUpdateTemplate(currentTemplate.id, currentTemplate);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!currentTemplate?.name || !currentTemplate?.subject || !currentTemplate?.content}
              >
                {currentTemplate?.id ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Campaign Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg max-w-3xl w-full mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className="text-lg font-medium mb-4">
              Create Email Campaign
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Campaign Name *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="May Newsletter"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Template *
                </label>
                <select
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject Line *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="May Newsletter: Special Offers Inside!"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Recipients *
                </label>
                <select
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="ALL">All Customers</option>
                  <option value="SEGMENT">Customer Segment</option>
                  <option value="INDIVIDUAL">Selected Individuals</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Schedule For *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  <input
                    type="time"
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendNow"
                  className={`mr-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <label htmlFor="sendNow" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Send immediately instead of scheduling
                </label>
              </div>
            </form>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;