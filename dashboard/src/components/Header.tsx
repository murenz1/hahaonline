import React, { useState } from 'react';
import { Search, Bell, User, Moon, Sun } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  notifications: any[];
  userName: string;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  notifications,
  userName
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMarkAsRead = (id: string) => {
    // Implement mark as read functionality
    console.log('Mark as read:', id);
  };

  return (
    <div className={`border-b transition-colors ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Hello, {userName}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-64 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <Search className={`absolute left-3 top-2.5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} size={20} />
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-yellow-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </div>

          <div className="flex items-center space-x-3">
            <img
              src="/avatars/profile.jpg"
              alt={userName}
              className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-green-500"
            />
            <span className={`font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {userName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 