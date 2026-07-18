'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Download, Share2, Calendar, CheckCircle, QrCode, ExternalLink } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Certificate, Course } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';

export default function CertificatesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    const loadCertificates = () => {
      const userCertificates = localStorageService.getCertificatesByStudent(user!.id);
      const allCourses = localStorageService.getCourses();
      
      setCertificates(userCertificates);
      setCourses(allCourses);
      setLoading(false);
    };

    loadCertificates();
  }, [isAuthenticated, user, router]);

  const handleDownload = (certificate: Certificate) => {
    const course = courses.find(c => c.id === certificate.courseId);
    
    // Create PDF using jsPDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');

    // Header gradient effect
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 297, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF COMPLETION', 148.5, 25, { align: 'center' });

    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 50, 277, 140);

    // Inner border
    doc.setDrawColor(147, 197, 253);
    doc.setLineWidth(1);
    doc.rect(12, 52, 273, 136);

    // Content
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', 148.5, 75, { align: 'center' });

    // Student Name
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(user?.fullName || 'Student Name', 148.5, 95, { align: 'center' });

    // Course info
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    doc.text('has successfully completed the course', 148.5, 115, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(course?.title || certificate.courseName, 148.5, 130, { align: 'center' });

    // Instructor
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`Instructor: ${certificate.instructorName}`, 148.5, 150, { align: 'center' });

    // Date and Certificate ID
    doc.setFontSize(12);
    doc.text(`Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}`, 148.5, 165, { align: 'center' });
    doc.text(`Certificate ID: ${certificate.certificateId}`, 148.5, 175, { align: 'center' });

    // Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 190, 297, 20, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Issued by Codivexa LMS', 148.5, 200, { align: 'center' });
    doc.text('This certificate can be verified at codivexa.com', 148.5, 205, { align: 'center' });

    // Save the PDF
    doc.save(`certificate-${certificate.certificateId}.pdf`);
  };

  const handleShare = (certificate: Certificate) => {
    const course = courses.find(c => c.id === certificate.courseId);
    const shareText = `I just completed "${course?.title || certificate.courseName}" on Codivexa LMS! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Course Completion Certificate',
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Certificate details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Certificates
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your achievements and course completions
              </p>
            </div>
            <Link href="/student/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </motion.div>

        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Certificates Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete courses to earn your certificates and showcase your achievements.
                </p>
                <Link href="/courses">
                  <Button variant="primary">Browse Courses</Button>
                </Link>
              </CardBody>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => {
              const course = courses.find(c => c.id === certificate.courseId);
              return (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="overflow-hidden">
                    <CardBody className="p-6">
                      {/* Certificate Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-6 h-6 text-white" />
                            <span className="text-white font-semibold">Certificate</span>
                          </div>
                          <Badge variant="success" className="bg-white/20 text-white border-0">
                            Verified
                          </Badge>
                        </div>
                      </div>

                      {/* Course Info */}
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course?.title || certificate.courseName}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {new Date(certificate.completionDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <QrCode className="w-4 h-4" />
                          <span className="font-mono text-xs">ID: {certificate.certificateId}</span>
                        </div>
                      </div>

                      {/* Completion Badge */}
                      <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                          Course Completed Successfully
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Download className="w-4 h-4" />}
                          onClick={() => handleDownload(certificate)}
                          className="flex-1"
                        >
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Share2 className="w-4 h-4" />}
                          onClick={() => handleShare(certificate)}
                        >
                          Share
                        </Button>
                      </div>

                      {/* View Course Link */}
                      {course && (
                        <Link 
                          href={`/courses/${course.id}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Course
                        </Link>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
