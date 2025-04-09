import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
}) => {
  const { isDarkMode } = useTheme();

  const baseClasses = `animate-shimmer bg-gradient-to-r ${
    isDarkMode
      ? 'from-gray-700 via-gray-800 to-gray-700'
      : 'from-gray-100 via-gray-200 to-gray-100'
  }`;

  const variantClasses = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  );
};

export default Skeleton; 