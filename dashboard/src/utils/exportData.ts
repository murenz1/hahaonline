interface ExportOptions {
  filename: string;
  format: 'csv' | 'json' | 'pdf';
}

export const exportData = async <T extends Record<string, any>>(
  data: T[],
  options: ExportOptions
): Promise<void> => {
  const { filename, format } = options;

  switch (format) {
    case 'csv':
      return exportCSV(data, filename);
    case 'json':
      return exportJSON(data, filename);
    case 'pdf':
      return exportPDF(data, filename);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

const exportCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string
): Promise<void> => {
  return new Promise((resolve) => {
    if (!data.length) {
      resolve();
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    resolve();
  });
};

const exportJSON = <T extends Record<string, any>>(
  data: T[],
  filename: string
): Promise<void> => {
  return new Promise((resolve) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    resolve();
  });
};

const exportPDF = async <T extends Record<string, any>>(
  data: T[],
  filename: string
): Promise<void> => {
  // Note: In a real application, you would use a PDF library like jsPDF
  // This is just a placeholder implementation
  console.warn('PDF export not implemented');
  return Promise.resolve();
}; 