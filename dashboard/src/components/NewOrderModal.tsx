import React, { useState } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: { customerName: string; items: OrderItem[] }) => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { isDarkMode } = useTheme();
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: '1',
      name: '',
      size: 'M',
      quantity: 1,
      price: 0,
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(items.length + 1),
        name: '',
        size: 'M',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ customerName, items });
    setCustomerName('');
    setItems([
      {
        id: '1',
        name: '',
        size: 'M',
        quantity: 1,
        price: 0,
      },
    ]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity duration-300" onClick={onClose} />
        <div className={`relative w-full max-w-2xl rounded-lg shadow-lg transform transition-all duration-300 animate-slideUp ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                New Order
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="customerName"
                  className={`block mb-2 text-sm font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 text-white border-gray-600 focus:bg-gray-600'
                      : 'bg-white text-gray-900 border-gray-300 focus:bg-gray-50'
                  }`}
                />
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={`p-4 rounded-lg transition-all duration-200 animate-slideUp ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(item.id, 'name', e.target.value)
                          }
                          required
                          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                            isDarkMode
                              ? 'bg-gray-600 text-white border-gray-500'
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={item.size}
                          onChange={(e) =>
                            handleItemChange(item.id, 'size', e.target.value)
                          }
                          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                            isDarkMode
                              ? 'bg-gray-600 text-white border-gray-500'
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleItemChange(
                                item.id,
                                'quantity',
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className={`p-1 rounded-lg transition-colors ${
                              isDarkMode
                                ? 'text-gray-400 hover:bg-gray-600'
                                : 'text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                'quantity',
                                parseInt(e.target.value) || 1
                              )
                            }
                            min="1"
                            className={`w-16 px-2 py-1 text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                              isDarkMode
                                ? 'bg-gray-600 text-white border-gray-500'
                                : 'bg-white text-gray-900 border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleItemChange(
                                item.id,
                                'quantity',
                                item.quantity + 1
                              )
                            }
                            className={`p-1 rounded-lg transition-colors ${
                              isDarkMode
                                ? 'text-gray-400 hover:bg-gray-600'
                                : 'text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'price',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          step="0.01"
                          required
                          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                            isDarkMode
                              ? 'bg-gray-600 text-white border-gray-500'
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'text-gray-400 hover:bg-gray-600 disabled:opacity-50'
                              : 'text-gray-500 hover:bg-gray-200 disabled:opacity-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Item
              </button>

              <div className="mt-6 flex items-center justify-between">
                <div className={`text-lg font-semibold transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Total: ${calculateTotal().toFixed(2)}
                </div>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-green-600"
                  >
                    Create Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal; 