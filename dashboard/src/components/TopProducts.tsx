import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGetTopProductsQuery } from '../store/api';
import { cn } from '../utils/cn';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export const TopProducts: React.FC = () => {
  const { theme } = useTheme();
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center text-red-500">
        Error loading top products
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 rounded-lg transition-colors duration-200",
      theme === 'dark'
        ? 'bg-[#161926] border border-[#1F2436]'
        : 'bg-white border border-gray-200'
    )}>
      <h2 className={cn(
        "text-xl font-semibold mb-6",
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      )}>
        Top-Selling Products
      </h2>
      <div className="space-y-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className={cn(
              "p-4 rounded-lg transition-colors duration-200",
              theme === 'dark'
                ? 'bg-[#1F2436] hover:bg-[#2A2F41]'
                : 'bg-gray-50 hover:bg-gray-100'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium",
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                )}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Sales: {product.sales}
                  </div>
                  <div className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Revenue: ${product.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {product.stock < 10 && (
                  <div className="text-amber-500" title="Low Stock">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                )}
                <div className={cn(
                  "flex items-center gap-1 text-sm",
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                )}>
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 