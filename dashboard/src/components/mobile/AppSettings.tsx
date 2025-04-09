import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Smartphone,
  Bell,
  Lock,
  Globe,
  Palette,
  Download,
  Upload,
  Save,
  RefreshCw,
  Shield,
} from 'lucide-react';

interface AppSettings {
  id: string;
  version: string;
  platform: 'ios' | 'android';
  status: 'active' | 'maintenance' | 'deprecated';
  features: {
    name: string;
    enabled: boolean;
    description: string;
  }[];
  notifications: {
    type: string;
    enabled: boolean;
    schedule: string;
  }[];
  security: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    sessionTimeout: number;
    encryption: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    language: string;
  };
  updates: {
    autoUpdate: boolean;
    lastUpdate: string;
    nextUpdate: string;
  };
  apiConfig: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
}

interface AppSettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onUpdate: () => void;
  onExport: (format: 'json' | 'yaml') => void;
  onImport: (file: File) => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({
  settings,
  onSave,
  onUpdate,
  onExport,
  onImport,
}) => {
  const { theme } = useTheme();
  const [editedSettings, setEditedSettings] = React.useState<AppSettings>(settings);

  const handleFeatureToggle = (featureName: string) => {
    setEditedSettings(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.name === featureName
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    }));
  };

  const handleNotificationToggle = (type: string) => {
    setEditedSettings(prev => ({
      ...prev,
      notifications: prev.notifications.map(notification =>
        notification.type === type
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Mobile App Settings
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => onUpdate()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check for Updates
          </Button>
          <Button variant="outline" onClick={() => onExport('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
        </div>
      </div>

      {/* App Info */}
      <div className={cn(
        "rounded-lg border p-6 space-y-4",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">App Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Version</label>
            <div className="text-lg">{editedSettings.version}</div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Platform</label>
            <div className="text-lg">{editedSettings.platform.toUpperCase()}</div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <div className={cn(
              "text-lg",
              editedSettings.status === 'active' ? 'text-green-500' :
              editedSettings.status === 'maintenance' ? 'text-yellow-500' :
              'text-red-500'
            )}>
              {editedSettings.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={cn(
        "rounded-lg border p-6 space-y-4",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Features</h2>
        </div>
        <div className="space-y-4">
          {editedSettings.features.map((feature) => (
            <div
              key={feature.name}
              className="flex items-start justify-between"
            >
              <div>
                <div className="font-medium">{feature.name}</div>
                <div className="text-sm text-gray-500">{feature.description}</div>
              </div>
              <Button
                variant={feature.enabled ? "default" : "outline"}
                onClick={() => handleFeatureToggle(feature.name)}
              >
                {feature.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className={cn(
        "rounded-lg border p-6 space-y-4",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {editedSettings.notifications.map((notification) => (
            <div
              key={notification.type}
              className="flex items-start justify-between"
            >
              <div>
                <div className="font-medium">{notification.type}</div>
                <div className="text-sm text-gray-500">Schedule: {notification.schedule}</div>
              </div>
              <Button
                variant={notification.enabled ? "default" : "outline"}
                onClick={() => handleNotificationToggle(notification.type)}
              >
                {notification.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={cn(
        "rounded-lg border p-6 space-y-4",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Two-Factor Authentication</label>
            <Select
              value={editedSettings.security.twoFactorAuth ? 'enabled' : 'disabled'}
              onValueChange={(value) => setEditedSettings(prev => ({
                ...prev,
                security: { ...prev.security, twoFactorAuth: value === 'enabled' }
              }))}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="enabled">Enabled</Select.Item>
                <Select.Item value="disabled">Disabled</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-500">Biometric Authentication</label>
            <Select
              value={editedSettings.security.biometricAuth ? 'enabled' : 'disabled'}
              onValueChange={(value) => setEditedSettings(prev => ({
                ...prev,
                security: { ...prev.security, biometricAuth: value === 'enabled' }
              }))}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="enabled">Enabled</Select.Item>
                <Select.Item value="disabled">Disabled</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-500">Session Timeout (minutes)</label>
            <Input
              type="number"
              value={editedSettings.security.sessionTimeout}
              onChange={(e) => setEditedSettings(prev => ({
                ...prev,
                security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className={cn(
        "rounded-lg border p-6 space-y-4",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Theme</label>
            <Select
              value={editedSettings.appearance.theme}
              onValueChange={(value) => setEditedSettings(prev => ({
                ...prev,
                appearance: { ...prev.appearance, theme: value as 'light' | 'dark' | 'system' }
              }))}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="light">Light</Select.Item>
                <Select.Item value="dark">Dark</Select.Item>
                <Select.Item value="system">System</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-500">Font Size</label>
            <Select
              value={editedSettings.appearance.fontSize}
              onValueChange={(value) => setEditedSettings(prev => ({
                ...prev,
                appearance: { ...prev.appearance, fontSize: value as 'small' | 'medium' | 'large' }
              }))}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="small">Small</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="large">Large</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-500">Language</label>
            <Input
              value={editedSettings.appearance.language}
              onChange={(e) => setEditedSettings(prev => ({
                ...prev,
                appearance: { ...prev.appearance, language: e.target.value }
              }))}
            />
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className={cn(
        "rounded-lg border p-6 space-y-4",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">API Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Base URL</label>
            <Input
              value={editedSettings.apiConfig.baseUrl}
              onChange={(e) => setEditedSettings(prev => ({
                ...prev,
                apiConfig: { ...prev.apiConfig, baseUrl: e.target.value }
              }))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Timeout (ms)</label>
            <Input
              type="number"
              value={editedSettings.apiConfig.timeout}
              onChange={(e) => setEditedSettings(prev => ({
                ...prev,
                apiConfig: { ...prev.apiConfig, timeout: parseInt(e.target.value) }
              }))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Retry Attempts</label>
            <Input
              type="number"
              value={editedSettings.apiConfig.retryAttempts}
              onChange={(e) => setEditedSettings(prev => ({
                ...prev,
                apiConfig: { ...prev.apiConfig, retryAttempts: parseInt(e.target.value) }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={() => onSave(editedSettings)}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}; 