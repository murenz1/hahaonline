import React from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="absolute right-0 mt-2 w-96 z-50 animate-slideDown">
      <div className={`rounded-lg shadow-lg ring-1 transition-all duration-200 ${
        isDarkMode 
          ? 'bg-gray-800 ring-gray-700'
          : 'bg-white ring-black ring-opacity-5'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell size={20} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`} />
              <h3 className={`font-semibold transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Notifications
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isDarkMode
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1 animate-slideUp ${
                  isDarkMode
                    ? notification.read
                      ? 'bg-gray-700'
                      : 'bg-gray-700/50'
                    : notification.read
                      ? 'bg-gray-50'
                      : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`font-medium transition-colors duration-200 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </p>
                    <p className={`mt-1 text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    <p className={`mt-1 text-xs transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className={`p-1 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                        isDarkMode
                          ? 'text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            className={`mt-4 w-full py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel; 