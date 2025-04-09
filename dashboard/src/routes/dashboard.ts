import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getDashboardMetrics,
  getUserAnalytics,
  getFinancialAnalytics,
  getMarketingAnalytics,
  getRealTimeMetrics
} from '../controllers/analytics';

const router = Router();

// Dashboard Overview
router.get('/metrics', authenticateToken, getDashboardMetrics);
router.get('/real-time', authenticateToken, getRealTimeMetrics);

// User Analytics
router.get('/users', authenticateToken, getUserAnalytics);

// Financial Analytics
router.get('/finance', authenticateToken, getFinancialAnalytics);

// Marketing Analytics
router.get('/marketing', authenticateToken, getMarketingAnalytics);

export default router; 