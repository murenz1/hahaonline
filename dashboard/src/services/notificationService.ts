import { getDashboardSettings } from '../utils/dashboardSettings';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  private constructor() {
    // Load notifications from localStorage
    this.loadNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private loadNotifications(): void {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        this.notifications = JSON.parse(storedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.notifications);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const settings = getDashboardSettings();
    if (!settings.notificationsEnabled) return;

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
      });
    }
  }

  public markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.saveNotifications();
    this.notifyListeners();
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  public clearNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public requestPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }
}

export const notificationService = NotificationService.getInstance(); 