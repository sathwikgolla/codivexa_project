'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeft, Award, Calendar, CheckCircle } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Certificate } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const certificateId = params.certificateId as string;
    const foundCertificate = localStorageService.getCertificateById(certificateId);
    
    if (!foundCertificate || foundCertificate.studentId !== user?.id) {
      router.push('/student/dashboard');
      return;
    }

    setCertificate(foundCertificate);
    setLoading(false);
  }, [isAuthenticated, user, params.certificateId, router]);

  const generateQRCode = async (text: string): Promise<string> => {
    try {
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: 100,
        margin: 1,
      });
      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const downloadCertificate = async () => {
    if (!certificate) return;

    setGenerating(true);
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Background
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Border
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(2);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(15, 15, pageWidth - 30, 40, 'F');

      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Certificate of Completion', pageWidth / 2, 35, { align: 'center' });

      // Content
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });

      // Student Name
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.studentName, pageWidth / 2, 85, { align: 'center' });

      // Course Name
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('has successfully completed the course', pageWidth / 2, 100, { align: 'center' });
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.courseName, pageWidth / 2, 115, { align: 'center' });

      // Details
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Instructor: ${certificate.instructorName}`, pageWidth / 2, 135, { align: 'center' });
      pdf.text(`Completion Date: ${certificate.completionDate.toLocaleDateString()}`, pageWidth / 2, 145, { align: 'center' });
      pdf.text(`Certificate ID: ${certificate.certificateId}`, pageWidth / 2, 155, { align: 'center' });

      // QR Code
      const qrCode = await generateQRCode(certificate.qrCode);
      if (qrCode) {
        pdf.addImage(qrCode, 'PNG', pageWidth - 50, 165, 35, 35);
      }

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Issued by Codivexa Learning Management System', pageWidth / 2, 180, { align: 'center' });

      // Signature
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('_________________', 40, 180);
      pdf.text('Instructor Signature', 40, 185);

      pdf.text('_________________', pageWidth - 60, 180);
      pdf.text('Authorized Signature', pageWidth - 60, 185);

      // Save
      pdf.save(`Certificate_${certificate.studentName}_${certificate.courseName}.pdf`);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate certificate');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Certificate',
          text: `I have successfully completed ${certificate?.courseName}!`,
          url: window.location.href,
        });
      } catch (error) {
        toast.error('Failed to share certificate');
      }
    } else {
      toast.error('Sharing not supported on this browser');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Certificate Not Found
          </h2>
          <Link href="/student/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <Link href="/student/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Certificate of Completion
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Congratulations on completing your course!
                </p>
              </div>

              {/* Certificate Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 border-4 border-blue-600">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Certificate of Completion
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">This is to certify that</p>
                  <h3 className="text-3xl font-bold text-blue-600 my-4">
                    {certificate.studentName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">has successfully completed the course</p>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                    {certificate.courseName}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                    <p className="font-medium text-gray-900 dark:text-white">{certificate.instructorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completion Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {certificate.completionDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Certificate ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{certificate.certificateId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issued By</p>
                    <p className="font-medium text-gray-900 dark:text-white">{certificate.issuedBy}</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <div className="border-b-2 border-gray-300 dark:border-gray-600 w-48 mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instructor Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-gray-300 dark:border-gray-600 w-48 mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Authorized Signature</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Download className="w-5 h-5" />}
                  onClick={downloadCertificate}
                  loading={generating}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Share2 className="w-5 h-5" />}
                  onClick={shareCertificate}
                >
                  Share Certificate
                </Button>
              </div>

              {/* Verification Info */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Verified Certificate</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This certificate can be verified using the unique ID: {certificate.certificateId}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
