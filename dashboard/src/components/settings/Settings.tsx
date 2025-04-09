import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from '../ui/toast';
import {
  Settings as SettingsIcon,
  User,
  Link,
  CreditCard,
  FileText,
  Globe,
  Bell,
  Eye,
  Shield,
  Key
} from 'lucide-react';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    siteName: '',
    siteDescription: '',
    timezone: '',
    dateFormat: '',
    timeFormat: '',
    currency: '',
    language: '',
    theme: ''
  });

  // User Settings State
  const [userSettings, setUserSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    emailPreferences: {
      marketing: true,
      updates: true,
      security: true
    },
    displayPreferences: {
      darkMode: false,
      compactView: false
    },
    accessibility: {
      highContrast: false,
      largeText: false
    },
    privacy: {
      profileVisibility: 'public',
      activityTracking: true
    }
  });

  // Integration Settings State
  const [integrations, setIntegrations] = useState([
    {
      id: '1',
      name: 'Payment Gateway',
      enabled: true,
      apiKey: '****',
      endpoint: 'https://api.payment.com'
    },
    {
      id: '2',
      name: 'Email Service',
      enabled: true,
      apiKey: '****',
      endpoint: 'https://api.email.com'
    }
  ]);

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    paymentMethods: {
      creditCard: true,
      paypal: true,
      bankTransfer: false
    },
    taxSettings: {
      enabled: true,
      rate: 0.2
    }
  });

  // Logging Settings State
  const [loggingSettings, setLoggingSettings] = useState({
    level: 'info',
    retention: 30,
    destinations: {
      file: true,
      console: true,
      external: false
    },
    enabledEvents: {
      auth: true,
      transactions: true,
      system: true
    }
  });

  useEffect(() => {
    // Fetch settings from API
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [system, user, integration, payment, logging] = await Promise.all([
        fetch('/api/settings/system').then(res => res.json()),
        fetch('/api/settings/user').then(res => res.json()),
        fetch('/api/settings/integrations').then(res => res.json()),
        fetch('/api/settings/payments').then(res => res.json()),
        fetch('/api/settings/logging').then(res => res.json())
      ]);

      setSystemSettings(system);
      setUserSettings(user);
      setIntegrations(integration);
      setPaymentSettings(payment);
      setLoggingSettings(logging);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        type: 'error'
      });
    }
  };

  const handleSave = async (section: string, data: any) => {
    try {
      const response = await fetch(`/api/settings/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
        type: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        type: 'error'
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="user">
            <User className="w-4 h-4 mr-2" />
            User
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="logging">
            <FileText className="w-4 h-4 mr-2" />
            Logging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Site Name"
                  value={systemSettings.siteName}
                  onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                />
                <Input
                  label="Site Description"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                />
                <Select
                  label="Timezone"
                  value={systemSettings.timezone}
                  onChange={(value) => setSystemSettings({...systemSettings, timezone: value})}
                  options={[
                    { value: 'UTC', label: 'UTC' },
                    { value: 'America/New_York', label: 'Eastern Time' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time' }
                  ]}
                />
                <Select
                  label="Language"
                  value={systemSettings.language}
                  onChange={(value) => setSystemSettings({...systemSettings, language: value})}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' }
                  ]}
                />
              </div>
              <Button onClick={() => handleSave('system', systemSettings)}>
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Switch
                    label="Email Notifications"
                    checked={userSettings.notifications.email}
                    onChange={(checked) => setUserSettings({
                      ...userSettings,
                      notifications: {...userSettings.notifications, email: checked}
                    })}
                  />
                  <Switch
                    label="Push Notifications"
                    checked={userSettings.notifications.push}
                    onChange={(checked) => setUserSettings({
                      ...userSettings,
                      notifications: {...userSettings.notifications, push: checked}
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Display
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Switch
                    label="Dark Mode"
                    checked={userSettings.displayPreferences.darkMode}
                    onChange={(checked) => setUserSettings({
                      ...userSettings,
                      displayPreferences: {...userSettings.displayPreferences, darkMode: checked}
                    })}
                  />
                  <Switch
                    label="Compact View"
                    checked={userSettings.displayPreferences.compactView}
                    onChange={(checked) => setUserSettings({
                      ...userSettings,
                      displayPreferences: {...userSettings.displayPreferences, compactView: checked}
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Profile Visibility"
                    value={userSettings.privacy.profileVisibility}
                    onChange={(value) => setUserSettings({
                      ...userSettings,
                      privacy: {...userSettings.privacy, profileVisibility: value}
                    })}
                    options={[
                      { value: 'public', label: 'Public' },
                      { value: 'private', label: 'Private' },
                      { value: 'contacts', label: 'Contacts Only' }
                    ]}
                  />
                  <Switch
                    label="Activity Tracking"
                    checked={userSettings.privacy.activityTracking}
                    onChange={(checked) => setUserSettings({
                      ...userSettings,
                      privacy: {...userSettings.privacy, activityTracking: checked}
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('user', userSettings)}>
                Save User Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                    <Switch
                      checked={integration.enabled}
                      onChange={(checked) => {
                        const updated = integrations.map(i =>
                          i.id === integration.id ? {...i, enabled: checked} : i
                        );
                        setIntegrations(updated);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="API Key"
                      type="password"
                      value={integration.apiKey}
                      onChange={(e) => {
                        const updated = integrations.map(i =>
                          i.id === integration.id ? {...i, apiKey: e.target.value} : i
                        );
                        setIntegrations(updated);
                      }}
                    />
                    <Input
                      label="Endpoint"
                      value={integration.endpoint}
                      onChange={(e) => {
                        const updated = integrations.map(i =>
                          i.id === integration.id ? {...i, endpoint: e.target.value} : i
                        );
                        setIntegrations(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => handleSave('integrations', integrations)}>
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Default Currency"
                  value={paymentSettings.defaultCurrency}
                  onChange={(value) => setPaymentSettings({
                    ...paymentSettings,
                    defaultCurrency: value
                  })}
                  options={[
                    { value: 'USD', label: 'US Dollar' },
                    { value: 'EUR', label: 'Euro' },
                    { value: 'GBP', label: 'British Pound' }
                  ]}
                />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Payment Methods</h3>
                  <div className="space-y-2">
                    <Switch
                      label="Credit Card"
                      checked={paymentSettings.paymentMethods.creditCard}
                      onChange={(checked) => setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {...paymentSettings.paymentMethods, creditCard: checked}
                      })}
                    />
                    <Switch
                      label="PayPal"
                      checked={paymentSettings.paymentMethods.paypal}
                      onChange={(checked) => setPaymentSettings({
                        ...paymentSettings,
                        paymentMethods: {...paymentSettings.paymentMethods, paypal: checked}
                      })}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSave('payment', paymentSettings)}>
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logging">
          <Card>
            <CardHeader>
              <CardTitle>Logging Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Log Level"
                  value={loggingSettings.level}
                  onChange={(value) => setLoggingSettings({
                    ...loggingSettings,
                    level: value
                  })}
                  options={[
                    { value: 'error', label: 'Error' },
                    { value: 'warn', label: 'Warning' },
                    { value: 'info', label: 'Info' },
                    { value: 'debug', label: 'Debug' }
                  ]}
                />
                <Input
                  label="Retention Period (days)"
                  type="number"
                  value={loggingSettings.retention}
                  onChange={(e) => setLoggingSettings({
                    ...loggingSettings,
                    retention: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Enabled Events</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Switch
                    label="Authentication"
                    checked={loggingSettings.enabledEvents.auth}
                    onChange={(checked) => setLoggingSettings({
                      ...loggingSettings,
                      enabledEvents: {...loggingSettings.enabledEvents, auth: checked}
                    })}
                  />
                  <Switch
                    label="Transactions"
                    checked={loggingSettings.enabledEvents.transactions}
                    onChange={(checked) => setLoggingSettings({
                      ...loggingSettings,
                      enabledEvents: {...loggingSettings.enabledEvents, transactions: checked}
                    })}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave('logging', loggingSettings)}>
                Save Logging Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 