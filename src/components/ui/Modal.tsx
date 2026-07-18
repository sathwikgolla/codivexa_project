'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-[var(--shadow)] ${sizes[size]} max-h-[90vh] overflow-hidden`}
            >
              {title && (
                <div className="flex items-center justify-between border-b border-[color:var(--border)] p-6">
                  <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{title}</h2>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-[color:var(--foreground)]/70 transition-colors hover:bg-[color:var(--muted)]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
