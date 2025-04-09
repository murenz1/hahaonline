import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Boxes,
  ShoppingCart,
  Tag
} from 'lucide-react';

interface ProductStatsProps {
  products: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'draft' | 'archived';
    image?: string;
    sku: string;
    variants?: {
      id: string;
      name: string;
      price: number;
      stock: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const ProductStats: React.FC<ProductStatsProps> = ({ products }) => {
  const { isDarkMode } = useTheme();

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const averagePrice = totalProducts > 0 ? products.reduce((sum, product) => sum + product.price, 0) / totalProducts : 0;
  const categories = [...new Set(products.map(p => p.category))];
  const variantsCount = products.reduce((sum, product) => sum + (product.variants?.length || 0), 0);

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-500',
      bgColor: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'
    },
    {
      title: 'Active Products',
      value: activeProducts,
      icon: Boxes,
      color: 'text-green-500',
      bgColor: isDarkMode ? 'bg-green-900/20' : 'bg-green-100'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'
    },
    {
      title: 'Total Stock',
      value: totalStock,
      icon: ShoppingCart,
      color: 'text-purple-500',
      bgColor: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'
    }
  ];

  const additionalStats = [
    {
      title: 'Inventory Value',
      value: `$${totalValue.toFixed(2)}`,
      trend: totalValue > 10000 ? 'up' : 'down',
      color: 'text-emerald-500'
    },
    {
      title: 'Average Price',
      value: `$${averagePrice.toFixed(2)}`,
      trend: averagePrice > 50 ? 'up' : 'down',
      color: 'text-blue-500'
    },
    {
      title: 'Categories',
      value: categories.length,
      trend: categories.length > 3 ? 'up' : 'down',
      color: 'text-purple-500'
    },
    {
      title: 'Total Variants',
      value: variantsCount,
      trend: variantsCount > 5 ? 'up' : 'down',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-lg",
                stat.bgColor
              )}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {stat.title}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className={cn(
                "text-2xl font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalStats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {stat.title}
              </span>
              {stat.trend === 'up' ? (
                <TrendingUp className={stat.color} size={16} />
              ) : (
                <TrendingDown className="text-red-500" size={16} />
              )}
            </div>
            <div className="flex items-baseline">
              <span className={cn(
                "text-2xl font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductStats; 