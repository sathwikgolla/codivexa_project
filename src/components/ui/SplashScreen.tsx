'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasShownSplash = sessionStorage.getItem('splash_shown');
    
    if (hasShownSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_shown', 'true');
      }, 1000); // Show for 1 second

      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) {
    // Return a solid black overlay during SSR to prevent the homepage from flashing before React hydrates
    return <div className="fixed inset-0 z-[9999] bg-[#0a0a0a]" />;
  }

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Animated Ambient Background Blobs */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute w-96 h-96 bg-orange-500/30 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] -translate-x-20"
            />
          </div>

          {/* Logo Container */}
          <motion.div 
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-xl shadow-2xl shadow-orange-500/20">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10v7a7 7 0 0014 0v-7" />
                </svg>
              </div>
              <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                CODIVEXA
              </h1>
            </motion.div>
            
            {/* Loading Progress Bar */}
            <motion.div 
              className="w-48 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
