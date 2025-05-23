import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { CustomersManager } from './customers/CustomersManager';

interface CustomersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Customers: React.FC<CustomersProps> = ({ searchTerm, setSearchTerm }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn("p-6 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}>
      <div className="mb-6">
        <h2 className={cn("text-xl font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>Customers</h2>
        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Manage your customer relationships
        </p>
      </div>
      
      {/* New Customers Manager Component */}
      <CustomersManager />
    </div>
  );
};

export default Customers;
