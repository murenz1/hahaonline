export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  attachments?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface RevenueByPeriod {
  period: string;
  income: number;
  expenses: number;
  net: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNet: number;
  pendingTransactions: number;
  failedTransactions: number;
  categoryTotals: Record<string, number>;
} 