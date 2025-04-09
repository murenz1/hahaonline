import { generateSKU } from './productUtils';

export interface BulkActionResult {
  success: boolean;
  message: string;
  affectedCount: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors: string[];
}

export const exportProducts = (products: any[]): void => {
  try {
    // Convert products to CSV format
    const headers = ['name', 'description', 'category', 'price', 'stock', 'status', 'sku'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => {
        return headers.map(header => {
          const value = product[header];
          // Handle special characters in CSV
          return typeof value === 'string' 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',');
      })
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting products:', error);
    throw new Error('Failed to export products');
  }
};

export const importProducts = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const errors: string[] = [];
    const importedProducts: any[] = [];

    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        // Validate headers
        const requiredHeaders = ['name', 'category', 'price', 'stock'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          reject({
            success: false,
            message: `Missing required columns: ${missingHeaders.join(', ')}`,
            importedCount: 0,
            errors: [`Missing required columns: ${missingHeaders.join(', ')}`]
          });
          return;
        }

        // Process each line
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(',').map(v => v.trim());
          const product: any = {};

          headers.forEach((header, index) => {
            let value = values[index];
            if (value?.startsWith('"') && value?.endsWith('"')) {
              value = value.slice(1, -1).replace(/""/g, '"');
            }
            product[header] = value;
          });

          // Validate required fields
          if (!product.name || !product.category || !product.price || !product.stock) {
            errors.push(`Row ${i + 1}: Missing required fields`);
            continue;
          }

          // Convert types
          product.price = parseFloat(product.price);
          product.stock = parseInt(product.stock);

          if (isNaN(product.price) || isNaN(product.stock)) {
            errors.push(`Row ${i + 1}: Invalid price or stock value`);
            continue;
          }

          // Generate SKU if not provided
          if (!product.sku) {
            product.sku = generateSKU(product.category, product.name);
          }

          // Set default status if not provided
          if (!product.status) {
            product.status = 'active';
          }

          importedProducts.push(product);
        }

        resolve({
          success: true,
          message: `Successfully imported ${importedProducts.length} products`,
          importedCount: importedProducts.length,
          errors
        });
      } catch (error) {
        reject({
          success: false,
          message: 'Failed to process import file',
          importedCount: 0,
          errors: ['Invalid file format']
        });
      }
    };

    reader.onerror = () => {
      reject({
        success: false,
        message: 'Failed to read import file',
        importedCount: 0,
        errors: ['File read error']
      });
    };

    reader.readAsText(file);
  });
};

export const bulkUpdateStatus = (
  products: any[],
  productIds: string[],
  newStatus: 'active' | 'draft' | 'archived'
): BulkActionResult => {
  try {
    const updatedProducts = products.map(product => {
      if (productIds.includes(product.id)) {
        return {
          ...product,
          status: newStatus,
          updatedAt: new Date()
        };
      }
      return product;
    });

    return {
      success: true,
      message: `Successfully updated status of ${productIds.length} products`,
      affectedCount: productIds.length
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update products status',
      affectedCount: 0
    };
  }
};

export const bulkDelete = (
  products: any[],
  productIds: string[]
): BulkActionResult => {
  try {
    const remainingProducts = products.filter(product => !productIds.includes(product.id));
    const deletedCount = products.length - remainingProducts.length;

    return {
      success: true,
      message: `Successfully deleted ${deletedCount} products`,
      affectedCount: deletedCount
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete products',
      affectedCount: 0
    };
  }
};

export const bulkUpdateStock = (
  products: any[],
  productIds: string[],
  adjustment: number,
  operation: 'set' | 'add' | 'subtract'
): BulkActionResult => {
  try {
    const updatedProducts = products.map(product => {
      if (productIds.includes(product.id)) {
        let newStock: number;
        switch (operation) {
          case 'set':
            newStock = adjustment;
            break;
          case 'add':
            newStock = product.stock + adjustment;
            break;
          case 'subtract':
            newStock = Math.max(0, product.stock - adjustment);
            break;
          default:
            newStock = product.stock;
        }

        return {
          ...product,
          stock: newStock,
          updatedAt: new Date()
        };
      }
      return product;
    });

    return {
      success: true,
      message: `Successfully updated stock of ${productIds.length} products`,
      affectedCount: productIds.length
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update products stock',
      affectedCount: 0
    };
  }
}; 