import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSalesAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
  getMarketingAnalytics,
  getFinancialAnalytics,
  generateSalesReport,
  generateCustomerReport,
  generateInventoryReport,
  generateMarketingReport,
  generateFinancialReport
} from '../controllers/analytics';

const router = Router();

// Analytics Data
router.get('/sales', authenticateToken, getSalesAnalytics);
router.get('/customers', authenticateToken, getCustomerAnalytics);
router.get('/inventory', authenticateToken, getInventoryAnalytics);
router.get('/marketing', authenticateToken, getMarketingAnalytics);
router.get('/financial', authenticateToken, getFinancialAnalytics);

// Report Generation
router.post('/sales/report', authenticateToken, generateSalesReport);
router.post('/customers/report', authenticateToken, generateCustomerReport);
router.post('/inventory/report', authenticateToken, generateInventoryReport);
router.post('/marketing/report', authenticateToken, generateMarketingReport);
router.post('/financial/report', authenticateToken, generateFinancialReport);

export default router; 