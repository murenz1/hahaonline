import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generatePDF, generateExcel, generateCSV } from '../utils/reportGenerator';

const prisma = new PrismaClient();

// Sales Analytics
export const getSalesAnalytics = async (req: Request, res: Response) => {
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
    
    // Get sales analytics data
    const [
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByProduct,
      salesByCategory,
      salesByDay
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startDate } }
      }),
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.order.aggregate({
        _avg: { total: true },
        where: { createdAt: { gte: startDate } }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { total: true, quantity: true },
        where: { order: { createdAt: { gte: startDate } } },
        orderBy: { _sum: { total: 'desc' } },
        take: 10
      }),
      prisma.$queryRaw`
        SELECT p.category, SUM(oi.total) as total
        FROM OrderItem oi
        JOIN Product p ON oi.productId = p.id
        JOIN Order o ON oi.orderId = o.id
        WHERE o.createdAt >= ${startDate}
        GROUP BY p.category
        ORDER BY total DESC
      `,
      prisma.$queryRaw`
        SELECT DATE(o.createdAt) as date, SUM(o.total) as total
        FROM Order o
        WHERE o.createdAt >= ${startDate}
        GROUP BY DATE(o.createdAt)
        ORDER BY date ASC
      `
    ]);
    
    res.json({
      overview: {
        totalSales: totalSales._sum.total || 0,
        totalOrders,
        averageOrderValue: averageOrderValue._avg.total || 0
      },
      salesByProduct,
      salesByCategory,
      salesByDay
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
};

// Customer Analytics
export const getCustomerAnalytics = async (req: Request, res: Response) => {
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
    
    // Get customer analytics data
    const [
      totalCustomers,
      newCustomers,
      returningCustomers,
      topCustomers,
      customersByLocation,
      customersByLTV
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.order.groupBy({
        by: ['customerId'],
        _count: true,
        having: {
          _count: {
            id: {
              gt: 1
            }
          }
        },
        where: { createdAt: { gte: startDate } }
      }),
      prisma.order.groupBy({
        by: ['customerId'],
        _sum: { total: true },
        _count: true,
        orderBy: { _sum: { total: 'desc' } },
        take: 10,
        where: { createdAt: { gte: startDate } }
      }),
      prisma.$queryRaw`
        SELECT c.location, COUNT(*) as count
        FROM Customer c
        WHERE c.createdAt >= ${startDate}
        GROUP BY c.location
        ORDER BY count DESC
      `,
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN SUM(o.total) < 100 THEN 'Low'
            WHEN SUM(o.total) < 500 THEN 'Medium'
            ELSE 'High'
          END as ltv_category,
          COUNT(*) as count
        FROM Customer c
        JOIN Order o ON c.id = o.customerId
        GROUP BY ltv_category
        ORDER BY 
          CASE 
            WHEN ltv_category = 'Low' THEN 1
            WHEN ltv_category = 'Medium' THEN 2
            ELSE 3
          END
      `
    ]);
    
    res.json({
      overview: {
        totalCustomers,
        newCustomers,
        returningCustomers: returningCustomers.length,
        churnRate: calculateChurnRate(totalCustomers, newCustomers, returningCustomers.length)
      },
      topCustomers,
      customersByLocation,
      customersByLTV
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer analytics' });
  }
};

// Inventory Analytics
export const getInventoryAnalytics = async (req: Request, res: Response) => {
  try {
    // Get inventory analytics data
    const [
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      topSellingProducts,
      inventoryValue,
      inventoryTurnover
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: { 
          stock: { lt: 10 },
          stock: { gt: 0 }
        }
      }),
      prisma.product.count({
        where: { stock: 0 }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      }),
      prisma.product.aggregate({
        _sum: {
          stock: true,
          price: true
        }
      }),
      prisma.$queryRaw`
        SELECT AVG(turnover) as avg_turnover
        FROM (
          SELECT 
            p.id,
            SUM(oi.quantity) / ((p.stock + 10) / 2) as turnover
          FROM Product p
          LEFT JOIN OrderItem oi ON p.id = oi.productId
          GROUP BY p.id
        ) as product_turnover
      `
    ]);
    
    // Calculate inventory value
    const totalValue = inventoryValue._sum.stock * inventoryValue._sum.price;
    
    res.json({
      overview: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        inventoryValue: totalValue || 0,
        inventoryTurnover: inventoryTurnover[0]?.avg_turnover || 0
      },
      topSellingProducts,
      lowStockProducts: await prisma.product.findMany({
        where: { 
          stock: { lt: 10 },
          stock: { gt: 0 }
        },
        orderBy: { stock: 'asc' },
        take: 10
      })
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory analytics' });
  }
};

// Marketing Analytics
export const getMarketingAnalytics = async (req: Request, res: Response) => {
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
    
    // Get marketing analytics data
    const [
      campaigns,
      promotions,
      emailCampaigns,
      socialMediaPosts
    ] = await Promise.all([
      prisma.campaign.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.promotion.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.emailCampaign.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.socialMediaPost.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' }
      })
    ]);
    
    // Calculate metrics
    const totalCampaigns = campaigns.length;
    const totalPromoUsage = promotions.reduce((sum, promo) => sum + (promo.usageCount || 0), 0);
    const totalEmailsSent = emailCampaigns.reduce((sum, email) => sum + (email.sentCount || 0), 0);
    const totalEmailOpens = emailCampaigns.reduce((sum, email) => sum + (email.openCount || 0), 0);
    const totalEmailClicks = emailCampaigns.reduce((sum, email) => sum + (email.clickCount || 0), 0);
    
    const emailOpenRate = totalEmailsSent > 0 ? (totalEmailOpens / totalEmailsSent) * 100 : 0;
    const emailClickRate = totalEmailOpens > 0 ? (totalEmailClicks / totalEmailOpens) * 100 : 0;
    
    res.json({
      overview: {
        totalCampaigns,
        activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
        totalPromoUsage,
        emailOpenRate,
        emailClickRate
      },
      campaigns,
      promotions,
      emailCampaigns,
      socialMediaPosts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketing analytics' });
  }
};

// Financial Analytics
export const getFinancialAnalytics = async (req: Request, res: Response) => {
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
    
    // Get financial analytics data
    const [
      revenue,
      expenses,
      pendingInvoices,
      paidInvoices,
      overdueInvoices
    ] = await Promise.all([
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { 
          status: 'paid',
          date: { gte: startDate }
        }
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startDate } }
      }),
      prisma.invoice.findMany({
        where: { 
          status: 'pending',
          date: { gte: startDate }
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.invoice.findMany({
        where: { 
          status: 'paid',
          date: { gte: startDate }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.invoice.findMany({
        where: { 
          status: 'overdue',
          date: { gte: startDate }
        },
        orderBy: { dueDate: 'asc' }
      })
    ]);
    
    // Calculate financial metrics
    const totalRevenue = revenue._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;
    
    const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    res.json({
      overview: {
        totalRevenue,
        totalExpenses,
        netIncome,
        profitMargin,
        pendingAmount: totalPendingAmount,
        overdueAmount: totalOverdueAmount
      },
      pendingInvoices,
      paidInvoices,
      overdueInvoices
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial analytics' });
  }
};

// Report Generation
export const generateSalesReport = async (req: Request, res: Response) => {
  try {
    const { period, format } = req.body;
    
    // Get sales data for the report
    const salesData = await getSalesReportData(period);
    
    // Generate the report in the requested format
    let reportFile;
    switch (format) {
      case 'pdf':
        reportFile = await generatePDF(salesData);
        break;
      case 'excel':
        reportFile = await generateExcel(salesData);
        break;
      case 'csv':
        reportFile = await generateCSV(salesData);
        break;
      default:
        throw new Error('Invalid format');
    }
    
    // Create a record of the generated report
    const report = await prisma.report.create({
      data: {
        type: 'sales',
        period,
        format,
        fileUrl: reportFile.url,
        generatedBy: req.user.id
      }
    });
    
    res.json({
      message: 'Sales report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
};

export const generateCustomerReport = async (req: Request, res: Response) => {
  try {
    const { period, format } = req.body;
    
    // Get customer data for the report
    const customerData = await getCustomerReportData(period);
    
    // Generate the report in the requested format
    let reportFile;
    switch (format) {
      case 'pdf':
        reportFile = await generatePDF(customerData);
        break;
      case 'excel':
        reportFile = await generateExcel(customerData);
        break;
      case 'csv':
        reportFile = await generateCSV(customerData);
        break;
      default:
        throw new Error('Invalid format');
    }
    
    // Create a record of the generated report
    const report = await prisma.report.create({
      data: {
        type: 'customer',
        period,
        format,
        fileUrl: reportFile.url,
        generatedBy: req.user.id
      }
    });
    
    res.json({
      message: 'Customer report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate customer report' });
  }
};

export const generateInventoryReport = async (req: Request, res: Response) => {
  try {
    const { format } = req.body;
    
    // Get inventory data for the report
    const inventoryData = await getInventoryReportData();
    
    // Generate the report in the requested format
    let reportFile;
    switch (format) {
      case 'pdf':
        reportFile = await generatePDF(inventoryData);
        break;
      case 'excel':
        reportFile = await generateExcel(inventoryData);
        break;
      case 'csv':
        reportFile = await generateCSV(inventoryData);
        break;
      default:
        throw new Error('Invalid format');
    }
    
    // Create a record of the generated report
    const report = await prisma.report.create({
      data: {
        type: 'inventory',
        period: 'current',
        format,
        fileUrl: reportFile.url,
        generatedBy: req.user.id
      }
    });
    
    res.json({
      message: 'Inventory report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate inventory report' });
  }
};

export const generateMarketingReport = async (req: Request, res: Response) => {
  try {
    const { period, format } = req.body;
    
    // Get marketing data for the report
    const marketingData = await getMarketingReportData(period);
    
    // Generate the report in the requested format
    let reportFile;
    switch (format) {
      case 'pdf':
        reportFile = await generatePDF(marketingData);
        break;
      case 'excel':
        reportFile = await generateExcel(marketingData);
        break;
      case 'csv':
        reportFile = await generateCSV(marketingData);
        break;
      default:
        throw new Error('Invalid format');
    }
    
    // Create a record of the generated report
    const report = await prisma.report.create({
      data: {
        type: 'marketing',
        period,
        format,
        fileUrl: reportFile.url,
        generatedBy: req.user.id
      }
    });
    
    res.json({
      message: 'Marketing report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate marketing report' });
  }
};

export const generateFinancialReport = async (req: Request, res: Response) => {
  try {
    const { period, format, type } = req.body;
    
    // Get financial data for the report
    let financialData;
    switch (type) {
      case 'income_statement':
        financialData = await getIncomeStatementData(period);
        break;
      case 'balance_sheet':
        financialData = await getBalanceSheetData();
        break;
      case 'cash_flow':
        financialData = await getCashFlowData(period);
        break;
      default:
        throw new Error('Invalid report type');
    }
    
    // Generate the report in the requested format
    let reportFile;
    switch (format) {
      case 'pdf':
        reportFile = await generatePDF(financialData);
        break;
      case 'excel':
        reportFile = await generateExcel(financialData);
        break;
      case 'csv':
        reportFile = await generateCSV(financialData);
        break;
      default:
        throw new Error('Invalid format');
    }
    
    // Create a record of the generated report
    const report = await prisma.report.create({
      data: {
        type: `financial_${type}`,
        period,
        format,
        fileUrl: reportFile.url,
        generatedBy: req.user.id
      }
    });
    
    res.json({
      message: 'Financial report generated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate financial report' });
  }
};

// Helper functions for report data
async function getSalesReportData(period: string) {
  // Implementation for sales report data
  return {};
}

async function getCustomerReportData(period: string) {
  // Implementation for customer report data
  return {};
}

async function getInventoryReportData() {
  // Implementation for inventory report data
  return {};
}

async function getMarketingReportData(period: string) {
  // Implementation for marketing report data
  return {};
}

async function getIncomeStatementData(period: string) {
  // Implementation for income statement data
  return {};
}

async function getBalanceSheetData() {
  // Implementation for balance sheet data
  return {};
}

async function getCashFlowData(period: string) {
  // Implementation for cash flow data
  return {};
}

function calculateChurnRate(totalCustomers: number, newCustomers: number, returningCustomers: number) {
  if (totalCustomers === 0) return 0;
  const previousCustomers = totalCustomers - newCustomers;
  if (previousCustomers === 0) return 0;
  const lostCustomers = previousCustomers - returningCustomers;
  return (lostCustomers / previousCustomers) * 100;
} 