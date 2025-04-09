import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// System Settings
export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSettings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const {
      siteName,
      siteDescription,
      timezone,
      dateFormat,
      timeFormat,
      currency,
      language,
      theme
    } = req.body;

    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 }, // Assuming there's only one system settings record
      update: {
        siteName,
        siteDescription,
        timezone,
        dateFormat,
        timeFormat,
        currency,
        language,
        theme
      },
      create: {
        siteName,
        siteDescription,
        timezone,
        dateFormat,
        timeFormat,
        currency,
        language,
        theme
      }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update system settings' });
  }
};

// User Settings
export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // Assuming user ID is attached by auth middleware
    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user settings' });
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      notifications,
      emailPreferences,
      displayPreferences,
      accessibility,
      privacy
    } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        notifications,
        emailPreferences,
        displayPreferences,
        accessibility,
        privacy
      },
      create: {
        userId,
        notifications,
        emailPreferences,
        displayPreferences,
        accessibility,
        privacy
      }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user settings' });
  }
};

// Integration Settings
export const getIntegrationSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.integrationSettings.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integration settings' });
  }
};

export const updateIntegrationSettings = async (req: Request, res: Response) => {
  try {
    const {
      integrationId,
      apiKey,
      apiSecret,
      endpoint,
      enabled,
      settings
    } = req.body;

    const integration = await prisma.integrationSettings.upsert({
      where: { id: integrationId },
      update: {
        apiKey,
        apiSecret,
        endpoint,
        enabled,
        settings
      },
      create: {
        apiKey,
        apiSecret,
        endpoint,
        enabled,
        settings
      }
    });

    res.json(integration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update integration settings' });
  }
};

// Payment Settings
export const getPaymentSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.paymentSettings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment settings' });
  }
};

export const updatePaymentSettings = async (req: Request, res: Response) => {
  try {
    const {
      defaultCurrency,
      supportedCurrencies,
      paymentMethods,
      taxSettings,
      gatewayConfigurations
    } = req.body;

    const settings = await prisma.paymentSettings.upsert({
      where: { id: 1 }, // Assuming there's only one payment settings record
      update: {
        defaultCurrency,
        supportedCurrencies,
        paymentMethods,
        taxSettings,
        gatewayConfigurations
      },
      create: {
        defaultCurrency,
        supportedCurrencies,
        paymentMethods,
        taxSettings,
        gatewayConfigurations
      }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment settings' });
  }
};

// Logging Settings
export const getLoggingSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.loggingSettings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logging settings' });
  }
};

export const updateLoggingSettings = async (req: Request, res: Response) => {
  try {
    const {
      level,
      retention,
      destinations,
      enabledEvents,
      excludedPaths
    } = req.body;

    const settings = await prisma.loggingSettings.upsert({
      where: { id: 1 }, // Assuming there's only one logging settings record
      update: {
        level,
        retention,
        destinations,
        enabledEvents,
        excludedPaths
      },
      create: {
        level,
        retention,
        destinations,
        enabledEvents,
        excludedPaths
      }
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update logging settings' });
  }
}; 