import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { Transaction } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onViewDetails?: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr
              key={transaction.id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-3">
                {format(new Date(transaction.date), 'MMM d, yyyy')}
              </td>
              <td className="px-4 py-3">{transaction.description}</td>
              <td className="px-4 py-3">{transaction.category}</td>
              <td className={cn(
                "px-4 py-3 text-right font-medium",
                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  {
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': transaction.status === 'completed',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': transaction.status === 'pending',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': transaction.status === 'failed'
                  }
                )}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 