'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <Skeleton className="w-full h-48" variant="rectangular" />
      <div className="p-6 space-y-4">
        <Skeleton className="w-3/4 h-6" variant="text" />
        <Skeleton className="w-full h-4" variant="text" />
        <Skeleton className="w-1/2 h-4" variant="text" />
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="w-20 h-8" variant="rectangular" />
          <Skeleton className="w-24 h-8" variant="rectangular" />
        </div>
      </div>
    </div>
  );
};
