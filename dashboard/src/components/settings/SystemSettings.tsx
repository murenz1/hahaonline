import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Server,
  Clock,
  Key,
  AlertTriangle,
} from 'lucide-react';

interface SystemSettings {
  general: {
    companyName: string;
    timezone: string;
    dateFormat: string;
    language: string;
    currency: string;
  };
  notifications: {
    email: {
      enabled: boolean;
      server: string;
      port: number;
      username: string;
      password: string;
      fromAddress: string;
    };
    push: {
      enabled: boolean;
      apiKey: string;
      projectId: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
      senderId: string;
    };
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      requireUppercase: boolean;
    };
    ipWhitelist: string[];
  };
  database: {
    backup: {
      enabled: boolean;
      frequency: string;
      retention: number;
      location: string;
    };
    optimization: {
      enabled: boolean;
      schedule: string;
    };
  };
  api: {
    rateLimit: number;
    timeout: number;
    cors: {
      enabled: boolean;
      allowedOrigins: string[];
    };
  };
}

interface SystemSettingsProps {
  settings: SystemSettings;
  onSave: (settings: SystemSettings) => void;
  onReset: () => void;
  onTestEmail: () => void;
  onTestPush: () => void;
  onTestSMS: () => void;
  onBackupNow: () => void;
  onOptimizeNow: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onSave,
  onReset,
  onTestEmail,
  onTestPush,
  onTestSMS,
  onBackupNow,
  onOptimizeNow,
}) => {
  const { theme } = useTheme();
  const [editedSettings, setEditedSettings] = React.useState<SystemSettings>(settings);

  const handleSave = () => {
    onSave(editedSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          System Settings
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Company Name</label>
            <Input
              value={editedSettings.general.companyName}
              onChange={(e) => setEditedSettings({
                ...editedSettings,
                general: {
                  ...editedSettings.general,
                  companyName: e.target.value
                }
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Timezone</label>
            <Select
              value={editedSettings.general.timezone}
              onValueChange={(value) => setEditedSettings({
                ...editedSettings,
                general: {
                  ...editedSettings.general,
                  timezone: value
                }
              })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="UTC">UTC</Select.Item>
                <Select.Item value="EST">Eastern Time</Select.Item>
                <Select.Item value="PST">Pacific Time</Select.Item>
                <Select.Item value="GMT">Greenwich Mean Time</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Date Format</label>
            <Select
              value={editedSettings.general.dateFormat}
              onValueChange={(value) => setEditedSettings({
                ...editedSettings,
                general: {
                  ...editedSettings.general,
                  dateFormat: value
                }
              })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="MM/DD/YYYY">MM/DD/YYYY</Select.Item>
                <Select.Item value="DD/MM/YYYY">DD/MM/YYYY</Select.Item>
                <Select.Item value="YYYY-MM-DD">YYYY-MM-DD</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Language</label>
            <Select
              value={editedSettings.general.language}
              onValueChange={(value) => setEditedSettings({
                ...editedSettings,
                general: {
                  ...editedSettings.general,
                  language: value
                }
              })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="en">English</Select.Item>
                <Select.Item value="es">Spanish</Select.Item>
                <Select.Item value="fr">French</Select.Item>
                <Select.Item value="de">German</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        
        {/* Email Settings */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Email Notifications</h3>
            <Switch
              checked={editedSettings.notifications.email.enabled}
              onCheckedChange={(checked) => setEditedSettings({
                ...editedSettings,
                notifications: {
                  ...editedSettings.notifications,
                  email: {
                    ...editedSettings.notifications.email,
                    enabled: checked
                  }
                }
              })}
            />
          </div>
          {editedSettings.notifications.email.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">SMTP Server</label>
                <Input
                  value={editedSettings.notifications.email.server}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      email: {
                        ...editedSettings.notifications.email,
                        server: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Port</label>
                <Input
                  type="number"
                  value={editedSettings.notifications.email.port}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      email: {
                        ...editedSettings.notifications.email,
                        port: parseInt(e.target.value)
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Username</label>
                <Input
                  value={editedSettings.notifications.email.username}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      email: {
                        ...editedSettings.notifications.email,
                        username: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <Input
                  type="password"
                  value={editedSettings.notifications.email.password}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      email: {
                        ...editedSettings.notifications.email,
                        password: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">From Address</label>
                <Input
                  value={editedSettings.notifications.email.fromAddress}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      email: {
                        ...editedSettings.notifications.email,
                        fromAddress: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={onTestEmail}>
                  Test Email
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Push Notification Settings */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Push Notifications</h3>
            <Switch
              checked={editedSettings.notifications.push.enabled}
              onCheckedChange={(checked) => setEditedSettings({
                ...editedSettings,
                notifications: {
                  ...editedSettings.notifications,
                  push: {
                    ...editedSettings.notifications.push,
                    enabled: checked
                  }
                }
              })}
            />
          </div>
          {editedSettings.notifications.push.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">API Key</label>
                <Input
                  value={editedSettings.notifications.push.apiKey}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      push: {
                        ...editedSettings.notifications.push,
                        apiKey: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Project ID</label>
                <Input
                  value={editedSettings.notifications.push.projectId}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      push: {
                        ...editedSettings.notifications.push,
                        projectId: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <Button variant="outline" onClick={onTestPush}>
                  Test Push
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* SMS Settings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">SMS Notifications</h3>
            <Switch
              checked={editedSettings.notifications.sms.enabled}
              onCheckedChange={(checked) => setEditedSettings({
                ...editedSettings,
                notifications: {
                  ...editedSettings.notifications,
                  sms: {
                    ...editedSettings.notifications.sms,
                    enabled: checked
                  }
                }
              })}
            />
          </div>
          {editedSettings.notifications.sms.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Provider</label>
                <Select
                  value={editedSettings.notifications.sms.provider}
                  onValueChange={(value) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      sms: {
                        ...editedSettings.notifications.sms,
                        provider: value
                      }
                    }
                  })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="twilio">Twilio</Select.Item>
                    <Select.Item value="nexmo">Nexmo</Select.Item>
                    <Select.Item value="plivo">Plivo</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">API Key</label>
                <Input
                  value={editedSettings.notifications.sms.apiKey}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      sms: {
                        ...editedSettings.notifications.sms,
                        apiKey: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sender ID</label>
                <Input
                  value={editedSettings.notifications.sms.senderId}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    notifications: {
                      ...editedSettings.notifications,
                      sms: {
                        ...editedSettings.notifications.sms,
                        senderId: e.target.value
                      }
                    }
                  })}
                />
              </div>
              <div>
                <Button variant="outline" onClick={onTestSMS}>
                  Test SMS
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
            </div>
            <Switch
              checked={editedSettings.security.twoFactorAuth}
              onCheckedChange={(checked) => setEditedSettings({
                ...editedSettings,
                security: {
                  ...editedSettings.security,
                  twoFactorAuth: checked
                }
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Session Timeout (minutes)</label>
            <Input
              type="number"
              value={editedSettings.security.sessionTimeout}
              onChange={(e) => setEditedSettings({
                ...editedSettings,
                security: {
                  ...editedSettings.security,
                  sessionTimeout: parseInt(e.target.value)
                }
              })}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Password Policy</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Minimum Length</label>
                <Input
                  type="number"
                  value={editedSettings.security.passwordPolicy.minLength}
                  onChange={(e) => setEditedSettings({
                    ...editedSettings,
                    security: {
                      ...editedSettings.security,
                      passwordPolicy: {
                        ...editedSettings.security.passwordPolicy,
                        minLength: parseInt(e.target.value)
                      }
                    }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Numbers</span>
                <Switch
                  checked={editedSettings.security.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => setEditedSettings({
                    ...editedSettings,
                    security: {
                      ...editedSettings.security,
                      passwordPolicy: {
                        ...editedSettings.security.passwordPolicy,
                        requireNumbers: checked
                      }
                    }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Special Characters</span>
                <Switch
                  checked={editedSettings.security.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => setEditedSettings({
                    ...editedSettings,
                    security: {
                      ...editedSettings.security,
                      passwordPolicy: {
                        ...editedSettings.security.passwordPolicy,
                        requireSpecialChars: checked
                      }
                    }
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Require Uppercase</span>
                <Switch
                  checked={editedSettings.security.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => setEditedSettings({
                    ...editedSettings,
                    security: {
                      ...editedSettings.security,
                      passwordPolicy: {
                        ...editedSettings.security.passwordPolicy,
                        requireUppercase: checked
                      }
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">IP Whitelist</label>
            <Input
              value={editedSettings.security.ipWhitelist.join(', ')}
              onChange={(e) => setEditedSettings({
                ...editedSettings,
                security: {
                  ...editedSettings.security,
                  ipWhitelist: e.target.value.split(',').map(ip => ip.trim())
                }
              })}
              placeholder="Enter IP addresses separated by commas"
            />
          </div>
        </div>
      </div>

      {/* Database Settings */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <h2 className="text-lg font-semibold mb-4">Database Settings</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Backup Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Automatic Backups</span>
                <Switch
                  checked={editedSettings.database.backup.enabled}
                  onCheckedChange={(checked) => setEditedSettings({
                    ...editedSettings,
                    database: {
                      ...editedSettings.database,
                      backup: {
                        ...editedSettings.database.backup,
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>
              {editedSettings.database.backup.enabled && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Backup Frequency</label>
                    <Select
                      value={editedSettings.database.backup.frequency}
                      onValueChange={(value) => setEditedSettings({
                        ...editedSettings,
                        database: {
                          ...editedSettings.database,
                          backup: {
                            ...editedSettings.database.backup,
                            frequency: value
                          }
                        }
                      })}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="daily">Daily</Select.Item>
                        <Select.Item value="weekly">Weekly</Select.Item>
                        <Select.Item value="monthly">Monthly</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Retention Period (days)</label>
                    <Input
                      type="number"
                      value={editedSettings.database.backup.retention}
                      onChange={(e) => setEditedSettings({
                        ...editedSettings,
                        database: {
                          ...editedSettings.database,
                          backup: {
                            ...editedSettings.database.backup,
                            retention: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Backup Location</label>
                    <Input
                      value={editedSettings.database.backup.location}
                      onChange={(e) => setEditedSettings({
                        ...editedSettings,
                        database: {
                          ...editedSettings.database,
                          backup: {
                            ...editedSettings.database.backup,
                            location: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Button variant="outline" onClick={onBackupNow}>
                      Backup Now
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Optimization Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Automatic Optimization</span>
                <Switch
                  checked={editedSettings.database.optimization.enabled}
                  onCheckedChange={(checked) => setEditedSettings({
                    ...editedSettings,
                    database: {
                      ...editedSettings.database,
                      optimization: {
                        ...editedSettings.database.optimization,
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>
              {editedSettings.database.optimization.enabled && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Optimization Schedule</label>
                    <Select
                      value={editedSettings.database.optimization.schedule}
                      onValueChange={(value) => setEditedSettings({
                        ...editedSettings,
                        database: {
                          ...editedSettings.database,
                          optimization: {
                            ...editedSettings.database.optimization,
                            schedule: value
                          }
                        }
                      })}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="daily">Daily</Select.Item>
                        <Select.Item value="weekly">Weekly</Select.Item>
                        <Select.Item value="monthly">Monthly</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                  <div>
                    <Button variant="outline" onClick={onOptimizeNow}>
                      Optimize Now
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className={cn(
        "rounded-lg border p-6",
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      )}>
        <h2 className="text-lg font-semibold mb-4">API Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Rate Limit (requests per minute)</label>
            <Input
              type="number"
              value={editedSettings.api.rateLimit}
              onChange={(e) => setEditedSettings({
                ...editedSettings,
                api: {
                  ...editedSettings.api,
                  rateLimit: parseInt(e.target.value)
                }
              })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Timeout (seconds)</label>
            <Input
              type="number"
              value={editedSettings.api.timeout}
              onChange={(e) => setEditedSettings({
                ...editedSettings,
                api: {
                  ...editedSettings.api,
                  timeout: parseInt(e.target.value)
                }
              })}
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">CORS Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable CORS</span>
                <Switch
                  checked={editedSettings.api.cors.enabled}
                  onCheckedChange={(checked) => setEditedSettings({
                    ...editedSettings,
                    api: {
                      ...editedSettings.api,
                      cors: {
                        ...editedSettings.api.cors,
                        enabled: checked
                      }
                    }
                  })}
                />
              </div>
              {editedSettings.api.cors.enabled && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Allowed Origins</label>
                  <Input
                    value={editedSettings.api.cors.allowedOrigins.join(', ')}
                    onChange={(e) => setEditedSettings({
                      ...editedSettings,
                      api: {
                        ...editedSettings.api,
                        cors: {
                          ...editedSettings.api.cors,
                          allowedOrigins: e.target.value.split(',').map(origin => origin.trim())
                        }
                      }
                    })}
                    placeholder="Enter origins separated by commas"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 