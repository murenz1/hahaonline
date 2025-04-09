import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAppVersions,
  createAppVersion,
  updateAppVersion,
  deleteAppVersion,
  getAppAnalytics,
  getPushNotifications,
  sendPushNotification,
  getAppStoreInfo,
  updateAppStoreInfo
} from '../controllers/mobile';

const router = Router();

// App Version Management
router.get('/versions', authenticateToken, getAppVersions);
router.post('/versions', authenticateToken, createAppVersion);
router.put('/versions/:id', authenticateToken, updateAppVersion);
router.delete('/versions/:id', authenticateToken, deleteAppVersion);

// App Analytics
router.get('/analytics', authenticateToken, getAppAnalytics);

// Push Notifications
router.get('/notifications', authenticateToken, getPushNotifications);
router.post('/notifications', authenticateToken, sendPushNotification);

// App Store Management
router.get('/store', authenticateToken, getAppStoreInfo);
router.put('/store', authenticateToken, updateAppStoreInfo);

export default router; 