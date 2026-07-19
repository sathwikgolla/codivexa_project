'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Calendar, User, BookOpen, ShieldCheck, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui';

export default function CertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [certId, setCertId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from a database. 
    // Here we just simulate a brief network delay to show off a nice loading animation.
    const id = params.id as string;
    setCertId(id);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldCheck className="w-16 h-16 text-blue-500" />
        </motion.div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Verifying Certificate Authenticity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            Verified Certificate
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This certificate is official and was securely issued by Codivexa LMS.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#111] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-gray-800 overflow-hidden relative"
        >
          {/* Certificate Badge watermark */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Award className="w-64 h-64 text-gray-900 dark:text-white" />
          </div>

          <div className="p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-1">Recipient</p>
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-gray-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alex Developer</h2>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-1">Course</p>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-gray-400 shrink-0 mt-1" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced React Patterns & Next.js 14</h2>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Issued On</p>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">July 18, 2026</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Certificate ID</p>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                    {certId?.toUpperCase() || 'CERT-2026-X89J'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Instructor: Dr. Robert Chen</p>
                  <p className="text-sm text-gray-500">Senior Software Engineer</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button variant="outline" icon={<Share2 className="w-4 h-4" />} fullWidth>
                    Share
                  </Button>
                  <Button variant="primary" icon={<Download className="w-4 h-4" />} fullWidth>
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="text-center mt-12">
          <Button variant="ghost" onClick={() => router.push('/')}>
            Back to Codivexa
          </Button>
        </div>
      </div>
    </div>
  );
}
