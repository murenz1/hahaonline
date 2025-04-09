import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  ChevronDown,
  Upload,
  Download,
  Archive,
  Trash2,
  Package,
  AlertCircle,
  X
} from 'lucide-react';
import {
  exportProducts,
  importProducts,
  bulkUpdateStatus,
  bulkDelete,
  bulkUpdateStock,
  type ImportResult
} from '../../utils/productBulkUtils';

interface BulkActionsProps {
  selectedProducts: string[];
  onBulkAction: (action: string, result: any) => void;
  products: any[];
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedProducts,
  onBulkAction,
  products
}) => {
  const { isDarkMode } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState('');
  const [stockOperation, setStockOperation] = useState<'set' | 'add' | 'subtract'>('set');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await importProducts(file);
      onBulkAction('import', result);
      setImportError(null);
    } catch (error) {
      const importError = error as ImportResult;
      setImportError(importError.message);
    }
  };

  const handleExport = () => {
    try {
      exportProducts(products);
      setShowDropdown(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleStatusUpdate = (status: 'active' | 'draft' | 'archived') => {
    const result = bulkUpdateStatus(products, selectedProducts, status);
    onBulkAction('status', result);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    const result = bulkDelete(products, selectedProducts);
    onBulkAction('delete', result);
    setShowDeleteConfirm(false);
    setShowDropdown(false);
  };

  const handleStockUpdate = () => {
    const adjustment = parseInt(stockAdjustment);
    if (isNaN(adjustment)) return;

    const result = bulkUpdateStock(products, selectedProducts, adjustment, stockOperation);
    onBulkAction('stock', result);
    setShowStockModal(false);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={selectedProducts.length === 0}
        className={cn(
          "flex items-center px-4 py-2 rounded-lg font-medium",
          selectedProducts.length === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
            : isDarkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        )}
      >
        Bulk Actions
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {showDropdown && (
        <div className={cn(
          "absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10",
          isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
        )}>
          <div className="py-1">
            <label className={cn(
              "flex items-center px-4 py-2 cursor-pointer",
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-50 text-gray-700"
            )}>
              <Upload className="w-4 h-4 mr-3" />
              Import
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleExport}
              className={cn(
                "w-full flex items-center px-4 py-2",
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <Download className="w-4 h-4 mr-3" />
              Export
            </button>
            <hr className={cn(
              "my-1",
              isDarkMode ? "border-gray-700" : "border-gray-200"
            )} />
            <button
              onClick={() => handleStatusUpdate('active')}
              className={cn(
                "w-full flex items-center px-4 py-2",
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <Package className="w-4 h-4 mr-3" />
              Set Active
            </button>
            <button
              onClick={() => handleStatusUpdate('archived')}
              className={cn(
                "w-full flex items-center px-4 py-2",
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <Archive className="w-4 h-4 mr-3" />
              Archive
            </button>
            <hr className={cn(
              "my-1",
              isDarkMode ? "border-gray-700" : "border-gray-200"
            )} />
            <button
              onClick={() => setShowStockModal(true)}
              className={cn(
                "w-full flex items-center px-4 py-2",
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <Package className="w-4 h-4 mr-3" />
              Update Stock
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={cn(
                "w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              )}
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={cn(
            "w-full max-w-md rounded-lg shadow-lg p-6",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <h3 className={cn(
              "text-lg font-semibold mb-4",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Update Stock
            </h3>
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Operation
                </label>
                <select
                  value={stockOperation}
                  onChange={(e) => setStockOperation(e.target.value as any)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  )}
                >
                  <option value="set">Set to</option>
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>
              </div>
              <div>
                <label className={cn(
                  "block text-sm font-medium mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStockModal(false)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium",
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                disabled={!stockAdjustment || isNaN(parseInt(stockAdjustment))}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-white",
                  stockAdjustment && !isNaN(parseInt(stockAdjustment))
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 cursor-not-allowed"
                )}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={cn(
            "w-full max-w-md rounded-lg shadow-lg p-6",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Delete Products
              </h3>
            </div>
            <p className={cn(
              "mb-4",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Are you sure you want to delete {selectedProducts.length} products? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium",
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Error Message */}
      {importError && (
        <div className={cn(
          "absolute right-0 mt-2 p-4 rounded-lg shadow-lg z-20 border",
          isDarkMode
            ? "bg-red-900/50 border-red-800 text-red-200"
            : "bg-red-50 border-red-100 text-red-800"
        )}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p className="text-sm">{importError}</p>
          </div>
          <button
            onClick={() => setImportError(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkActions; 