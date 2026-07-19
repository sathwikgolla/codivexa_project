'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glassmorphism?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, glassmorphism = false }) => {
  const baseStyles = 'rounded-2xl border border-[color:var(--border)] shadow-[var(--shadow)] transition-all duration-300';
  
  const glassStyles = glassmorphism
    ? 'bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden'
    : 'bg-[color:var(--card)]';

  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:-translate-y-1'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`border-b border-[color:var(--border)] p-6 ${className}`}>{children}</div>;
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`border-t border-[color:var(--border)] p-6 ${className}`}>{children}</div>;
};
