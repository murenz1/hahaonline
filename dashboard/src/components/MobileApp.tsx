import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import {
  Smartphone,
  Tablet,
  Settings,
  Bell,
  Upload,
  Download,
  RefreshCw,
  ChevronDown,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  Star
} from 'lucide-react';

interface MobileAppProps {}

interface AppVersion {
  id: string;
  version: string;
  platform: 'ios' | 'android';
  status: 'live' | 'beta' | 'development';
  releaseDate: Date;
  minOsVersion: string;
  size: string;
  changelog: string[];
}

interface AppMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  platform: 'ios' | 'android' | 'all';
}

const MobileApp: React.FC<MobileAppProps> = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock app versions data
  const appVersions: AppVersion[] = [
    {
      id: 'IOS-001',
      version: '2.1.0',
      platform: 'ios',
      status: 'live',
      releaseDate: new Date('2024-03-15'),
      minOsVersion: 'iOS 14.0',
      size: '45.2 MB',
      changelog: [
        'New feature: Dark mode support',
        'Improved performance',
        'Bug fixes and stability improvements'
      ]
    },
    {
      id: 'IOS-002',
      version: '2.0.1',
      platform: 'ios',
      status: 'live',
      releaseDate: new Date('2024-03-01'),
      minOsVersion: 'iOS 14.0',
      size: '44.8 MB',
      changelog: [
        'Fixed crash on startup for some devices',
        'Minor UI improvements'
      ]
    },
    {
      id: 'AND-001',
      version: '2.1.0',
      platform: 'android',
      status: 'beta',
      releaseDate: new Date('2024-03-14'),
      minOsVersion: 'Android 8.0',
      size: '38.6 MB',
      changelog: [
        'New feature: Dark mode support',
        'Improved performance',
        'Bug fixes and stability improvements'
      ]
    }
  ];

  // Mock metrics data
  const metrics: AppMetric[] = [
    {
      id: 'downloads',
      name: 'Downloads',
      value: 25678,
      change: 12.5,
      trend: 'up',
      platform: 'all'
    },
    {
      id: 'active_users',
      name: 'Active Users',
      value: 18945,
      change: 8.3,
      trend: 'up',
      platform: 'all'
    },
    {
      id: 'rating',
      name: 'App Rating',
      value: 4.8,
      change: 0.2,
      trend: 'up',
      platform: 'all'
    },
    {
      id: 'crashes',
      name: 'Crash Rate',
      value: 0.5,
      change: -0.3,
      trend: 'down',
      platform: 'all'
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'development':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <BarChart3 className="w-4 h-4 text-green-500" />;
    } else if (trend === 'down') {
      return <BarChart3 className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const filteredVersions = appVersions.filter(version => {
    const matchesPlatform = version.platform === activeTab;
    const matchesSearch = 
      version.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.changelog.some(log => log.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || version.status === filterStatus;
    
    return matchesPlatform && matchesSearch && matchesStatus;
  });

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Mobile App</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage your mobile app versions and monitor performance
        </p>
      </div>

      {/* Quick Stats */}
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
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-baseline">
              <p className={cn("text-2xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                {metric.id === 'rating' ? metric.value.toFixed(1) : metric.value.toLocaleString()}
              </p>
              <span className={cn(
                "ml-2 text-sm",
                metric.trend === 'up' 
                  ? metric.id === 'crashes' ? "text-red-500" : "text-green-500"
                  : metric.id === 'crashes' ? "text-green-500" : "text-red-500"
              )}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ios')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm flex items-center",
              activeTab === 'ios'
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <Smartphone className="w-5 h-5 mr-2" />
            iOS
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm flex items-center",
              activeTab === 'android'
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Android
          </button>
        </nav>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search versions..."
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
            <option value="live">Live</option>
            <option value="beta">Beta</option>
            <option value="development">Development</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <button
          className={cn(
            "flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          <Upload className="w-4 h-4 mr-2" />
          Release New Version
        </button>
      </div>

      {/* Versions List */}
      {filteredVersions.length === 0 ? (
        <div className={cn("p-8 text-center rounded-lg", isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <Smartphone className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className={cn("text-lg font-medium", isDarkMode ? "text-gray-200" : "text-gray-900")}>No versions found</h3>
          <p className={cn("mt-2 text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredVersions.map((version) => (
            <div
              key={version.id}
              className={cn(
                "p-6 rounded-lg border",
                isDarkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isDarkMode ? "bg-gray-600" : "bg-gray-100"
                  )}>
                    {version.platform === 'ios' ? (
                      <Smartphone className="w-6 h-6 text-gray-500" />
                    ) : (
                      <Smartphone className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Version {version.version}
                    </h3>
                    <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      Released on {version.releaseDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                    getStatusBadgeClass(version.status)
                  )}>
                    {version.status.charAt(0).toUpperCase() + version.status.slice(1)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Min OS Version
                  </p>
                  <p className={cn("mt-1", isDarkMode ? "text-white" : "text-gray-900")}>
                    {version.minOsVersion}
                  </p>
                </div>
                <div>
                  <p className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Size
                  </p>
                  <p className={cn("mt-1", isDarkMode ? "text-white" : "text-gray-900")}>
                    {version.size}
                  </p>
                </div>
                <div>
                  <p className={cn("text-sm font-medium", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Platform
                  </p>
                  <p className={cn("mt-1 capitalize", isDarkMode ? "text-white" : "text-gray-900")}>
                    {version.platform}
                  </p>
                </div>
              </div>

              <div>
                <p className={cn("text-sm font-medium mb-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Changelog
                </p>
                <ul className={cn("list-disc list-inside space-y-1", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                  {version.changelog.map((log, index) => (
                    <li key={index} className="text-sm">
                      {log}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileApp; 