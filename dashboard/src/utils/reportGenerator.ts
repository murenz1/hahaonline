import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { writeFileSync } from 'fs';

const prisma = new PrismaClient();

interface ReportFile {
  url: string;
  filename: string;
}

export async function generatePDF(data: any): Promise<ReportFile> {
  const doc = new PDFDocument();
  const filename = `report-${Date.now()}.pdf`;
  const filepath = join(process.cwd(), 'public', 'reports', filename);
  
  // Create the reports directory if it doesn't exist
  const fs = require('fs');
  const dir = join(process.cwd(), 'public', 'reports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the PDF to a file
  doc.pipe(fs.createWriteStream(filepath));

  // Add content to the PDF
  doc.fontSize(25).text('Financial Report', { align: 'center' });
  doc.moveDown();

  // Add the data to the PDF
  for (const [key, value] of Object.entries(data)) {
    doc.fontSize(12).text(`${key}: ${value}`);
    doc.moveDown();
  }

  doc.end();

  return {
    url: `/reports/${filename}`,
    filename
  };
}

export async function generateExcel(data: any): Promise<ReportFile> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Financial Report');
  const filename = `report-${Date.now()}.xlsx`;
  const filepath = join(process.cwd(), 'public', 'reports', filename);

  // Create the reports directory if it doesn't exist
  const fs = require('fs');
  const dir = join(process.cwd(), 'public', 'reports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Add headers
  worksheet.columns = [
    { header: 'Metric', key: 'metric' },
    { header: 'Value', key: 'value' }
  ];

  // Add data
  for (const [key, value] of Object.entries(data)) {
    worksheet.addRow({ metric: key, value });
  }

  // Save the workbook
  await workbook.xlsx.writeFile(filepath);

  return {
    url: `/reports/${filename}`,
    filename
  };
}

export async function generateCSV(data: any): Promise<ReportFile> {
  const filename = `report-${Date.now()}.csv`;
  const filepath = join(process.cwd(), 'public', 'reports', filename);

  // Create the reports directory if it doesn't exist
  const fs = require('fs');
  const dir = join(process.cwd(), 'public', 'reports');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const csvWriter = createObjectCsvWriter({
    path: filepath,
    header: [
      { id: 'metric', title: 'Metric' },
      { id: 'value', title: 'Value' }
    ]
  });

  // Convert data to array of objects
  const records = Object.entries(data).map(([metric, value]) => ({
    metric,
    value
  }));

  await csvWriter.writeRecords(records);

  return {
    url: `/reports/${filename}`,
    filename
  };
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Helper function to format date
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Helper function to calculate percentage
export function calculatePercentage(value: number, total: number): number {
  return (value / total) * 100;
}

// Helper function to calculate growth rate
export function calculateGrowthRate(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
} 