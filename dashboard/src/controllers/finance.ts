import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generatePDF, generateExcel, generateCSV } from '../utils/reportGenerator';

const prisma = new PrismaClient();

// Financial Dashboard
export const getFinancialDashboard = async (req: Request, res: Response) => {
  try {
    const [revenue, expenses, invoices, payments] = await Promise.all([
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: 'paid' }
      }),
      prisma.expense.aggregate({
        _sum: { amount: true }
      }),
      prisma.invoice.findMany({
        where: { status: 'pending' },
        orderBy: { dueDate: 'asc' },
        take: 5
      }),
      prisma.payment.findMany({
        orderBy: { date: 'desc' },
        take: 5
      })
    ]);

    res.json({
      totalRevenue: revenue._sum.amount || 0,
      totalExpenses: expenses._sum.amount || 0,
      pendingInvoices: invoices,
      recentPayments: payments
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial dashboard data' });
  }
};

// Invoice Management
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { customer: true }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.create({
      data: req.body
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    await prisma.invoice.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};

// Expense Management
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = await prisma.expense.create({
      data: req.body
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await prisma.expense.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

// Budget Management
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await prisma.budget.findMany();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

export const createBudget = async (req: Request, res: Response) => {
  try {
    const budget = await prisma.budget.create({
      data: req.body
    });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    await prisma.budget.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};

// Tax Management
export const getTaxRecords = async (req: Request, res: Response) => {
  try {
    const taxRecords = await prisma.taxRecord.findMany();
    res.json(taxRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax records' });
  }
};

export const createTaxRecord = async (req: Request, res: Response) => {
  try {
    const taxRecord = await prisma.taxRecord.create({
      data: req.body
    });
    res.json(taxRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tax record' });
  }
};

export const updateTaxRecord = async (req: Request, res: Response) => {
  try {
    const taxRecord = await prisma.taxRecord.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(taxRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tax record' });
  }
};

export const deleteTaxRecord = async (req: Request, res: Response) => {
  try {
    await prisma.taxRecord.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Tax record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tax record' });
  }
};

// Financial Reports
export const getFinancialReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.financialReport.findMany();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial reports' });
  }
};

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { type, period, format } = req.body;
    let reportData;
    let reportFile;

    switch (type) {
      case 'income_statement':
        reportData = await generateIncomeStatement(period);
        break;
      case 'balance_sheet':
        reportData = await generateBalanceSheet(period);
        break;
      case 'cash_flow':
        reportData = await generateCashFlow(period);
        break;
      default:
        throw new Error('Invalid report type');
    }

    switch (format) {
      case 'pdf':
        reportFile = await generatePDF(reportData);
        break;
      case 'excel':
        reportFile = await generateExcel(reportData);
        break;
      case 'csv':
        reportFile = await generateCSV(reportData);
        break;
      default:
        throw new Error('Invalid format');
    }

    const report = await prisma.financialReport.create({
      data: {
        type,
        period,
        format,
        data: reportData,
        fileUrl: reportFile.url
      }
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Payment Processing
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { customer: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.create({
      data: req.body
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    await prisma.payment.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

export const processPayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status: 'completed' }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status: 'refunded' }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to refund payment' });
  }
};

// Helper functions for report generation
async function generateIncomeStatement(period: string) {
  // Implementation for income statement generation
  return {};
}

async function generateBalanceSheet(period: string) {
  // Implementation for balance sheet generation
  return {};
}

async function generateCashFlow(period: string) {
  // Implementation for cash flow statement generation
  return {};
} 