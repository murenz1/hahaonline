import { useState, useEffect } from 'react';
import { notificationService, Notification } from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial load
    setUnreadCount(notificationService.getUnreadCount());

    // Subscribe to notifications
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    // Request notification permission
    notificationService.requestPermission();

    return () => {
      unsubscribe();
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    notificationService.addNotification(notification);
  };

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const clearNotifications = () => {
    notificationService.clearNotifications();
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  };
}; 