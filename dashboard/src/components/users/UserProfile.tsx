import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Bell,
  Globe,
  Save,
  Camera,
  Shield,
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  role: string;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    lastLogin: string;
  };
}

interface UserProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onUpdatePassword: () => void;
  onEnableTwoFactor: () => void;
  onDisableTwoFactor: () => void;
  onUploadAvatar: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  onSave,
  onUpdatePassword,
  onEnableTwoFactor,
  onDisableTwoFactor,
  onUploadAvatar,
}) => {
  const { theme } = useTheme();
  const [editedProfile, setEditedProfile] = React.useState<UserProfile>(profile);

  const handleSave = () => {
    onSave(editedProfile);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Profile Settings
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className={cn(
          "rounded-lg border p-6",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <button
                onClick={onUploadAvatar}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-gray-200 hover:bg-gray-100"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <h2 className="text-xl font-semibold">{editedProfile.name}</h2>
            <p className="text-gray-500">{editedProfile.role}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">{editedProfile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">{editedProfile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">{editedProfile.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">Joined {editedProfile.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className={cn(
          "rounded-lg border p-6",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Switch
                    checked={editedProfile.preferences.notifications.email}
                    onCheckedChange={(checked) => setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        notifications: {
                          ...editedProfile.preferences.notifications,
                          email: checked
                        }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Switch
                    checked={editedProfile.preferences.notifications.push}
                    onCheckedChange={(checked) => setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        notifications: {
                          ...editedProfile.preferences.notifications,
                          push: checked
                        }
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Notifications</span>
                  <Switch
                    checked={editedProfile.preferences.notifications.sms}
                    onCheckedChange={(checked) => setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        notifications: {
                          ...editedProfile.preferences.notifications,
                          sms: checked
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Language & Region</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Language</label>
                  <Select
                    value={editedProfile.preferences.language}
                    onValueChange={(value) => setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        language: value
                      }
                    })}
                  >
                    <Select.Trigger>
                      <Globe className="w-4 h-4 mr-2" />
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
                <div>
                  <label className="text-sm font-medium mb-1 block">Timezone</label>
                  <Select
                    value={editedProfile.preferences.timezone}
                    onValueChange={(value) => setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        timezone: value
                      }
                    })}
                  >
                    <Select.Trigger>
                      <Calendar className="w-4 h-4 mr-2" />
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
                  <label className="text-sm font-medium mb-1 block">Theme</label>
                  <Select
                    value={editedProfile.preferences.theme}
                    onValueChange={(value) => setEditedProfile({
                      ...editedProfile,
                      preferences: {
                        ...editedProfile.preferences,
                        theme: value as 'light' | 'dark' | 'system'
                      }
                    })}
                  >
                    <Select.Trigger>
                      <Bell className="w-4 h-4 mr-2" />
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="light">Light</Select.Item>
                      <Select.Item value="dark">Dark</Select.Item>
                      <Select.Item value="system">System</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className={cn(
          "rounded-lg border p-6",
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        )}>
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500">
                    {editedProfile.security.twoFactorEnabled
                      ? 'Enabled'
                      : 'Add an extra layer of security to your account'}
                  </div>
                </div>
                {editedProfile.security.twoFactorEnabled ? (
                  <Button
                    variant="outline"
                    onClick={onDisableTwoFactor}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Disable
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={onEnableTwoFactor}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Enable
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Password</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  Last changed: {editedProfile.security.lastPasswordChange}
                </div>
                <Button
                  variant="outline"
                  onClick={onUpdatePassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Recent Activity</h3>
              <div className="text-sm">
                Last login: {editedProfile.security.lastLogin}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 