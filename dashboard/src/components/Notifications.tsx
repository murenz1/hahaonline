import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { DropdownMenu } from './ui/DropdownMenu';
import { Bell, Check, X, Trash2 } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { cn } from '../utils/cn';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = () => {
      const loadedNotifications = notificationService.getNotifications();
      setNotifications(loadedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    };

    loadNotifications();
    const unsubscribe = notificationService.subscribe(loadNotifications);

    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const handleClearAll = () => {
    notificationService.clearNotifications();
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const notificationItems = [
    {
      label: 'Mark all as read',
      icon: <Check className="h-4 w-4" />,
      onClick: handleMarkAllAsRead,
    },
    {
      label: 'Clear all',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleClearAll,
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        icon={Bell}
        className="relative"
        onClick={() => {/* Handle notification click */}}
      >
        Notifications
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <DropdownMenu items={notificationItems} />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 border-b border-gray-200 dark:border-gray-700',
                  !notification.read && 'bg-gray-50 dark:bg-gray-700'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getTypeColor(notification.type)
                        )}
                      >
                        {notification.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="mt-1 font-medium">{notification.title}</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Check}
                        onClick={() => handleMarkAsRead(notification.id)}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={() => handleDelete(notification.id)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 