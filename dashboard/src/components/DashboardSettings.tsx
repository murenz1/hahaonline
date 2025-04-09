import React, { useState, useEffect } from 'react';
import { Settings, Bell, Eye, EyeOff, Layout, Grid, List, RefreshCw, Save, Trash } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getDashboardSettings, saveDashboardSettings, saveLayout, resetLayout } from '../utils/dashboardSettings';
import { useNotifications } from '../hooks/useNotifications';

interface DashboardSettingsProps {
  onRefresh: () => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  onRefresh,
  onSaveLayout,
  onResetLayout,
}) => {
  const { isDarkMode } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(getDashboardSettings());

  useEffect(() => {
    setSettings(getDashboardSettings());
  }, []);

  const handleNotificationToggle = () => {
    const newSettings = {
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled,
    };
    setSettings(newSettings);
    saveDashboardSettings(newSettings);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    const newSettings = {
      ...settings,
      viewMode: mode,
    };
    setSettings(newSettings);
    saveDashboardSettings(newSettings);
  };

  const handleAutoRefreshToggle = () => {
    const newSettings = {
      ...settings,
      autoRefresh: !settings.autoRefresh,
    };
    setSettings(newSettings);
    saveDashboardSettings(newSettings);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    const newSettings = {
      ...settings,
      refreshInterval: interval,
    };
    setSettings(newSettings);
    saveDashboardSettings(newSettings);
  };

  const handleSaveLayout = () => {
    onSaveLayout();
    saveLayout({ /* Add layout data here */ });
  };

  const handleResetLayout = () => {
    onResetLayout();
    resetLayout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
          isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
        } ${showSettings ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
      >
        <Settings size={20} />
      </button>

      {showSettings && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg transition-all duration-200 animate-slideDown ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* View Mode */}
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                View Mode
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    settings.viewMode === 'grid'
                      ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      : isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    settings.viewMode === 'list'
                      ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      : isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notifications
              </span>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {unreadCount}
                  </span>
                )}
                <button
                  onClick={handleNotificationToggle}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    settings.notificationsEnabled
                      ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'
                      : isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {settings.notificationsEnabled ? <Bell size={16} /> : <Bell size={16} className="opacity-50" />}
                </button>
              </div>
            </div>

            {/* Auto Refresh */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto Refresh
                </span>
                <button
                  onClick={handleAutoRefreshToggle}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    settings.autoRefresh
                      ? isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                      : isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <RefreshCw size={16} className={settings.autoRefresh ? 'animate-spin' : ''} />
                </button>
              </div>
              {settings.autoRefresh && (
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={settings.refreshInterval}
                    onChange={(e) => handleRefreshIntervalChange(Number(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {settings.refreshInterval}m
                  </span>
                </div>
              )}
            </div>

            {/* Layout Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveLayout}
                className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Save size={16} className="mr-2" />
                <span className="text-sm">Save Layout</span>
              </button>
              <button
                onClick={handleResetLayout}
                className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                }`}
              >
                <Trash size={16} className="mr-2" />
                <span className="text-sm">Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSettings; 