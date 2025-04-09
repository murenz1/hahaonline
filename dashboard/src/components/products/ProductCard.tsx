import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';
import { Product } from '../../store/slices/productsSlice';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ShoppingCart,
  Eye,
  Heart,
  Star,
  MoreVertical,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onMore: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onAddToCart,
  onAddToWishlist,
  onMore,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden transition-all duration-300",
        theme === 'dark' ? 'bg-[#1F2436]' : 'bg-white',
        theme === 'dark' ? 'hover:shadow-lg hover:shadow-gray-800' : 'hover:shadow-lg hover:shadow-gray-200'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300",
            "flex items-center justify-center gap-2"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            onClick={() => onView(product)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            onClick={() => onAddToWishlist(product)}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => onMore(product)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className={cn(
              "font-medium line-clamp-1",
              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
            )}>
              {product.name}
            </h3>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {product.category}
            </p>
          </div>
          <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
            {product.status}
          </Badge>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className={cn(
            "text-sm font-medium",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            4.8
          </span>
          <span className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            (128)
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn(
              "text-lg font-semibold",
              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
            )}>
              ${lowestPrice.toFixed(2)}
              {lowestPrice !== highestPrice && ` - $${highestPrice.toFixed(2)}`}
            </p>
            <p className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {totalStock} in stock
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {product.tags && product.tags.length > 2 && (
              <Badge variant="secondary">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 