import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import TicketManagement from './support/TicketManagement';
import CustomerFeedback from './support/CustomerFeedback';
import HelpArticles from './support/HelpArticles';
import LiveChat from './support/LiveChat';

type TabType = 'tickets' | 'feedback' | 'articles' | 'chat';

interface SupportProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const Support: React.FC<SupportProps> = ({ searchTerm, setSearchTerm }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('tickets');

  const tabs = [
    { id: 'tickets', label: 'Ticketing System' },
    { id: 'feedback', label: 'Customer Feedback' },
    { id: 'articles', label: 'Help Articles' },
    { id: 'chat', label: 'Live Chat' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'tickets':
        return <TicketManagement />;
      case 'feedback':
        return <CustomerFeedback />;
      case 'articles':
        return <HelpArticles />;
      case 'chat':
        return <LiveChat />;
      default:
        return <TicketManagement />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Support Dashboard
        </h1>
      </div>

      <div className="border-b mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'border-b-2 border-blue-600 text-blue-600'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {renderActiveTab()}
    </div>
  );
};

export default Support; 