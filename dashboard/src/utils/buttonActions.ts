import { dataCache } from './dataCache';
import { keyboardShortcuts } from './keyboardShortcuts';
import { notificationService } from '../services/notificationService';

export const buttonActions = {
  // Data Management
  refresh: () => {
    dataCache.clear();
    window.location.reload();
  },

  save: (data: any, key: string) => {
    dataCache.set(key, data);
    notificationService.addNotification({
      title: 'Success',
      message: 'Data saved successfully',
      type: 'success',
    });
  },

  delete: (key: string) => {
    dataCache.delete(key);
    notificationService.addNotification({
      title: 'Success',
      message: 'Item deleted successfully',
      type: 'success',
    });
  },

  // View Management
  toggleView: (currentView: string) => {
    const newView = currentView === 'grid' ? 'list' : 'grid';
    localStorage.setItem('viewMode', newView);
    return newView;
  },

  toggleDarkMode: () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  },

  // Export/Import
  exportData: (data: any, format: 'csv' | 'json' | 'pdf') => {
    let content: string;
    let filename: string;
    let type: string;

    switch (format) {
      case 'csv':
        content = convertToCSV(data);
        filename = 'export.csv';
        type = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = 'export.json';
        type = 'application/json';
        break;
      case 'pdf':
        // PDF generation would be handled by a PDF library
        return;
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Search and Filter
  search: (query: string, data: any[]) => {
    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  },

  filter: (data: any[], filters: Record<string, any>) => {
    return data.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === '') return true;
        return item[key] === value;
      })
    );
  },

  // Sorting
  sort: (data: any[], key: string, direction: 'asc' | 'desc' = 'asc') => {
    return [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  },
};

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(item =>
    headers.map(header => {
      const value = item[header];
      return typeof value === 'string' && value.includes(',')
        ? `"${value}"`
        : value;
    })
  );

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
} 