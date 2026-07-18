'use client';

import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src && !imageFailed) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--secondary)] font-medium text-white ${className}`}
    >
      {fallback || getInitials(alt)}
    </div>
  );
};
