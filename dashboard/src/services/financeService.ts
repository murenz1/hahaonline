import { Transaction, RevenueByPeriod } from '../types';
import { addDays, addWeeks, addMonths, addYears, isBefore, startOfDay } from 'date-fns';

const TRANSACTIONS_STORAGE_KEY = 'bolt_transactions';
const CATEGORIES_STORAGE_KEY = 'bolt_finance_categories';
const RECURRING_TRANSACTIONS_STORAGE_KEY = 'bolt_recurring_transactions';

export const defaultCategories = {
  income: [
    'Sales',
    'Investments',
    'Refunds',
    'Services',
    'Other Income'
  ],
  expense: [
    'Inventory',
    'Salaries',
    'Marketing',
    'Utilities',
    'Rent',
    'Equipment',
    'Software',
    'Office Supplies',
    'Travel',
    'Other Expenses'
  ]
};

export const financeService = {
  getTransactions: (): Transaction[] => {
    try {
      const transactionsJson = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (!transactionsJson) {
        return [];
      }
      
      const transactions = JSON.parse(transactionsJson);
      return transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }));
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
    try {
      const transactions = financeService.getTransactions();
      const now = new Date();
      const newTransaction: Transaction = {
        ...transaction,
        id: `TRX-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        tags: transaction.tags || []
      };
      
      transactions.push(newTransaction);
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

      // Handle recurring transactions
      if (transaction.isRecurring && transaction.recurringFrequency) {
        const recurringTransactions = financeService.getRecurringTransactions();
        recurringTransactions.push(newTransaction);
        localStorage.setItem(RECURRING_TRANSACTIONS_STORAGE_KEY, JSON.stringify(recurringTransactions));
      }

      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  updateTransaction: (id: string, updates: Partial<Transaction>): Transaction => {
    try {
      const transactions = financeService.getTransactions();
      const index = transactions.findIndex(t => t.id === id);
      
      if (index === -1) {
        throw new Error('Transaction not found');
      }
      
      const updatedTransaction = {
        ...transactions[index],
        ...updates,
        updatedAt: new Date()
      };
      
      transactions[index] = updatedTransaction;
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

      // Update recurring transaction if needed
      if (updatedTransaction.isRecurring) {
        const recurringTransactions = financeService.getRecurringTransactions();
        const recurringIndex = recurringTransactions.findIndex(t => t.id === id);
        if (recurringIndex !== -1) {
          recurringTransactions[recurringIndex] = updatedTransaction;
          localStorage.setItem(RECURRING_TRANSACTIONS_STORAGE_KEY, JSON.stringify(recurringTransactions));
        }
      }

      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: (id: string): boolean => {
    try {
      const transactions = financeService.getTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      
      if (filteredTransactions.length === transactions.length) {
        return false;
      }
      
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(filteredTransactions));

      // Remove from recurring transactions if needed
      const recurringTransactions = financeService.getRecurringTransactions();
      const filteredRecurring = recurringTransactions.filter(t => t.id !== id);
      if (filteredRecurring.length !== recurringTransactions.length) {
        localStorage.setItem(RECURRING_TRANSACTIONS_STORAGE_KEY, JSON.stringify(filteredRecurring));
      }

      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  },

  getCategories: () => {
    try {
      const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (!categoriesJson) {
        // Initialize with default categories
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
        return defaultCategories;
      }
      return JSON.parse(categoriesJson);
    } catch (error) {
      console.error('Error getting categories:', error);
      return defaultCategories;
    }
  },

  addCategory: (type: 'income' | 'expense', category: string): boolean => {
    try {
      const categories = financeService.getCategories();
      if (!categories[type].includes(category)) {
        categories[type].push(category);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  },

  deleteCategory: (type: 'income' | 'expense', category: string): boolean => {
    try {
      const categories = financeService.getCategories();
      const index = categories[type].indexOf(category);
      
      if (index !== -1) {
        categories[type].splice(index, 1);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  },

  getRecurringTransactions: (): Transaction[] => {
    try {
      const recurringJson = localStorage.getItem(RECURRING_TRANSACTIONS_STORAGE_KEY);
      if (!recurringJson) {
        return [];
      }
      
      const transactions = JSON.parse(recurringJson);
      return transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }));
    } catch (error) {
      console.error('Error getting recurring transactions:', error);
      return [];
    }
  },

  processRecurringTransactions: () => {
    try {
      const recurringTransactions = financeService.getRecurringTransactions();
      const today = startOfDay(new Date());
      let newTransactions: Transaction[] = [];

      recurringTransactions.forEach(transaction => {
        if (!transaction.recurringFrequency) return;

        let nextDate = new Date(transaction.date);
        while (isBefore(nextDate, today)) {
          switch (transaction.recurringFrequency) {
            case 'daily':
              nextDate = addDays(nextDate, 1);
              break;
            case 'weekly':
              nextDate = addWeeks(nextDate, 1);
              break;
            case 'monthly':
              nextDate = addMonths(nextDate, 1);
              break;
            case 'yearly':
              nextDate = addYears(nextDate, 1);
              break;
          }

          if (isBefore(nextDate, today)) {
            const newTransaction: Transaction = {
              ...transaction,
              id: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: nextDate,
              createdAt: new Date(),
              updatedAt: new Date(),
              status: 'pending'
            };
            newTransactions.push(newTransaction);
          }
        }

        // Update the next date in the recurring transaction
        transaction.date = nextDate;
      });

      if (newTransactions.length > 0) {
        const transactions = financeService.getTransactions();
        transactions.push(...newTransactions);
        localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
        localStorage.setItem(RECURRING_TRANSACTIONS_STORAGE_KEY, JSON.stringify(recurringTransactions));
      }

      return newTransactions;
    } catch (error) {
      console.error('Error processing recurring transactions:', error);
      return [];
    }
  },

  getTransactionStats: () => {
    const transactions = financeService.getTransactions();
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlyNet: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      categoryTotals: {} as Record<string, number>
    };

    transactions.forEach(t => {
      if (t.type === 'income') {
        stats.totalIncome += t.amount;
      } else {
        stats.totalExpenses += t.amount;
      }

      if (t.status === 'pending') stats.pendingTransactions++;
      if (t.status === 'failed') stats.failedTransactions++;

      if (!stats.categoryTotals[t.category]) {
        stats.categoryTotals[t.category] = 0;
      }
      stats.categoryTotals[t.category] += t.amount;
    });

    monthlyTransactions.forEach(t => {
      if (t.type === 'income') {
        stats.monthlyIncome += t.amount;
      } else {
        stats.monthlyExpenses += t.amount;
      }
    });

    stats.netIncome = stats.totalIncome - stats.totalExpenses;
    stats.monthlyNet = stats.monthlyIncome - stats.monthlyExpenses;

    return stats;
  },

  getRevenueByPeriod: (periodType: 'daily' | 'weekly' | 'monthly', periods: number): RevenueByPeriod[] => {
    const transactions = financeService.getTransactions();
    const now = new Date();
    const result: RevenueByPeriod[] = [];

    for (let i = periods - 1; i >= 0; i--) {
      const period = new Date(now);
      
      switch (periodType) {
        case 'daily':
          period.setDate(period.getDate() - i);
          break;
        case 'weekly':
          period.setDate(period.getDate() - (i * 7));
          break;
        case 'monthly':
          period.setMonth(period.getMonth() - i);
          break;
      }

      const periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        switch (periodType) {
          case 'daily':
            return transactionDate.getDate() === period.getDate() &&
                   transactionDate.getMonth() === period.getMonth() &&
                   transactionDate.getFullYear() === period.getFullYear();
          case 'weekly':
            const weekStart = new Date(period);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return transactionDate >= weekStart && transactionDate <= weekEnd;
          case 'monthly':
            return transactionDate.getMonth() === period.getMonth() &&
                   transactionDate.getFullYear() === period.getFullYear();
        }
      });

      const periodData: RevenueByPeriod = {
        period: periodType === 'monthly'
          ? `${period.toLocaleString('default', { month: 'short' })} ${period.getFullYear()}`
          : period.toLocaleDateString(),
        income: periodTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expenses: periodTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
        net: 0
      };

      periodData.net = periodData.income - periodData.expenses;
      result.push(periodData);
    }

    return result;
  },

  getFinancialSummary: () => {
    const transactions = financeService.getTransactions();
    const stats = financeService.getTransactionStats();
    const categories = financeService.getCategories();

    return {
      stats,
      categories,
      transactionCount: transactions.length,
      lastUpdated: new Date()
    };
  }
}; 