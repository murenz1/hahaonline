import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getFinancialDashboard,
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getTaxRecords,
  createTaxRecord,
  updateTaxRecord,
  deleteTaxRecord,
  getFinancialReports,
  generateReport,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  refundPayment
} from '../controllers/finance';

const router = Router();

// Financial Dashboard
router.get('/dashboard', authenticateToken, getFinancialDashboard);

// Invoice Management
router.get('/invoices', authenticateToken, getInvoices);
router.post('/invoices', authenticateToken, createInvoice);
router.put('/invoices/:id', authenticateToken, updateInvoice);
router.delete('/invoices/:id', authenticateToken, deleteInvoice);

// Expense Management
router.get('/expenses', authenticateToken, getExpenses);
router.post('/expenses', authenticateToken, createExpense);
router.put('/expenses/:id', authenticateToken, updateExpense);
router.delete('/expenses/:id', authenticateToken, deleteExpense);

// Budget Management
router.get('/budgets', authenticateToken, getBudgets);
router.post('/budgets', authenticateToken, createBudget);
router.put('/budgets/:id', authenticateToken, updateBudget);
router.delete('/budgets/:id', authenticateToken, deleteBudget);

// Tax Management
router.get('/taxes', authenticateToken, getTaxRecords);
router.post('/taxes', authenticateToken, createTaxRecord);
router.put('/taxes/:id', authenticateToken, updateTaxRecord);
router.delete('/taxes/:id', authenticateToken, deleteTaxRecord);

// Financial Reports
router.get('/reports', authenticateToken, getFinancialReports);
router.post('/reports/generate', authenticateToken, generateReport);

// Payment Processing
router.get('/payments', authenticateToken, getPayments);
router.post('/payments', authenticateToken, createPayment);
router.put('/payments/:id', authenticateToken, updatePayment);
router.delete('/payments/:id', authenticateToken, deletePayment);
router.post('/payments/:id/process', authenticateToken, processPayment);
router.post('/payments/:id/refund', authenticateToken, refundPayment);

export default router; 