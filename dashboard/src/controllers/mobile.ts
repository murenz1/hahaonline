import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// App Version Management
export const getAppVersions = async (req: Request, res: Response) => {
  try {
    const versions = await prisma.appVersion.findMany({
      orderBy: { releaseDate: 'desc' }
    });
    
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch app versions' });
  }
};

export const createAppVersion = async (req: Request, res: Response) => {
  try {
    const { 
      versionNumber, 
      releaseNotes, 
      platform, 
      minOsVersion,
      isForced,
      status
    } = req.body;
    
    const version = await prisma.appVersion.create({
      data: {
        versionNumber,
        releaseNotes,
        platform,
        minOsVersion,
        isForced: isForced || false,
        status: status || 'PENDING',
        releaseDate: new Date()
      }
    });
    
    res.status(201).json(version);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create app version' });
  }
};

export const updateAppVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      versionNumber, 
      releaseNotes, 
      platform, 
      minOsVersion,
      isForced,
      status
    } = req.body;
    
    const version = await prisma.appVersion.update({
      where: { id },
      data: {
        versionNumber,
        releaseNotes,
        platform,
        minOsVersion,
        isForced,
        status
      }
    });
    
    res.json(version);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update app version' });
  }
};

export const deleteAppVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.appVersion.delete({
      where: { id }
    });
    
    res.json({ message: 'App version deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete app version' });
  }
};

// App Analytics
export const getAppAnalytics = async (req: Request, res: Response) => {
  try {
    const { period } = req.query;
    
    // Define date range based on period
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      // Default to last 30 days
      startDate.setDate(startDate.getDate() - 30);
    }
    
    // Get analytics data
    const [
      totalUsers,
      newUsers,
      activeUsers,
      sessions,
      crashes,
      retention
    ] = await Promise.all([
      prisma.appAnalytics.aggregate({
        _sum: { totalUsers: true }
      }),
      prisma.appAnalytics.aggregate({
        _sum: { newUsers: true },
        where: { date: { gte: startDate } }
      }),
      prisma.appAnalytics.aggregate({
        _sum: { activeUsers: true },
        where: { date: { gte: startDate } }
      }),
      prisma.appAnalytics.aggregate({
        _sum: { sessions: true },
        where: { date: { gte: startDate } }
      }),
      prisma.appAnalytics.aggregate({
        _sum: { crashes: true },
        where: { date: { gte: startDate } }
      }),
      prisma.appAnalytics.findMany({
        select: { date: true, retention: true },
        where: { date: { gte: startDate } },
        orderBy: { date: 'asc' }
      })
    ]);
    
    // Get daily data for charts
    const dailyData = await prisma.appAnalytics.findMany({
      where: { date: { gte: startDate } },
      orderBy: { date: 'asc' }
    });
    
    res.json({
      overview: {
        totalUsers: totalUsers._sum.totalUsers || 0,
        newUsers: newUsers._sum.newUsers || 0,
        activeUsers: activeUsers._sum.activeUsers || 0,
        sessions: sessions._sum.sessions || 0,
        crashes: crashes._sum.crashes || 0,
        retentionRate: retention.length > 0 
          ? retention.reduce((acc, val) => acc + val.retention, 0) / retention.length 
          : 0
      },
      dailyData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch app analytics' });
  }
};

// Push Notifications
export const getPushNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.pushNotification.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch push notifications' });
  }
};

export const sendPushNotification = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      body, 
      data, 
      targetType, 
      targetUsers, 
      scheduledFor 
    } = req.body;
    
    // Create the notification record
    const notification = await prisma.pushNotification.create({
      data: {
        title,
        body,
        data: data || {},
        targetType: targetType || 'ALL',
        targetUsers: targetUsers || [],
        scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
        status: scheduledFor && new Date(scheduledFor) > new Date() ? 'SCHEDULED' : 'SENT',
        sentAt: scheduledFor && new Date(scheduledFor) > new Date() ? null : new Date()
      }
    });
    
    // In a real app, you would integrate with a push notification service here
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send push notification' });
  }
};

// App Store Management
export const getAppStoreInfo = async (req: Request, res: Response) => {
  try {
    const appStore = await prisma.appStoreInfo.findFirst();
    
    res.json(appStore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch app store info' });
  }
};

export const updateAppStoreInfo = async (req: Request, res: Response) => {
  try {
    const { 
      appName, 
      description, 
      shortDescription, 
      keywords, 
      privacyPolicyUrl,
      supportUrl,
      marketingUrl,
      screenshots,
      icon
    } = req.body;
    
    const appStore = await prisma.appStoreInfo.upsert({
      where: { id: 1 }, // Assuming there's only one app store info record
      update: {
        appName,
        description,
        shortDescription,
        keywords,
        privacyPolicyUrl,
        supportUrl,
        marketingUrl,
        screenshots,
        icon
      },
      create: {
        appName,
        description,
        shortDescription,
        keywords,
        privacyPolicyUrl,
        supportUrl,
        marketingUrl,
        screenshots,
        icon
      }
    });
    
    res.json(appStore);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update app store info' });
  }
}; 