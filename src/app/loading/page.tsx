'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Codivexa LMS
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Loading your learning experience...
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>
    </div>
  );
}
