import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  onClose
}) => {
  const { isDarkMode } = useTheme();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderField = (label: string, value: string | number | Date | undefined) => {
    if (value === undefined || value === '') return null;

    let displayValue: string;
    if (value instanceof Date) {
      displayValue = formatDate(value);
    } else if (typeof value === 'number') {
      displayValue = formatAmount(value);
    } else {
      displayValue = value.toString();
    }

    return (
      <div className="mb-4">
        <dt className={cn(
          "text-sm font-medium mb-1",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          {label}
        </dt>
        <dd className={cn(
          "text-base",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {displayValue}
        </dd>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={cn(
        "w-full max-w-md rounded-lg p-6 relative",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-1 rounded-lg",
            isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={cn(
          "text-xl font-semibold mb-6",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Transaction Details
        </h2>

        <dl>
          {renderField('ID', transaction.id)}
          {renderField('Description', transaction.description)}
          {renderField('Amount', transaction.amount)}
          {renderField('Type', transaction.type)}
          {renderField('Category', transaction.category)}
          {renderField('Status', transaction.status)}
          {renderField('Reference', transaction.reference)}
          {renderField('Created At', transaction.createdAt)}
          {renderField('Updated At', transaction.updatedAt)}
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-lg font-medium",
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails; 