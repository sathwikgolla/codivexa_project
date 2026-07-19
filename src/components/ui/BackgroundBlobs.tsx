'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Giant Background Watermark Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none z-0">
        <h1 className="text-[20vw] font-black tracking-tighter text-gray-900 dark:text-white whitespace-nowrap">
          CODIVEXA
        </h1>
      </div>

      {/* Top Left Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] -left-[10%] w-96 h-96 bg-orange-500/30 dark:bg-orange-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen z-0"
      />

      {/* Bottom Right Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-[60%] left-[70%] w-[30rem] h-[30rem] bg-blue-600/30 dark:bg-blue-700/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen z-0"
      />

      {/* Middle Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-[30%] left-[30%] w-72 h-72 bg-cyan-500/30 dark:bg-cyan-600/20 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen z-0"
      />
    </div>
  );
};
