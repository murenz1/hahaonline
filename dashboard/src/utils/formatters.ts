/**
 * Utilities for formatting various data types
 */

/**
 * Format a number as currency (USD by default)
 * 
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a date with options
 * 
 * @param date - The date to format
 * @param options - Date formatting options
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  },
  locale: string = 'en-US'
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format a number with commas as thousands separators
 * 
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a percentage
 * 
 * @param value - The decimal value (e.g., 0.15 for 15%)
 * @param fractionDigits - Number of digits after decimal point
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number,
  fractionDigits: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}

/**
 * Truncate text and add ellipsis if it exceeds the maximum length
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format a file size in bytes to a human-readable format
 * 
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
} 