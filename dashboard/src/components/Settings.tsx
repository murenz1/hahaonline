import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  User,
  Shield,
  Bell as BellIcon,
  Mail,
  Smartphone,
  Save
} from 'lucide-react';

interface SettingsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ searchTerm, setSearchTerm }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const settingsSections = [
    {
      title: 'Account',
      icon: <User size={20} />,
      items: [
        { label: 'Profile Information', description: 'Update your account details and profile picture' },
        { label: 'Password', description: 'Change your password and security settings' },
        { label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' }
      ]
    },
    {
      title: 'Appearance',
      icon: <Moon size={20} />,
      items: [
        { label: 'Theme', description: 'Choose between light and dark mode' },
        { label: 'Language', description: 'Select your preferred language' },
        { label: 'Time Zone', description: 'Set your local time zone' }
      ]
    },
    {
      title: 'Notifications',
      icon: <BellIcon size={20} />,
      items: [
        { label: 'Email Notifications', description: 'Manage your email preferences' },
        { label: 'Push Notifications', description: 'Control your mobile notifications' },
        { label: 'Alert Settings', description: 'Customize your alert thresholds' }
      ]
    },
    {
      title: 'Privacy',
      icon: <Shield size={20} />,
      items: [
        { label: 'Data Usage', description: 'Control how your data is used' },
        { label: 'Cookie Settings', description: 'Manage your cookie preferences' },
        { label: 'Privacy Policy', description: 'Read our privacy policy' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Settings</h2>
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500">Toggle dark mode on/off</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe size={20} />
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              {/* Notification Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail size={20} />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email updates</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone size={20} />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive push notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="space-y-4">
          {settingsSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
              </div>
              <div className="divide-y">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6">
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg">
          <Save size={20} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings; 