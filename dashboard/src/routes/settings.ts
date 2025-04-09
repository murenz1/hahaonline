import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSystemSettings,
  updateSystemSettings,
  getUserSettings,
  updateUserSettings,
  getIntegrationSettings,
  updateIntegrationSettings,
  getPaymentSettings,
  updatePaymentSettings,
  getLoggingSettings,
  updateLoggingSettings
} from '../controllers/settings';

const router = Router();

// System Settings
router.get('/system', authenticateToken, getSystemSettings);
router.put('/system', authenticateToken, updateSystemSettings);

// User Settings
router.get('/user', authenticateToken, getUserSettings);
router.put('/user', authenticateToken, updateUserSettings);

// Integration Settings
router.get('/integrations', authenticateToken, getIntegrationSettings);
router.put('/integrations', authenticateToken, updateIntegrationSettings);

// Payment Settings
router.get('/payments', authenticateToken, getPaymentSettings);
router.put('/payments', authenticateToken, updatePaymentSettings);

// Logging Settings
router.get('/logging', authenticateToken, getLoggingSettings);
router.put('/logging', authenticateToken, updateLoggingSettings);

export default router; 