import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Campaign Management
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { 
      name,
      description,
      startDate,
      endDate,
      budget,
      targetAudience,
      channels,
      goals,
      status
    } = req.body;
    
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: parseFloat(budget),
        targetAudience,
        channels,
        goals,
        status: status || 'DRAFT'
      }
    });
    
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name,
      description,
      startDate,
      endDate,
      budget,
      targetAudience,
      channels,
      goals,
      status,
      results
    } = req.body;
    
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget: budget !== undefined ? parseFloat(budget) : undefined,
        targetAudience,
        channels,
        goals,
        status,
        results
      }
    });
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.campaign.delete({
      where: { id }
    });
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};

// Promotion Management
export const getPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const { 
      name,
      description,
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      usageCount,
      status
    } = req.body;
    
    const promotion = await prisma.promotion.create({
      data: {
        name,
        description,
        code,
        type,
        value: parseFloat(value),
        minPurchase: minPurchase ? parseFloat(minPurchase) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        usageCount: usageCount ? parseInt(usageCount) : 0,
        status: status || 'ACTIVE'
      }
    });
    
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create promotion' });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name,
      description,
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      usageCount,
      status
    } = req.body;
    
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        name,
        description,
        code,
        type,
        value: value !== undefined ? parseFloat(value) : undefined,
        minPurchase: minPurchase !== undefined ? parseFloat(minPurchase) : undefined,
        maxDiscount: maxDiscount !== undefined ? parseFloat(maxDiscount) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        usageLimit: usageLimit !== undefined ? parseInt(usageLimit) : undefined,
        usageCount: usageCount !== undefined ? parseInt(usageCount) : undefined,
        status
      }
    });
    
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update promotion' });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.promotion.delete({
      where: { id }
    });
    
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
};

// Email Marketing
export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
};

export const createEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { 
      name,
      subject,
      content,
      category,
      isDefault
    } = req.body;
    
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        subject,
        content,
        category,
        isDefault: isDefault || false
      }
    });
    
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create email template' });
  }
};

export const updateEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name,
      subject,
      content,
      category,
      isDefault
    } = req.body;
    
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name,
        subject,
        content,
        category,
        isDefault
      }
    });
    
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email template' });
  }
};

export const deleteEmailTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.emailTemplate.delete({
      where: { id }
    });
    
    res.json({ message: 'Email template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete email template' });
  }
};

export const sendEmailCampaign = async (req: Request, res: Response) => {
  try {
    const { 
      name,
      templateId,
      recipientType,
      recipientIds,
      scheduledFor
    } = req.body;
    
    // Get the email template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId }
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Email template not found' });
    }
    
    // Create the email campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        templateId,
        subject: template.subject,
        content: template.content,
        recipientType,
        recipientIds,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
        status: scheduledFor && new Date(scheduledFor) > new Date() ? 'SCHEDULED' : 'SENT',
        sentAt: scheduledFor && new Date(scheduledFor) > new Date() ? null : new Date()
      }
    });
    
    // In a real app, you would integrate with an email service here
    
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email campaign' });
  }
};

// Social Media Management
export const getSocialMediaPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.socialMediaPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch social media posts' });
  }
};

export const createSocialMediaPost = async (req: Request, res: Response) => {
  try {
    const { 
      content,
      mediaUrls,
      platforms,
      scheduledFor,
      campaign
    } = req.body;
    
    const post = await prisma.socialMediaPost.create({
      data: {
        content,
        mediaUrls: mediaUrls || [],
        platforms,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
        status: scheduledFor && new Date(scheduledFor) > new Date() ? 'SCHEDULED' : 'PUBLISHED',
        publishedAt: scheduledFor && new Date(scheduledFor) > new Date() ? null : new Date(),
        campaign: campaign || null
      }
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create social media post' });
  }
};

export const updateSocialMediaPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      content,
      mediaUrls,
      platforms,
      scheduledFor,
      status,
      campaign
    } = req.body;
    
    const post = await prisma.socialMediaPost.update({
      where: { id },
      data: {
        content,
        mediaUrls,
        platforms,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        status,
        publishedAt: status === 'PUBLISHED' && !scheduledFor ? new Date() : undefined,
        campaign
      }
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update social media post' });
  }
};

export const deleteSocialMediaPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.socialMediaPost.delete({
      where: { id }
    });
    
    res.json({ message: 'Social media post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete social media post' });
  }
};

// Customer Segmentation
export const getCustomerSegments = async (req: Request, res: Response) => {
  try {
    const segments = await prisma.customerSegment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer segments' });
  }
};

export const createCustomerSegment = async (req: Request, res: Response) => {
  try {
    const { 
      name,
      description,
      criteria,
      customerCount
    } = req.body;
    
    const segment = await prisma.customerSegment.create({
      data: {
        name,
        description,
        criteria,
        customerCount: customerCount || 0
      }
    });
    
    res.status(201).json(segment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer segment' });
  }
};

export const updateCustomerSegment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name,
      description,
      criteria,
      customerCount
    } = req.body;
    
    const segment = await prisma.customerSegment.update({
      where: { id },
      data: {
        name,
        description,
        criteria,
        customerCount
      }
    });
    
    res.json(segment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer segment' });
  }
};

export const deleteCustomerSegment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.customerSegment.delete({
      where: { id }
    });
    
    res.json({ message: 'Customer segment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer segment' });
  }
}; 