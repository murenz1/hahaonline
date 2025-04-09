import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  Bell,
  Send,
  Clock,
  Users,
  Target,
  Plus,
  Trash2,
  Edit,
  BarChart3,
} from 'lucide-react';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'promotional' | 'transactional' | 'alert' | 'update';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  schedule: string;
  targetAudience: {
    platform: ('ios' | 'android')[];
    segments: string[];
    filters: {
      lastActive: string;
      version: string;
      language: string;
    };
  };
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversion: number;
  };
}

interface PushNotificationManagementProps {
  notifications: PushNotification[];
  onAddNotification: (notification: Omit<PushNotification, 'id'>) => void;
  onEditNotification: (id: string, notification: Partial<PushNotification>) => void;
  onDeleteNotification: (id: string) => void;
  onSendNotification: (id: string) => void;
  onScheduleNotification: (id: string, schedule: string) => void;
}

export const PushNotificationManagement: React.FC<PushNotificationManagementProps> = ({
  notifications,
  onAddNotification,
  onEditNotification,
  onDeleteNotification,
  onSendNotification,
  onScheduleNotification,
}) => {
  const { theme } = useTheme();
  const [isAddingNotification, setIsAddingNotification] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<PushNotification['type']>('promotional');

  const getStatusColor = (status: PushNotification['status']) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500';
      case 'scheduled':
        return 'text-yellow-500';
      case 'sent':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeColor = (type: PushNotification['type']) => {
    switch (type) {
      case 'promotional':
        return 'text-blue-500';
      case 'transactional':
        return 'text-green-500';
      case 'alert':
        return 'text-red-500';
      case 'update':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Push Notifications
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingNotification(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "rounded-lg border p-6 space-y-4",
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold">{notification.title}</h2>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    getTypeColor(notification.type)
                  )}>
                    {notification.type.toUpperCase()}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    getStatusColor(notification.status)
                  )}>
                    {notification.status.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{notification.message}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditNotification(notification.id, notification)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteNotification(notification.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="font-medium mb-2">Target Audience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Platforms</span>
                  </div>
                  <div className="flex gap-2">
                    {notification.targetAudience.platform.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {platform.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Segments</span>
                  </div>
                  <div className="flex gap-2">
                    {notification.targetAudience.segments.map((segment) => (
                      <span
                        key={segment}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {segment}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="font-medium mb-2">Schedule</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {notification.status === 'scheduled'
                    ? `Scheduled for ${notification.schedule}`
                    : 'Not scheduled'}
                </span>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h3 className="font-medium mb-2">Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Sent</div>
                  <div className="text-lg font-bold">{notification.analytics.sent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Delivered</div>
                  <div className="text-lg font-bold">{notification.analytics.delivered.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Opened</div>
                  <div className="text-lg font-bold">{notification.analytics.opened.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Clicked</div>
                  <div className="text-lg font-bold">{notification.analytics.clicked.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Conversion</div>
                  <div className="text-lg font-bold">{notification.analytics.conversion.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendNotification(notification.id)}
                disabled={notification.status === 'sent'}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onScheduleNotification(notification.id, new Date().toISOString())}
                disabled={notification.status === 'scheduled'}
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notification Modal */}
      {isAddingNotification && (
        <div className={cn(
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          <div className={cn(
            "bg-white rounded-lg p-6 w-full max-w-2xl",
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          )}>
            <h2 className="text-xl font-semibold mb-4">Create New Notification</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Type</label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value as PushNotification['type'])}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="promotional">Promotional</Select.Item>
                    <Select.Item value="transactional">Transactional</Select.Item>
                    <Select.Item value="alert">Alert</Select.Item>
                    <Select.Item value="update">Update</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-500">Title</label>
                <Input placeholder="Enter notification title" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Message</label>
                <Input as="textarea" rows={4} placeholder="Enter notification message" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Target Platforms</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">iOS</Button>
                  <Button variant="outline" size="sm">Android</Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddingNotification(false)}>
                Cancel
              </Button>
              <Button>
                Create Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 