import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import PromotionManagement from './marketing/PromotionManagement';
import EmailMarketing from './marketing/EmailMarketing';
import CustomerSegmentation from './marketing/CustomerSegmentation';
import SocialMediaManagement from './marketing/SocialMediaManagement';

type TabType = 'promotions' | 'email' | 'segmentation' | 'social';

interface MarketingProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const Marketing: React.FC<MarketingProps> = ({ searchTerm, setSearchTerm }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('promotions');

  const tabs = [
    { id: 'promotions', label: 'Promotions' },
    { id: 'email', label: 'Email Marketing' },
    { id: 'segmentation', label: 'Customer Segments' },
    { id: 'social', label: 'Social Media' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'promotions':
        return <PromotionManagement />;
      case 'email':
        return <EmailMarketing />;
      case 'segmentation':
        return <CustomerSegmentation />;
      case 'social':
        return <SocialMediaManagement />;
      default:
        return <PromotionManagement />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className={cn(
          "text-2xl font-semibold",
          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
        )}>
          Marketing Dashboard
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

export default Marketing; 