'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button, Card, CardBody } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Card className="mb-8">
            <CardBody className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/">
                  <Button variant="ghost" fullWidth icon={<Home className="w-4 h-4" />}>
                    Home
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="ghost" fullWidth icon={<Search className="w-4 h-4" />}>
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="ghost" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>

          <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
                Go Back Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
