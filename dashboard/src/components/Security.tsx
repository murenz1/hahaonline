import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Shield,
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
  Lock,
  Key,
  UserCheck,
  Users,
  Eye,
  EyeOff,
  FileText,
  Activity,
  Globe,
  Clock
} from 'lucide-react';

interface SecurityProps {}

interface SecurityEvent {
  id: string;
  type: 'login' | 'permission_change' | 'settings_change' | 'security_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  ip: string;
  location: string;
  timestamp: Date;
  description: string;
  status: 'resolved' | 'pending' | 'investigating';
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'access_control' | 'data_protection' | 'monitoring';
  enabled: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

const Security: React.FC<SecurityProps> = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'events' | 'settings'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock security events data
  const securityEvents: SecurityEvent[] = [
    {
      id: 'EVT-001',
      type: 'login',
      severity: 'low',
      user: 'john.doe@example.com',
      ip: '192.168.1.100',
      location: 'New York, US',
      timestamp: new Date('2024-03-15T10:30:00'),
      description: 'Successful login from recognized device',
      status: 'resolved'
    },
    {
      id: 'EVT-002',
      type: 'security_alert',
      severity: 'high',
      user: 'system',
      ip: '203.0.113.45',
      location: 'Unknown',
      timestamp: new Date('2024-03-15T09:45:00'),
      description: 'Multiple failed login attempts detected',
      status: 'investigating'
    },
    {
      id: 'EVT-003',
      type: 'permission_change',
      severity: 'medium',
      user: 'admin@example.com',
      ip: '192.168.1.200',
      location: 'London, UK',
      timestamp: new Date('2024-03-15T08:15:00'),
      description: 'User role permissions modified',
      status: 'resolved'
    }
  ];

  // Mock security settings data
  const securitySettings: SecuritySetting[] = [
    {
      id: 'SET-001',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all user accounts',
      category: 'authentication',
      enabled: true,
      lastUpdated: new Date('2024-03-10'),
      updatedBy: 'admin@example.com'
    },
    {
      id: 'SET-002',
      name: 'Password Policy',
      description: 'Enforce strong password requirements',
      category: 'authentication',
      enabled: true,
      lastUpdated: new Date('2024-03-12'),
      updatedBy: 'admin@example.com'
    },
    {
      id: 'SET-003',
      name: 'Session Timeout',
      description: 'Automatically log out inactive users after 30 minutes',
      category: 'access_control',
      enabled: true,
      lastUpdated: new Date('2024-03-14'),
      updatedBy: 'admin@example.com'
    },
    {
      id: 'SET-004',
      name: 'Data Encryption',
      description: 'Enable end-to-end encryption for sensitive data',
      category: 'data_protection',
      enabled: true,
      lastUpdated: new Date('2024-03-15'),
      updatedBy: 'admin@example.com'
    }
  ];

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Key className="w-4 h-4 text-blue-500" />;
      case 'access_control':
        return <Lock className="w-4 h-4 text-purple-500" />;
      case 'data_protection':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'monitoring':
        return <Activity className="w-4 h-4 text-orange-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch = 
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const filteredSettings = securitySettings.filter(setting => {
    const matchesSearch = 
      setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || setting.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Security</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage security settings and monitor security events
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Security Score',
            value: '85/100',
            trend: '+5 vs last month',
            icon: Shield
          },
          {
            label: 'Active Users',
            value: '156',
            trend: '+12 this week',
            icon: Users
          },
          {
            label: 'Security Events',
            value: securityEvents.length,
            trend: '+3 today',
            icon: Activity
          },
          {
            label: 'Settings Enabled',
            value: `${securitySettings.filter(s => s.enabled).length}/${securitySettings.length}`,
            trend: 'All recommended',
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
              stat.trend.startsWith('+') ? "text-green-500" : "text-gray-500"
            )}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('events')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              activeTab === 'events'
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            Security Events
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              activeTab === 'settings'
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            Security Settings
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={activeTab === 'events' ? "Search security events..." : "Search security settings..."}
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
        
        {activeTab === 'events' ? (
          <div className="relative">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className={cn(
                "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              )}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        ) : (
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={cn(
                "px-4 py-2 w-full rounded-lg border appearance-none pr-10 focus:ring-2 focus:outline-none",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              )}
            >
              <option value="all">All Categories</option>
              <option value="authentication">Authentication</option>
              <option value="access_control">Access Control</option>
              <option value="data_protection">Data Protection</option>
              <option value="monitoring">Monitoring</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'events' ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className={cn("min-w-full divide-y", isDarkMode ? "divide-gray-700" : "divide-gray-200")}>
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Severity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white")}>
              {filteredEvents.map((event) => (
                <tr key={event.id} className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                          {event.id}
                        </div>
                        <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {event.user}
                    </div>
                    <div className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      {event.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getSeverityBadgeClass(event.severity)
                    )}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      getStatusBadgeClass(event.status)
                    )}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mx-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSettings.map((setting) => (
            <div
              key={setting.id}
              className={cn(
                "p-6 rounded-lg border",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getCategoryIcon(setting.category)}
                  <div className="ml-3">
                    <h3 className={cn("text-lg font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      {setting.name}
                    </h3>
                    <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      {setting.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      className={cn(
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        setting.enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          setting.enabled ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                Last updated {setting.lastUpdated.toLocaleDateString()} by {setting.updatedBy}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Security; 