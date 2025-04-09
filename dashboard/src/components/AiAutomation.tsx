import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Bot,
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
  Play,
  Pause,
  Settings,
  Clock,
  BarChart,
  Zap,
  MessageSquare,
  Tag,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface AiAutomationProps {}

interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'customer-service' | 'marketing' | 'inventory' | 'sales';
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  actions: string[];
  performance: {
    successRate: number;
    totalExecutions: number;
    averageResponseTime: number;
    lastExecuted: Date;
  };
  created: Date;
  modified: Date;
}

const AiAutomation: React.FC<AiAutomationProps> = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Mock automations data
  const automations: Automation[] = [
    {
      id: 'AUTO-001',
      name: 'Customer Support Auto-Response',
      description: 'Automatically categorize and respond to common customer inquiries',
      type: 'customer-service',
      status: 'active',
      triggers: ['New support ticket', 'Email received'],
      actions: ['Analyze sentiment', 'Categorize inquiry', 'Send response'],
      performance: {
        successRate: 95.5,
        totalExecutions: 1250,
        averageResponseTime: 8.2,
        lastExecuted: new Date('2024-03-15T10:30:00')
      },
      created: new Date('2024-02-01'),
      modified: new Date('2024-03-10')
    },
    {
      id: 'AUTO-002',
      name: 'Inventory Reorder Alert',
      description: 'Monitor stock levels and trigger reorder notifications',
      type: 'inventory',
      status: 'active',
      triggers: ['Low stock threshold', 'Daily check'],
      actions: ['Check inventory', 'Calculate demand', 'Create order'],
      performance: {
        successRate: 98.2,
        totalExecutions: 450,
        averageResponseTime: 12.5,
        lastExecuted: new Date('2024-03-15T09:45:00')
      },
      created: new Date('2024-02-15'),
      modified: new Date('2024-03-12')
    },
    {
      id: 'AUTO-003',
      name: 'Marketing Campaign Optimizer',
      description: 'Analyze campaign performance and adjust parameters automatically',
      type: 'marketing',
      status: 'paused',
      triggers: ['Campaign metrics update', 'Budget threshold'],
      actions: ['Analyze metrics', 'Adjust bids', 'Update targeting'],
      performance: {
        successRate: 88.7,
        totalExecutions: 320,
        averageResponseTime: 15.8,
        lastExecuted: new Date('2024-03-14T14:20:00')
      },
      created: new Date('2024-03-01'),
      modified: new Date('2024-03-14')
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customer-service':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'marketing':
        return <Tag className="w-4 h-4 text-purple-500" />;
      case 'inventory':
        return <BarChart className="w-4 h-4 text-orange-500" />;
      case 'sales':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      default:
        return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = 
      automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || automation.status === filterStatus;
    const matchesType = filterType === 'all' || automation.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const types = Array.from(new Set(automations.map(automation => automation.type)));

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>AI Automation</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage and monitor your AI-powered automations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Automations',
            value: automations.length,
            trend: '+2 this month',
            icon: Bot
          },
          {
            label: 'Active Automations',
            value: automations.filter(a => a.status === 'active').length,
            trend: '+1 this week',
            icon: Zap
          },
          {
            label: 'Total Executions',
            value: automations.reduce((acc, a) => acc + a.performance.totalExecutions, 0),
            trend: '+1.2k this month',
            icon: Play
          },
          {
            label: 'Avg. Success Rate',
            value: `${(automations.reduce((acc, a) => acc + a.performance.successRate, 0) / automations.length).toFixed(1)}%`,
            trend: '+2.5% vs last month',
            icon: CheckCircle
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg border",
              isDarkMode 
                ? "bg-gray-700 border-gray-600" 
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {stat.label}
              </h3>
              <stat.icon className={cn(
                "w-5 h-5",
                index === 0 ? "text-blue-500" :
                index === 1 ? "text-green-500" :
                index === 2 ? "text-purple-500" :
                "text-orange-500"
              )} />
            </div>
            <p className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
              {stat.value}
            </p>
            <p className={cn(
              "text-sm",
              stat.trend.startsWith('+') ? "text-green-500" : "text-red-500"
            )}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search automations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
        </div>
        
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
              isDarkMode 
                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created Date</option>
            <option value="executions">Sort by Executions</option>
            <option value="success">Sort by Success Rate</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <button
          className={cn(
            "flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </button>

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
            Export
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

      {/* Automations List */}
      {filteredAutomations.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <Bot className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-gray-200" : "text-gray-900")}>No automations found</h3>
          <p className={cn("mt-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredAutomations.map((automation) => (
            <div
              key={automation.id}
              className={cn(
                "p-6 rounded-lg border",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-200"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getTypeIcon(automation.type)}
                    <h3 className={cn("text-lg font-medium mx-3", isDarkMode ? "text-white" : "text-gray-900")}>
                      {automation.name}
                    </h3>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(automation.status)
                    )}>
                      {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                    </span>
                  </div>
                  <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    {automation.description}
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0 space-x-2">
                  <button
                    className={cn(
                      "p-2 rounded-lg",
                      automation.status === 'active'
                        ? "text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                        : "text-green-600 hover:text-green-700 dark:text-green-400"
                    )}
                  >
                    {automation.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button className="p-2 rounded-lg text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg text-red-600 hover:text-red-700 dark:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Success Rate</div>
                  <div className={cn(
                    "text-sm font-medium",
                    automation.performance.successRate >= 95 ? "text-green-600 dark:text-green-400" :
                    automation.performance.successRate >= 90 ? "text-yellow-600 dark:text-yellow-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {automation.performance.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Executions</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                    {automation.performance.totalExecutions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Response Time</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                    {automation.performance.averageResponseTime}s
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Executed</div>
                  <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                    {automation.performance.lastExecuted.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Triggers</div>
                    <div className="flex flex-wrap gap-2">
                      {automation.triggers.map((trigger, index) => (
                        <span
                          key={index}
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                          )}
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Actions</div>
                    <div className="flex flex-wrap gap-2">
                      {automation.actions.map((action, index) => (
                        <span
                          key={index}
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                            "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                          )}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiAutomation; 