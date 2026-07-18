'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button, Card, CardBody } from '@/components/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            {error?.message && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-6">
                {error.message}
              </p>
            )}
          </div>

          <Card className="mb-8">
            <CardBody className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                What can you do?
              </h3>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                <li>• Refresh the page and try again</li>
                <li>• Check your internet connection</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Try a different browser or device</li>
                <li>• Contact support if the issue continues</li>
              </ul>
            </CardBody>
          </Card>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => reset?.()}
            >
              Try Again
            </Button>
            <Link href="/">
              <Button variant="primary" icon={<Home className="w-4 h-4" />}>
                Go to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
