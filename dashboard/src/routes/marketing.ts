import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  sendEmailCampaign,
  getSocialMediaPosts,
  createSocialMediaPost,
  updateSocialMediaPost,
  deleteSocialMediaPost,
  getCustomerSegments,
  createCustomerSegment,
  updateCustomerSegment,
  deleteCustomerSegment
} from '../controllers/marketing';

const router = Router();

// Campaign Management
router.get('/campaigns', authenticateToken, getCampaigns);
router.post('/campaigns', authenticateToken, createCampaign);
router.put('/campaigns/:id', authenticateToken, updateCampaign);
router.delete('/campaigns/:id', authenticateToken, deleteCampaign);

// Promotion Management
router.get('/promotions', authenticateToken, getPromotions);
router.post('/promotions', authenticateToken, createPromotion);
router.put('/promotions/:id', authenticateToken, updatePromotion);
router.delete('/promotions/:id', authenticateToken, deletePromotion);

// Email Marketing
router.get('/email/templates', authenticateToken, getEmailTemplates);
router.post('/email/templates', authenticateToken, createEmailTemplate);
router.put('/email/templates/:id', authenticateToken, updateEmailTemplate);
router.delete('/email/templates/:id', authenticateToken, deleteEmailTemplate);
router.post('/email/campaigns', authenticateToken, sendEmailCampaign);

// Social Media Management
router.get('/social/posts', authenticateToken, getSocialMediaPosts);
router.post('/social/posts', authenticateToken, createSocialMediaPost);
router.put('/social/posts/:id', authenticateToken, updateSocialMediaPost);
router.delete('/social/posts/:id', authenticateToken, deleteSocialMediaPost);

// Customer Segmentation
router.get('/segments', authenticateToken, getCustomerSegments);
router.post('/segments', authenticateToken, createCustomerSegment);
router.put('/segments/:id', authenticateToken, updateCustomerSegment);
router.delete('/segments/:id', authenticateToken, deleteCustomerSegment);

export default router; 