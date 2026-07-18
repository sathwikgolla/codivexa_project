'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info, X as CloseIcon } from 'lucide-react';
import toast, { Toaster as HotToaster } from 'react-hot-toast';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const CustomToast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-white" />,
    error: <X className="w-5 h-5 text-white" />,
    warning: <AlertTriangle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />,
  };

  const backgrounds = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-orange-500',
    info: 'bg-blue-600',
  };

  const hoverBackgrounds = {
    success: 'hover:bg-green-700',
    error: 'hover:bg-red-700',
    warning: 'hover:bg-orange-600',
    info: 'hover:bg-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-center gap-3 p-4 ${backgrounds[type]} ${hoverBackgrounds[type]} rounded-lg shadow-xl min-w-[300px] max-w-md`}
    >
      {icons[type]}
      <p className="text-sm text-white font-medium flex-1">{message}</p>
    </motion.div>
  );
};

export const Toaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
};
