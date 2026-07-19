'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, BookOpen, DollarSign, TrendingUp, Shield, Settings,
  LogOut, BarChart3, AlertCircle, CheckCircle, Clock, UserPlus,
  Trash2, Edit, Eye, Ban, Award, FileText, X, ArrowLeftRight,
  Download, Calendar, PlusCircle, Check, PlayCircle, Key, Lock, Bell
} from 'lucide-react';
import { 
  Button, Card, CardBody, Badge, Avatar, ProgressBar, Modal, Input, TextArea, Select, Logo, BackgroundBlobs 
} from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { User, Course, Payment, Certificate, AssignmentSubmission, Student } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  
  // App Core States loaded directly from LocalStorageService
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [platformName, setPlatformName] = useState('Codivexa');
  const [currency, setCurrency] = useState('USD');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [assessmentAttempts, setAssessmentAttempts] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<
    'overview' | 'students' | 'courses' | 'assessments' | 'certificates' | 'payments' | 'revenue' | 'settings'
  >('overview');
  const [assessSubTab, setAssessSubTab] = useState<'configs' | 'queue'>('configs');
  const [certSubTab, setCertSubTab] = useState<'ledger' | 'requests'>('ledger');
  const [selectedViewCert, setSelectedViewCert] = useState<Certificate | null>(null);

  // Search/Filters States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [revenueTimeframe, setRevenueTimeframe] = useState('This Year');

  // Modals States
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentForm, setStudentForm] = useState({ fullName: '', email: '', mobile: '', isBanned: false, enrolledCourses: [] as string[] });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'development' as any,
    difficulty: 'intermediate' as any,
    price: 99.99,
    description: '',
    published: false,
    lessons: [] as any[]
  });
  const [newLesson, setNewLesson] = useState({ title: '', duration: '15' });

  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });

  const [isManualCertOpen, setIsManualCertOpen] = useState(false);
  const [manualCertForm, setManualCertForm] = useState({ studentId: '', courseId: '' });
  const [certRevokeModal, setCertRevokeModal] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  // Init Data and Local Storage Syncing
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/admin-login');
      return;
    }

    // Load states from LocalStorageService
    const allUsers = localStorageService.getUsers();
    const allCourses = localStorageService.getCourses();
    const allPayments = localStorageService.getPayments();
    const allCerts = localStorageService.getCertificates();
    const allSubs = localStorageService.getAssignmentSubmissions();

    setUsers(allUsers);
    setCourses(allCourses);
    setPayments(allPayments);
    setCertificates(allCerts);
    setAssessmentAttempts(localStorageService.getAssessmentAttempts());

    // Seed default submissions if queue is empty
    if (allSubs.length === 0 && allUsers.length > 0 && allCourses.length > 0) {
      const studentsList = allUsers.filter(u => u.role === 'student');
      const seedSubs: AssignmentSubmission[] = [
        {
          id: 'sub-1',
          assignmentId: 'asm-1',
          studentId: studentsList[0]?.id || 'stu-1',
          courseId: allCourses[0]?.id || 'course-1',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          files: [{ id: 'f-1', title: 'react_final_project.zip', type: 'pdf', url: '#' }],
          status: 'pending',
        },
        {
          id: 'sub-2',
          assignmentId: 'asm-2',
          studentId: studentsList[1]?.id || 'stu-2',
          courseId: allCourses[1]?.id || 'course-2',
          submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          files: [{ id: 'f-2', title: 'data_analysis_report.py', type: 'code', url: '#' }],
          status: 'reviewed',
          marks: 85,
          feedback: 'Excellent utilization of data cleansing steps!'
        },
        {
          id: 'sub-3',
          assignmentId: 'asm-1',
          studentId: studentsList[2]?.id || 'stu-3',
          courseId: allCourses[0]?.id || 'course-1',
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          files: [{ id: 'f-3', title: 'portfolio_wireframe.zip', type: 'pdf', url: '#' }],
          status: 'pending',
        }
      ];
      localStorage.setItem('codivexa_assignment_submissions', JSON.stringify(seedSubs));
      setSubmissions(seedSubs);
    } else {
      setSubmissions(allSubs);
    }

    // Load Settings
    const settings = localStorage.getItem('codivexa_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setPlatformName(parsed.platformName || 'Codivexa');
      setCurrency(parsed.currency || 'USD');
      setSessionTimeout(parsed.sessionTimeout || '30');
    }

    // Load Audit Logs
    const logs = localStorage.getItem('codivexa_audit_logs');
    if (logs) {
      setAuditLogs(JSON.parse(logs));
    } else {
      const seedLogs: AuditLog[] = [
        { id: 'log-1', action: 'System seeded with default configuration data', user: 'System', timestamp: 'Oct 20, 2023, 09:00' },
        { id: 'log-2', action: 'Admin logged in from IP 192.168.1.5', user: 'Sanjana Kasarla', timestamp: 'Oct 24, 2023, 10:00' },
      ];
      localStorage.setItem('codivexa_audit_logs', JSON.stringify(seedLogs));
      setAuditLogs(seedLogs);
    }

    setLoading(false);
  }, [isAuthenticated, user, router]);

  // Logging utility
  const logAction = (actionText: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: actionText,
      user: user?.fullName || 'Sanjana Kasarla',
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('codivexa_audit_logs', JSON.stringify(updated));
  };

  const handleLogout = () => {
    logAction('Admin signed out');
    logout();
    router.push('/');
  };

  // Student Operations
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.fullName || !studentForm.email) return;

    // Check if user already exists
    const usersList = localStorageService.getUsers();
    if (usersList.some(u => u.email.toLowerCase() === studentForm.email.toLowerCase())) {
      toast.error('Student email already registered.');
      return;
    }

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: studentForm.fullName,
      email: studentForm.email,
      mobile: studentForm.mobile || 'N/A',
      password: 'password123',
      role: 'student',
      isBanned: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentForm.fullName}`,
      enrolledCourses: studentForm.enrolledCourses,
      completedCourses: [],
      certificates: [],
      wishlist: [],
      progress: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    localStorageService.addUser(newStudent);
    
    // Add charges for enrolled courses using the service sequentially
    studentForm.enrolledCourses.forEach((courseId, i) => {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        const newPayment: Payment = {
          id: Math.random().toString(36).substr(2, 9),
          studentId: newStudent.id,
          courseId: course.id,
          amount: course.price,
          method: 'credit-card',
          status: 'completed',
          transactionId: `TXN${Date.now()}${i}`,
          invoiceId: `INV${Date.now()}${i}`,
          createdAt: new Date()
        };
        localStorageService.addPayment(newPayment);
      }
    });

    logAction(`Registered new student ${newStudent.fullName} (${newStudent.id})`);
    toast.success('Student registered successfully!');
    
    // Pull fresh data to sync UI state
    setUsers(localStorageService.getUsers());
    setPayments(localStorageService.getPayments());
    
    setIsAddStudentOpen(false);
    setStudentForm({ fullName: '', email: '', mobile: '', isBanned: false, enrolledCourses: [] });
  };

  const handleOpenEditStudent = (student: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudentId(student.id);
    const stuDetail = student as Student;
    setStudentForm({
      fullName: student.fullName,
      email: student.email,
      mobile: student.mobile,
      isBanned: !!student.isBanned,
      enrolledCourses: stuDetail.enrolledCourses || []
    });
    setIsEditStudentOpen(true);
  };

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;

    localStorageService.updateUser(editingStudentId, {
      fullName: studentForm.fullName,
      email: studentForm.email,
      mobile: studentForm.mobile,
      isBanned: studentForm.isBanned,
      enrolledCourses: studentForm.enrolledCourses
    } as any);

    logAction(`Updated student profile ID: ${editingStudentId}`);
    toast.success('Student details updated.');
    
    setUsers(localStorageService.getUsers());
    setIsEditStudentOpen(false);
    setEditingStudentId(null);
  };

  const handleBanToggle = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const student = users.find(u => u.id === userId);
    if (student) {
      const nextBanned = !student.isBanned;
      localStorageService.updateUser(userId, { isBanned: nextBanned });
      logAction(`${nextBanned ? 'Deactivated' : 'Reactivated'} user ID: ${userId}`);
      toast.success(nextBanned ? 'User deactivated.' : 'User reactivated.');
      setUsers(localStorageService.getUsers());
    }
  };

  const handleDeleteUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this student permanently?')) {
      localStorageService.deleteUser(userId);
      logAction(`Deleted user ID: ${userId}`);
      toast.success('User deleted.');
      setUsers(localStorageService.getUsers());
    }
  };

  const handleOpenStudentDetails = (student: User) => {
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const studentCerts = certificates.filter(c => c.studentId === student.id);
    const studentSubs = submissions.filter(s => s.studentId === student.id);
    
    setSelectedStudent({
      ...student,
      payments: studentPayments,
      certs: studentCerts,
      subs: studentSubs
    });
  };

  // Course Operations
  const handleAddVideo = () => {
    if (!newLesson.title || !newLesson.duration) return;
    const lesson = {
      id: `l-${Date.now()}`,
      courseId: '',
      title: newLesson.title,
      description: 'Course curriculum video lecture',
      videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
      duration: Number(newLesson.duration),
      order: courseForm.lessons.length + 1,
      freePreview: courseForm.lessons.length === 0,
      resources: []
    };
    setCourseForm(prev => ({
      ...prev,
      lessons: [...prev.lessons, lesson]
    }));
    setNewLesson({ title: '', duration: '15' });
  };

  const handleRemoveVideo = (idx: number) => {
    setCourseForm(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== idx)
    }));
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title) return;

    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      title: courseForm.title,
      description: courseForm.description || 'No description provided.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      instructorId: 'inst-default',
      instructorName: 'LMS Platform Coordinator',
      category: courseForm.category,
      difficulty: courseForm.difficulty,
      price: Number(courseForm.price) || 0,
      duration: courseForm.lessons.reduce((sum, l) => sum + l.duration, 0),
      lessonsCount: courseForm.lessons.length,
      rating: 5.0,
      reviewCount: 0,
      enrolledCount: 0,
      language: 'English',
      requirements: ['Basic computer usage'],
      whatYouLearn: ['Core principles'],
      lessons: courseForm.lessons,
      quizzes: [],
      assignments: [],
      published: courseForm.published,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    localStorageService.addCourse(newCourse);
    logAction(`Created new course ${newCourse.title} (${newCourse.id})`);
    toast.success('Course created successfully.');
    
    setCourses(localStorageService.getCourses());
    setIsAddCourseOpen(false);
    resetCourseForm();
  };

  const handleOpenEditCourse = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      price: course.price,
      description: course.description,
      published: course.published,
      lessons: course.lessons || []
    });
    setIsEditCourseOpen(true);
  };

  const handleEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseId) return;

    localStorageService.updateCourse(editingCourseId, {
      title: courseForm.title,
      category: courseForm.category,
      difficulty: courseForm.difficulty,
      price: Number(courseForm.price),
      description: courseForm.description,
      published: courseForm.published,
      lessons: courseForm.lessons,
      lessonsCount: courseForm.lessons.length,
      duration: courseForm.lessons.reduce((sum, l) => sum + l.duration, 0)
    });

    logAction(`Updated course curriculum ID: ${editingCourseId}`);
    toast.success('Course updated successfully.');
    
    setCourses(localStorageService.getCourses());
    setIsEditCourseOpen(false);
    setEditingCourseId(null);
    resetCourseForm();
  };

  const handleDeleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const enrolledStudents = users.filter(u => {
      const student = u as Student;
      return student.enrolledCourses?.includes(courseId);
    });

    if (enrolledStudents.length > 0) {
      toast.error(`Cannot delete course. ${enrolledStudents.length} student(s) currently enrolled.`);
      return;
    }

    if (confirm('Are you sure you want to delete this course curriculum permanently?')) {
      localStorageService.deleteCourse(courseId);
      logAction(`Deleted course curriculum ID: ${courseId}`);
      toast.success('Course deleted.');
      setCourses(localStorageService.getCourses());
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      category: 'development',
      difficulty: 'intermediate',
      price: 99.99,
      description: '',
      published: false,
      lessons: []
    });
    setNewLesson({ title: '', duration: '15' });
  };

  // Grading Operations
  const handleOpenGrade = (sub: AssignmentSubmission) => {
    setSelectedSubmission(sub);
    setGradeForm({
      score: sub.marks !== undefined ? sub.marks.toString() : '',
      feedback: sub.feedback || ''
    });
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !gradeForm.score) return;

    const scoreNum = Number(gradeForm.score);
    const passThreshold = 4; // 4 out of 5 marks
    const isPass = scoreNum >= passThreshold;

    localStorageService.updateSubmission(selectedSubmission.id, {
      marks: scoreNum,
      feedback: gradeForm.feedback,
      status: isPass ? 'reviewed' as const : 'resubmit' as const
    });

    logAction(`Graded submission ${selectedSubmission.id} as ${isPass ? 'Pass' : 'Fail'} (${scoreNum}/5 Marks)`);
    toast.success(`Submission graded as ${isPass ? 'Pass' : 'Fail'}`);

    // Auto Certification pipeline
    if (isPass) {
      const student = users.find(u => u.id === selectedSubmission.studentId);
      const course = courses.find(c => c.id === selectedSubmission.courseId);
      if (student && course) {
        const certsList = localStorageService.getCertificates();
        const exists = certsList.some(c => c.studentId === student.id && c.courseId === course.id);
        if (!exists) {
          const newCert: Certificate = {
            id: Math.random().toString(36).substr(2, 9),
            studentId: student.id,
            studentName: student.fullName,
            courseId: course.id,
            courseName: course.title,
            instructorId: course.instructorId,
            instructorName: course.instructorName,
            completionDate: new Date(),
            certificateId: `CERT-${Date.now()}`,
            qrCode: `QR-${Date.now()}`,
            issuedBy: 'Codivexa Learning Management System'
          };
          localStorageService.addCertificate(newCert);
          logAction(`Automatically issued Certificate ${newCert.certificateId} to ${student.fullName}`);
          toast.success(`Certificate automatically issued to ${student.fullName}!`);

          // Set course progress to 100%
          const progressObj = localStorageService.getCourseProgress(student.id, course.id);
          if (progressObj) {
            localStorageService.updateCourseProgress(student.id, course.id, { overallProgress: 100 });
          } else {
            localStorageService.addCourseProgress({
              studentId: student.id,
              courseId: course.id,
              completedLessons: [],
              completedQuizzes: [],
              completedAssignments: [],
              overallProgress: 100,
              lastAccessed: new Date(),
              timeSpent: 120
            });
          }
        }
      }
    }

    setSubmissions(localStorageService.getAssignmentSubmissions());
    setCertificates(localStorageService.getCertificates());
    setSelectedSubmission(null);
  };

  // Certificate Operations
  const handleIssueCertManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCertForm.studentId || !manualCertForm.courseId) return;

    const student = users.find(u => u.id === manualCertForm.studentId);
    const course = courses.find(c => c.id === manualCertForm.courseId);

    if (!student || !course) return;

    const exists = certificates.some(c => c.studentId === student.id && c.courseId === course.id);
    if (exists) {
      toast.error('An active certificate already exists for this student & course.');
      return;
    }

    const newCert: Certificate = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.fullName,
      courseId: course.id,
      courseName: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      completionDate: new Date(),
      certificateId: `CERT-${Date.now()}`,
      qrCode: `QR-${Date.now()}`,
      issuedBy: 'Codivexa Learning Management System',
      status: 'pending' as any
    };

    localStorageService.addCertificate(newCert);
    logAction(`Submitted certificate request ${newCert.certificateId} for ${student.fullName}`);
    toast.success('Certificate request submitted for approval.');
    
    setCertificates(localStorageService.getCertificates());
    setIsManualCertOpen(false);
  };

  const handleRevokeCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRevokeModal || !revokeReason) return;

    localStorageService.deleteCertificate(certRevokeModal.id);
    logAction(`Revoked Certificate ${certRevokeModal.certificateId} of ${certRevokeModal.studentName} due to: ${revokeReason}`);
    toast.success('Certificate revoked successfully.');
    
    setCertificates(localStorageService.getCertificates());
    setCertRevokeModal(null);
  };

  const handleApproveCert = (certId: string) => {
    localStorageService.updateCertificate(certId, { status: 'approved' });
    const cert = certificates.find(c => c.id === certId);
    if (cert) {
      logAction(`Approved certificate request ${cert.certificateId} for student ${cert.studentName}`);
      toast.success(`Approved certificate for ${cert.studentName}!`);
    }
    setCertificates(localStorageService.getCertificates());
  };

  const handleRejectCert = (certId: string) => {
    const cert = certificates.find(c => c.id === certId);
    if (cert) {
      localStorageService.deleteCertificate(certId);
      logAction(`Rejected certificate request ${cert.certificateId} for student ${cert.studentName}`);
      toast.success(`Rejected certificate request for ${cert.studentName}.`);
    }
    setCertificates(localStorageService.getCertificates());
  };

  // Payment Operations
  const handleRefundPayment = (pay: Payment) => {
    if (confirm(`Process a full refund of $${pay.amount} for Transaction ${pay.transactionId}?`)) {
      localStorageService.updatePayment(pay.id, { status: 'refunded' as const });
      logAction(`Processed full refund for transaction ID: ${pay.transactionId}`);
      toast.success('Transaction refunded.');
      
      setPayments(localStorageService.getPayments());
    }
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Student ID', 'Course ID', 'Amount', 'Method', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.transactionId,
      p.studentId,
      p.courseId,
      p.amount,
      p.method,
      p.status,
      new Date(p.createdAt).toLocaleDateString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(v => `"${v}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `codivexa_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('Exported payments report to CSV');
    toast.success('CSV Report downloaded.');
  };

  // Settings & System configuration
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const config = { platformName, currency, sessionTimeout };
    localStorage.setItem('codivexa_settings', JSON.stringify(config));
    logAction(`Updated system preferences. (Platform Name: ${platformName})`);
    toast.success('Settings saved successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwords.current !== 'admin123') {
      toast.error('Incorrect current password.');
      return;
    }
    toast.success('Credentials changed successfully!');
    logAction('Admin security credentials updated.');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleResetDatabase = () => {
    if (confirm('Are you sure you want to reset the database? This will clear all custom students, payments, certificates, and submissions, and reset it to a clean slate.')) {
      localStorage.removeItem('codivexa_users');
      localStorage.removeItem('codivexa_payments');
      localStorage.removeItem('codivexa_certificates');
      localStorage.removeItem('codivexa_courses');
      localStorage.removeItem('codivexa_assignment_submissions');
      localStorage.removeItem('codivexa_course_progress');
      localStorage.removeItem('codivexa_reviews');
      localStorage.removeItem('codivexa_notifications');
      localStorage.removeItem('codivexa_current_user');
      
      toast.success('Database reset successfully. Reloading platform...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Computations & Stats
  const activeStudents = users.filter(u => u.role === 'student');
  const studentCount = activeStudents.length;
  const activeCoursesCount = courses.filter(c => c.published).length;
  
  // Successful payments sum
  const successfulPayments = payments.filter(p => p.status === 'completed');
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  // Pass rate
  const completedSubs = submissions.filter(s => s.status === 'reviewed');
  const passingSubs = completedSubs.filter(s => s.marks !== undefined && s.marks >= 70);
  const passPercentage = completedSubs.length > 0 ? Math.round((passingSubs.length / completedSubs.length) * 100) : 100;

  // Filtered Lists
  const filteredStudentsList = activeStudents.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoursesList = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = courseFilter === 'All' || c.category === courseFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredPaymentsList = payments.filter(p => {
    const matchesSearch = p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) || p.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const approvedCerts = certificates.filter(c => c.status === 'approved' || !c.status);
  const pendingCerts = certificates.filter(c => c.status === 'pending');

  const filteredCertsList = approvedCerts.filter(c => 
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCertRequests = pendingCerts.filter(c => 
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submissions filter
  const filteredSubmissionsList = submissions.filter(sub => {
    const student = users.find(u => u.id === sub.studentId);
    const course = courses.find(c => c.id === sub.courseId);
    const query = searchQuery.toLowerCase();
    return (
      (student?.fullName.toLowerCase().includes(query) || false) ||
      (course?.title.toLowerCase().includes(query) || false) ||
      sub.id.toLowerCase().includes(query)
    );
  });

  const pendingSubmissions = filteredSubmissionsList.filter(s => s.status === 'pending');

  // Revenue analytics filter
  const getTimelinePayments = () => {
    if (revenueTimeframe === 'This Month') {
      return successfulPayments.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth());
    }
    return successfulPayments;
  };
  const timelinePayments = getTimelinePayments();
  const timelineRevenue = timelinePayments.reduce((sum, p) => sum + p.amount, 0);

  // Computed MRR based on 25% of student course fees
  const computedMRR = activeStudents.reduce((sum, s) => {
    const student = s as Student;
    return sum + (student.enrolledCourses?.reduce((sumCourse, cid) => {
      const course = courses.find(c => c.id === cid);
      return sumCourse + (course ? Math.round(course.price / 4) : 0);
    }, 0) || 0);
  }, 0);

  const arpu = studentCount > 0 ? (totalRevenue / studentCount) : 0;

  const totalEnrollments = activeStudents.reduce((sum, s) => {
    const student = s as Student;
    return sum + (student.enrolledCourses?.length || 0);
  }, 0);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans relative overflow-hidden">
      <BackgroundBlobs />
      
      {/* 1. SIDEBAR PANEL */}
      <aside className="w-64 bg-white backdrop-blur-md border-r border-gray-200 flex flex-col justify-between p-6 shrink-0 text-gray-900 relative z-10">
        <div>
          <div className="flex flex-col items-center mb-8 border-b border-gray-200/50 pb-6 w-full pt-2">
            <Logo />
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'assessments', label: 'Assessments', icon: FileText },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'revenue', label: 'Revenue Dashboard', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = sidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setSidebarTab(tab.id as any); setSearchQuery(''); }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-600/30 to-orange-600/30 border-l-4 border-orange-500 text-orange-600' 
                      : 'text-gray-500 hover:bg-gray-50/50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center font-bold text-gray-900">
              SK
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Sanjana Kasarla</p>
              <p className="text-xs text-gray-500">Super Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600/10 hover:bg-red-600 hover:text-gray-900 border border-red-500/20 text-red-400 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 overflow-y-auto p-8 bg-transparent relative z-10">
        
        {/* Header HUD */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{sidebarTab} Control</h1>
            <p className="text-sm text-gray-500 mt-2">Manage settings, platform curriculums, and analyze real-time conversions.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-all">
              <Bell className="w-5 h-5" />
              {submissions.filter(s => s.status === 'pending').length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500">
              IP Sandbox Mode
            </div>
          </div>
        </header>

        {/* 2. OVERVIEW PANEL */}
        {sidebarTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { label: 'Total Enrolled Students', value: totalEnrollments, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Active Courses Catalog', value: activeCoursesCount, icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'Assessment Attempts', value: assessmentAttempts, icon: PlayCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { label: 'Total Successful Charges', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { label: 'Assessment Passing Rate', value: `${passPercentage}%`, icon: CheckCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card key={idx} className="border-gray-200 bg-white/50">
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</p>
                          <p className="text-3xl font-extrabold text-gray-900 mt-3">{card.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${card.bg}`}>
                          <Icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {/* Quick action buttons */}
            <Card className="border-gray-200 bg-white/40">
              <CardBody className="p-6 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Curriculum & Registration Actions:</h3>
                  <p className="text-xs text-gray-500 mt-1">Quick links to update LMS configurations.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-900" onClick={() => setIsAddCourseOpen(true)}>
                    + Create Course
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-900" onClick={() => setIsAddStudentOpen(true)}>
                    + Register Student
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-900" onClick={() => { setSidebarTab('assessments'); }}>
                    Grade Assignments
                  </Button>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Distribution */}
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-6">User Distribution Ratio</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Students</span>
                        <span className="font-semibold text-gray-900">{studentCount} ({Math.round(studentCount / Math.max(1, users.length) * 100)}%)</span>
                      </div>
                      <ProgressBar value={(studentCount / Math.max(1, users.length)) * 100} color="blue" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Instructors</span>
                        <span className="font-semibold text-gray-900">{users.filter(u => u.role === 'instructor').length}</span>
                      </div>
                      <ProgressBar value={(users.filter(u => u.role === 'instructor').length / Math.max(1, users.length)) * 100} color="yellow" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Recent activity */}
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-6">Security Events Feed</h3>
                  <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2">
                    {auditLogs.slice(0, 4).map(log => (
                      <div key={log.id} className="flex items-start space-x-3 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-gray-200">{log.action}</p>
                          <p className="text-xs text-gray-500 mt-1">{log.timestamp} | {log.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* 3. STUDENTS PANEL */}
        {sidebarTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="relative w-80">
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Search by student email or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3.5 top-2.5 text-gray-500">🔍</span>
              </div>
              <Button variant="primary" size="sm" onClick={() => setIsAddStudentOpen(true)}>
                + Add Student
              </Button>
            </div>

            <Card className="border-gray-200 bg-white/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-white/80 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="py-4 px-6">Name / Details</th>
                      <th className="py-4 px-6">Enrolled Modules</th>
                      <th className="py-4 px-6">Account Status</th>
                      <th className="py-4 px-6 text-right">Administrative Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredStudentsList.map((student) => (
                      <tr key={student.id} className="hover:bg-white/40 transition-all cursor-pointer" onClick={() => handleOpenStudentDetails(student)}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                              {student.fullName[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{student.fullName}</p>
                              <p className="text-xs text-gray-500">{student.email} | {student.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="default" className="bg-orange-500/10 text-orange-400 border-0">
                            {(student as Student).enrolledCourses?.length || 0} Modules
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={student.isBanned ? 'danger' : 'success'}>
                            {student.isBanned ? 'Deactivated' : 'Active'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => handleOpenStudentDetails(student)} />
                            <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} onClick={(e) => handleOpenEditStudent(student, e)} />
                            <Button variant="ghost" size="sm" icon={<Ban className="w-4 h-4" />} onClick={(e) => handleBanToggle(student.id, e)} className={student.isBanned ? 'text-green-500' : 'text-amber-500'} />
                            <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={(e) => handleDeleteUser(student.id, e)} className="text-red-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudentsList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500 font-medium">No students registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 4. COURSES PANEL */}
        {sidebarTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="relative w-80">
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Search courses..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3.5 top-2.5 text-gray-500">🔍</span>
              </div>
              
              <div className="flex gap-4">
                <select 
                  className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                  value={courseFilter}
                  onChange={e => setCourseFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="data-science">Data Science</option>
                  <option value="devops">Devops</option>
                </select>
                <Button variant="primary" size="sm" onClick={() => { resetCourseForm(); setIsAddCourseOpen(true); }}>
                  + Add Course
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCoursesList.map((course) => (
                <Card key={course.id} className="border-gray-200 bg-white/40 overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-12 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{course.title}</h4>
                        <p className="text-xs text-gray-500 capitalize">{course.category} | {course.difficulty}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Curriculum: {course.lessons?.length || 0} Lectures</span>
                      <span className="font-bold text-gray-900 text-sm">${course.price}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 border-t border-gray-200/50 px-6 py-3.5 flex justify-between items-center">
                    <Badge variant={course.published ? 'success' : 'warning'}>
                      {course.published ? 'Published' : 'Draft'}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} onClick={(e) => handleOpenEditCourse(course, e)} />
                      <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={(e) => handleDeleteCourse(course.id, e)} className="text-red-500" />
                    </div>
                  </div>
                </Card>
              ))}
              {filteredCoursesList.length === 0 && (
                <div className="col-span-2 py-8 text-center text-gray-500 font-medium">No courses cataloged.</div>
              )}
            </div>
          </div>
        )}

        {/* 5. ASSESSMENTS PANEL */}
        {sidebarTab === 'assessments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap border-b border-gray-200 pb-4">
              <div className="flex gap-6">
                <button 
                  onClick={() => setAssessSubTab('configs')}
                  className={`text-sm font-semibold pb-2 px-1 transition-all ${
                    assessSubTab === 'configs' 
                      ? 'border-b-2 border-orange-500 text-orange-600' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Assessment Submissions Log
                </button>
                <button 
                  onClick={() => setAssessSubTab('queue')}
                  className={`text-sm font-semibold pb-2 px-1 transition-all flex items-center gap-2 ${
                    assessSubTab === 'queue' 
                      ? 'border-b-2 border-orange-500 text-orange-600' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Pending Evaluations Queue
                  {submissions.filter(s => s.status === 'pending').length > 0 && (
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {submissions.filter(s => s.status === 'pending').length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Search submissions by student or course..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3.5 top-2.5 text-gray-500">🔍</span>
              </div>
            </div>

            {/* Submissions Log (Tab 1) */}
            {assessSubTab === 'configs' && (
              <Card className="border-gray-200 bg-white/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-white/80 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Course Module</th>
                        <th className="py-4 px-6">Submitted File</th>
                        <th className="py-4 px-6">Evaluation Score</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredSubmissionsList.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/40 transition-all">
                          <td className="py-4 px-6 font-semibold text-gray-900">
                            {users.find(u => u.id === sub.studentId)?.fullName || 'Real Student'}
                          </td>
                          <td className="py-4 px-6 text-gray-500">
                            {courses.find(c => c.id === sub.courseId)?.title || 'Course'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2 text-orange-400 text-xs">
                              <FileText className="w-4 h-4" />
                              <span className="underline cursor-pointer" onClick={() => alert(`Downloading document: ${sub.files[0]?.title}`)}>
                                {sub.files[0]?.title || 'submission_project.zip'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold">{sub.marks !== undefined ? `${sub.marks} / 5 Marks` : '--'}</td>
                          <td className="py-4 px-6">
                            <Badge variant={sub.status === 'reviewed' ? 'success' : 'warning'}>
                              {sub.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button 
                              variant={sub.status === 'pending' ? 'primary' : 'outline'} 
                              size="sm" 
                              onClick={() => handleOpenGrade(sub)}
                              className="px-4 py-1.5 text-xs font-semibold"
                            >
                              {sub.status === 'pending' ? 'Review Now' : 'Edit Grade'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredSubmissionsList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">No student assessments submitted.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Submissions Queue (Tab 2) */}
            {assessSubTab === 'queue' && (
              <Card className="border-gray-200 bg-white/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-white/80 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Course Module</th>
                        <th className="py-4 px-6">Submitted File</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {pendingSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/40 transition-all">
                          <td className="py-4 px-6 font-semibold text-gray-900">
                            {users.find(u => u.id === sub.studentId)?.fullName || 'Real Student'}
                          </td>
                          <td className="py-4 px-6 text-gray-500">
                            {courses.find(c => c.id === sub.courseId)?.title || 'Course'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2 text-orange-400 text-xs">
                              <FileText className="w-4 h-4" />
                              <span className="underline cursor-pointer" onClick={() => alert(`Downloading document: ${sub.files[0]?.title}`)}>
                                {sub.files[0]?.title || 'submission_project.zip'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant="warning">pending</Badge>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={() => handleOpenGrade(sub)}
                              className="px-4 py-1.5 text-xs font-semibold"
                            >
                              Review Now
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {pendingSubmissions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">No pending submissions awaiting evaluation.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 6. CERTIFICATES PANEL */}
        {sidebarTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap border-b border-gray-200 pb-4">
              <div className="flex gap-6">
                <button 
                  onClick={() => setCertSubTab('ledger')}
                  className={`text-sm font-semibold pb-2 px-1 transition-all ${
                    certSubTab === 'ledger' 
                      ? 'border-b-2 border-orange-500 text-orange-600' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Certificate Ledger
                </button>
                <button 
                  onClick={() => setCertSubTab('requests')}
                  className={`text-sm font-semibold pb-2 px-1 transition-all flex items-center gap-2 ${
                    certSubTab === 'requests' 
                      ? 'border-b-2 border-orange-500 text-orange-600' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Approval Requests Queue
                  {pendingCerts.length > 0 && (
                    <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {pendingCerts.length}
                    </span>
                  )}
                </button>
              </div>
              <Button variant="primary" size="sm" onClick={() => setIsManualCertOpen(true)}>
                + Issue Exemption Cert
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder={certSubTab === 'ledger' ? "Search approved certificates..." : "Search certificate requests..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3.5 top-2.5 text-gray-500">🔍</span>
              </div>
            </div>

            {certSubTab === 'ledger' ? (
              <Card className="border-gray-200 bg-white/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-white/80 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="py-4 px-6">Certificate ID</th>
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Course Module</th>
                        <th className="py-4 px-6">Issue Date</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredCertsList.map((cert) => (
                        <tr key={cert.id} className="hover:bg-white/40 transition-all">
                          <td className="py-4 px-6 font-mono text-xs text-gray-900 font-bold">{cert.certificateId}</td>
                          <td className="py-4 px-6">{cert.studentName}</td>
                          <td className="py-4 px-6 text-gray-500">{cert.courseName}</td>
                          <td className="py-4 px-6">{new Date(cert.completionDate).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-orange-400" />} onClick={() => setSelectedViewCert(cert)} />
                              <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} onClick={() => setCertRevokeModal(cert)} />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCertsList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">No approved certificates registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card className="border-gray-200 bg-white/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-white/80 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="py-4 px-6">Certificate ID</th>
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Course Module</th>
                        <th className="py-4 px-6">Completion Date</th>
                        <th className="py-4 px-6 text-right">Approval Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredCertRequests.map((cert) => (
                        <tr key={cert.id} className="hover:bg-white/40 transition-all">
                          <td className="py-4 px-6 font-mono text-xs text-gray-900 font-bold">{cert.certificateId}</td>
                          <td className="py-4 px-6">{cert.studentName}</td>
                          <td className="py-4 px-6 text-gray-500">{cert.courseName}</td>
                          <td className="py-4 px-6">{new Date(cert.completionDate).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-400 border-green-500/30 hover:bg-green-500 hover:text-gray-900" 
                                onClick={() => handleApproveCert(cert.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-400 border-red-500/30 hover:bg-red-500 hover:text-gray-900" 
                                onClick={() => handleRejectCert(cert.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCertRequests.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">No pending certificate requests.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 7. PAYMENT REPORTS PANEL */}
        {sidebarTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="relative w-80">
                <input 
                  type="text" 
                  className="w-full bg-white text-gray-900 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Search transactions by student ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3.5 top-2.5 text-gray-500">🔍</span>
              </div>

              <div className="flex gap-4">
                <select 
                  className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
                <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-900 flex gap-2" onClick={handleExportCSV}>
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
            </div>

            <Card className="border-gray-200 bg-white/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-white/80 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="py-4 px-6">Transaction ID</th>
                      <th className="py-4 px-6">Student ID</th>
                      <th className="py-4 px-6">Course Module</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Method</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Administrative details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPaymentsList.map((pay) => (
                      <tr key={pay.id} className="hover:bg-white/40 transition-all">
                        <td className="py-4 px-6 font-mono text-xs text-gray-900 font-bold">{pay.transactionId}</td>
                        <td className="py-4 px-6 text-xs text-gray-500">{pay.studentId}</td>
                        <td className="py-4 px-6">{courses.find(c => c.id === pay.courseId)?.title || 'React Programming'}</td>
                        <td className="py-4 px-6 font-bold">${pay.amount}</td>
                        <td className="py-4 px-6 uppercase text-xs text-gray-500">{pay.method}</td>
                        <td className="py-4 px-6">
                          <Badge variant={pay.status === 'completed' ? 'success' : pay.status === 'refunded' ? 'warning' : 'danger'}>
                            {pay.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" icon={<FileText className="w-4 h-4 text-gray-500" />} onClick={() => setSelectedInvoice(pay)} />
                            {pay.status === 'completed' && (
                              <Button variant="ghost" size="sm" icon={<ArrowLeftRight className="w-4 h-4 text-amber-500" />} onClick={() => handleRefundPayment(pay)} title="Refund transaction" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPaymentsList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">No payments registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 8. REVENUE DASHBOARD PANEL */}
        {sidebarTab === 'revenue' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Platform Revenue dashboard</h3>
                <p className="text-xs text-gray-500 mt-1">Timeline filtered statistics.</p>
              </div>
              <select 
                className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                value={revenueTimeframe}
                onChange={e => setRevenueTimeframe(e.target.value)}
              >
                <option value="This Year">This Year</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="This Month">This Month</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Revenue (Successful charges)</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-3">${timelineRevenue.toLocaleString()}</p>
                </CardBody>
              </Card>
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Monthly Recurring Revenue (MRR)</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-3">${computedMRR.toLocaleString()}</p>
                </CardBody>
              </Card>
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Avg. Revenue per student (ARPU)</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-3">${arpu.toFixed(2)}</p>
                </CardBody>
              </Card>
            </div>

            {/* Graphs fallback message / list of sales since custom charts may require more data */}
            <Card className="border-gray-200 bg-white/40">
              <CardBody className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Earnings distribution per Course module</h3>
                <div className="space-y-4">
                  {courses.map(course => {
                    const courseSales = payments
                      .filter(p => p.courseId === course.id && p.status === 'completed')
                      .reduce((sum, p) => sum + p.amount, 0);
                    const barPercent = totalRevenue > 0 ? (courseSales / totalRevenue) * 100 : 0;
                    return (
                      <div key={course.id}>
                        <div className="flex justify-between text-xs text-gray-700 mb-1.5">
                          <span>{course.title}</span>
                          <span className="font-semibold text-gray-900">${courseSales.toLocaleString()}</span>
                        </div>
                        <ProgressBar value={Math.min(100, barPercent)} color="blue" />
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* 9. SETTINGS PANEL */}
        {sidebarTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              {/* LMS Branding Form */}
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <img src="/logo.png" className="w-5 h-5" alt="logo" /> Platform Preferences
                  </h3>
                  
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <Input 
                      label="Platform brand Logo/Name"
                      type="text"
                      className="bg-gray-700 border-gray-600 text-gray-900"
                      value={platformName}
                      onChange={e => setPlatformName(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
                          LMS Base Currency
                        </label>
                        <select 
                          value={currency}
                          onChange={e => setCurrency(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-900 bg-gray-700 border-gray-600 text-gray-900"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                      <Input 
                        label="Session timeout (minutes)"
                        type="number"
                        min="5" 
                        max="480"
                        className="bg-gray-700 border-gray-600 text-gray-900"
                        value={sessionTimeout}
                        onChange={e => setSessionTimeout(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" variant="primary" size="sm" className="w-full flex gap-2 justify-center mt-6">
                      Save Platform Preferences
                    </Button>
                  </form>
                </CardBody>
              </Card>

              {/* Password credentials change */}
              <Card className="border-gray-200 bg-white/40">
                <CardBody className="p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" /> Credentials change
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input 
                      label="Current administrator password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-700 border-gray-600 text-gray-900"
                      value={passwords.current}
                      onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="New password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-700 border-gray-600 text-gray-900"
                        value={passwords.newPass}
                        onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                        required
                      />
                      <Input 
                        label="Confirm new password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-700 border-gray-600 text-gray-900"
                        value={passwords.confirm}
                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" variant="outline" size="sm" className="w-full mt-6 bg-white border-gray-200 text-gray-900 hover:bg-gray-50">
                      Update credentials
                    </Button>
                  </form>
                </CardBody>
              </Card>

              {/* Reset database card */}
              <Card className="border-red-900/30 bg-red-950/10">
                <CardBody className="p-6">
                  <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Reset Database
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Clear all dummy entries and custom records. This will restore the database to an empty slate, keeping only the courses catalog, instructors, and admin user profiles.
                  </p>
                  <Button 
                    type="button" 
                    variant="primary" 
                    className="w-full bg-red-900/40 hover:bg-red-800 border border-red-700/50 text-red-300"
                    onClick={handleResetDatabase}
                  >
                    Reset to Clean Slate
                  </Button>
                </CardBody>
              </Card>
            </div>

            {/* Audit Logs */}
            <Card className="border-gray-200 bg-white/40">
              <CardBody className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" /> Security Event Logs
                </h3>
                <p className="text-xs text-gray-500 mb-4">Track administrative operations and sessions.</p>

                <div className="relative mb-4">
                  <input 
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 text-gray-900 pl-10 pr-4 py-2 rounded-lg text-xs focus:outline-none"
                    placeholder="Search logs..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <span className="absolute left-3 top-2 text-gray-500 text-xs">🔍</span>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                  {auditLogs
                    .filter(log => log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.user.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(log => (
                      <div key={log.id} className="bg-white border border-gray-200/60 p-3 rounded-lg text-xs space-y-1.5">
                        <div className="flex justify-between text-gray-500">
                          <span>User: <strong>{log.user}</strong></span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="font-semibold text-gray-200">{log.action}</p>
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

      </main>

      {/* 10. MODALS HUD */}
      
      {/* ADD STUDENT MODAL */}
      {isAddStudentOpen && (
        <Modal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} title="Register Student Profile">
          <form onSubmit={handleAddStudent} className="space-y-4">
            <Input 
              label="Student Name"
              type="text"
              placeholder="e.g. David Smith"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={studentForm.fullName}
              onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
              required
            />
            <Input 
              label="Email Address"
              type="email"
              placeholder="e.g. david.smith@example.com"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={studentForm.email}
              onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
              required
            />
            <Input 
              label="Mobile phone number"
              type="tel"
              placeholder="+1987654320"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={studentForm.mobile}
              onChange={e => setStudentForm({ ...studentForm, mobile: e.target.value })}
            />
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Enroll in Course Curriculum modules:</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-[120px] overflow-y-auto space-y-2 bg-white">
                {courses.map(course => (
                  <label key={course.id} className="flex items-center space-x-2 text-xs cursor-pointer text-gray-700">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-600 bg-gray-700 text-orange-600"
                      checked={studentForm.enrolledCourses.includes(course.id)}
                      onChange={() => {
                        const enrolled = studentForm.enrolledCourses.includes(course.id)
                          ? studentForm.enrolledCourses.filter(id => id !== course.id)
                          : [...studentForm.enrolledCourses, course.id];
                        setStudentForm({ ...studentForm, enrolledCourses: enrolled });
                      }}
                    />
                    <span>{course.title} (${course.price})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Register Profile</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT STUDENT MODAL */}
      {isEditStudentOpen && (
        <Modal isOpen={isEditStudentOpen} onClose={() => setIsEditStudentOpen(false)} title="Modify Student Details">
          <form onSubmit={handleEditStudent} className="space-y-4">
            <Input 
              label="Student Name"
              type="text"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={studentForm.fullName}
              onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
              required
            />
            <Input 
              label="Email Address"
              type="email"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={studentForm.email}
              onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
              required
            />
            <Input 
              label="Mobile phone number"
              type="tel"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={studentForm.mobile}
              onChange={e => setStudentForm({ ...studentForm, mobile: e.target.value })}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Enrollments:</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-[120px] overflow-y-auto space-y-2 bg-white">
                {courses.map(course => (
                  <label key={course.id} className="flex items-center space-x-2 text-xs cursor-pointer text-gray-700">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-600 bg-gray-700 text-orange-600"
                      checked={studentForm.enrolledCourses.includes(course.id)}
                      onChange={() => {
                        const enrolled = studentForm.enrolledCourses.includes(course.id)
                          ? studentForm.enrolledCourses.filter(id => id !== course.id)
                          : [...studentForm.enrolledCourses, course.id];
                        setStudentForm({ ...studentForm, enrolledCourses: enrolled });
                      }}
                    />
                    <span>{course.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditStudentOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* STUDENT PROFILE CARD MODAL */}
      {selectedStudent && (
        <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Profile Overview">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-bold text-gray-900 text-lg">
                {selectedStudent.fullName[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{selectedStudent.fullName}</h3>
                <p className="text-xs text-gray-500">{selectedStudent.email} | Status: {selectedStudent.isBanned ? 'Banned' : 'Active'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Enrolled courses progress */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Enrolled Course Curriculum</h4>
                <div className="space-y-2">
                  {selectedStudent.enrolledCourses?.map((cid: string) => {
                    const course = courses.find(c => c.id === cid);
                    const progressObj = localStorageService.getCourseProgress(selectedStudent.id, cid);
                    const progressVal = progressObj ? progressObj.overallProgress : 0;
                    return (
                      <div key={cid} className="bg-white border border-gray-200 p-3 rounded-lg text-xs">
                        <div className="flex justify-between font-semibold mb-1">
                          <span>{course?.title || 'Course'}</span>
                          <span className="text-gray-500">{progressVal}%</span>
                        </div>
                        <ProgressBar value={progressVal} color="blue" />
                      </div>
                    );
                  })}
                  {(!selectedStudent.enrolledCourses || selectedStudent.enrolledCourses.length === 0) && (
                    <p className="text-xs text-gray-500 italic">No modules enrolled.</p>
                  )}
                </div>
              </div>

              {/* Certificates and Transactions */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Earned Certificates</h4>
                <div className="space-y-2">
                  {selectedStudent.certs?.map((c: Certificate) => (
                    <div key={c.id} className="bg-green-500/10 border border-green-500/20 text-green-400 p-2 rounded-lg text-xs flex justify-between items-center">
                      <span>{c.courseName}</span>
                      <Award className="w-4 h-4 text-green-400" />
                    </div>
                  ))}
                  {selectedStudent.certs?.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No certificates issued.</p>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-gray-500 uppercase pt-2">Transaction Logs</h4>
                <div className="space-y-2 max-h-[100px] overflow-y-auto">
                  {selectedStudent.payments?.map((p: Payment) => (
                    <div key={p.id} className="bg-white border border-gray-200 p-2 rounded-lg text-[11px] flex justify-between">
                      <span>${p.amount} ({p.status})</span>
                      <span className="text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {selectedStudent.payments?.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No payments logged.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="ghost" onClick={() => setSelectedStudent(null)}>Close Overview</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE COURSE MODAL */}
      {isAddCourseOpen && (
        <Modal isOpen={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} title="Create Course Curriculum">
          <form onSubmit={handleAddCourse} className="space-y-4">
            <Input 
              label="Course Title"
              type="text"
              placeholder="e.g. Python Developer Bootcamp"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={courseForm.title}
              onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-900 bg-gray-700 border-gray-600 text-gray-900"
                  value={courseForm.category}
                  onChange={e => setCourseForm({ ...courseForm, category: e.target.value as any })}
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="data-science">Data Science</option>
                  <option value="devops">Devops</option>
                </select>
              </div>
              <Input 
                label="Price (USD)"
                type="number"
                step="0.01"
                className="bg-gray-700 border-gray-600 text-gray-900"
                value={courseForm.price}
                onChange={e => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                required
              />
            </div>
            <TextArea 
              label="Course Description"
              placeholder="Provide a syllabus summary..."
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={courseForm.description}
              onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
            />

            {/* Video Curriculum Nested Editor */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-gray-500">Curriculum Video Lectures ({courseForm.lessons.length})</h4>
              
              <div className="space-y-2 max-h-[100px] overflow-y-auto bg-white p-2.5 rounded-lg border border-gray-200">
                {courseForm.lessons.map((lesson, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                    <span>{idx + 1}. {lesson.title} ({lesson.duration}m)</span>
                    <button type="button" onClick={() => handleRemoveVideo(idx)} className="text-red-500 text-[10px] underline">Remove</button>
                  </div>
                ))}
                {courseForm.lessons.length === 0 && (
                  <p className="text-xs text-gray-500 italic">No video lectures loaded.</p>
                )}
              </div>

              <div className="flex gap-2 bg-white p-2.5 rounded-lg border border-gray-200">
                <input 
                  type="text"
                  placeholder="Lecture Title"
                  className="flex-1 bg-gray-700 border-gray-600 text-xs px-2.5 py-1.5 rounded text-gray-900"
                  value={newLesson.title}
                  onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                />
                <input 
                  type="number"
                  placeholder="Min"
                  className="w-16 bg-gray-700 border-gray-600 text-xs px-2.5 py-1.5 rounded text-gray-900"
                  value={newLesson.duration}
                  onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                />
                <button type="button" className="bg-orange-600 text-xs px-3 py-1.5 rounded font-bold text-gray-900" onClick={handleAddVideo}>
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox"
                id="pubAdd"
                checked={courseForm.published}
                onChange={e => setCourseForm({ ...courseForm, published: e.target.checked })}
              />
              <label htmlFor="pubAdd" className="text-xs text-gray-500 cursor-pointer">Publish curriculum immediately</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddCourseOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Create Course</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT COURSE MODAL */}
      {isEditCourseOpen && (
        <Modal isOpen={isEditCourseOpen} onClose={() => setIsEditCourseOpen(false)} title="Edit Course Details">
          <form onSubmit={handleEditCourse} className="space-y-4">
            <Input 
              label="Course Title"
              type="text"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={courseForm.title}
              onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
                  Category
                </label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-900 bg-gray-700 border-gray-600 text-gray-900"
                  value={courseForm.category}
                  onChange={e => setCourseForm({ ...courseForm, category: e.target.value as any })}
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="data-science">Data Science</option>
                  <option value="devops">Devops</option>
                </select>
              </div>
              <Input 
                label="Price (USD)"
                type="number"
                step="0.01"
                className="bg-gray-700 border-gray-600 text-gray-900"
                value={courseForm.price}
                onChange={e => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                required
              />
            </div>
            <TextArea 
              label="Course Description"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={courseForm.description}
              onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
            />

            {/* Video Curriculum Nested Editor */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <h4 className="text-xs font-semibold text-gray-500">Curriculum Video Lectures ({courseForm.lessons.length})</h4>
              
              <div className="space-y-2 max-h-[100px] overflow-y-auto bg-white p-2.5 rounded-lg border border-gray-200">
                {courseForm.lessons.map((lesson, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                    <span>{idx + 1}. {lesson.title} ({lesson.duration}m)</span>
                    <button type="button" onClick={() => handleRemoveVideo(idx)} className="text-red-500 text-[10px] underline">Remove</button>
                  </div>
                ))}
                {courseForm.lessons.length === 0 && (
                  <p className="text-xs text-gray-500 italic">No video lectures loaded.</p>
                )}
              </div>

              <div className="flex gap-2 bg-white p-2.5 rounded-lg border border-gray-200">
                <input 
                  type="text"
                  placeholder="Lecture Title"
                  className="flex-1 bg-gray-700 border-gray-600 text-xs px-2.5 py-1.5 rounded text-gray-900"
                  value={newLesson.title}
                  onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                />
                <input 
                  type="number"
                  placeholder="Min"
                  className="w-16 bg-gray-700 border-gray-600 text-xs px-2.5 py-1.5 rounded text-gray-900"
                  value={newLesson.duration}
                  onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                />
                <button type="button" className="bg-orange-600 text-xs px-3 py-1.5 rounded font-bold text-gray-900" onClick={handleAddVideo}>
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox"
                id="pubEdit"
                checked={courseForm.published}
                onChange={e => setCourseForm({ ...courseForm, published: e.target.checked })}
              />
              <label htmlFor="pubEdit" className="text-xs text-gray-500 cursor-pointer">Publish curriculum</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsEditCourseOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* GRADING SUBMISSION MODAL */}
      {selectedSubmission && (
        <Modal isOpen={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} title="Grade Student Submission">
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div className="bg-white border border-gray-200 p-3 rounded-lg text-xs space-y-1.5 text-gray-700">
              <p><strong>Student ID:</strong> {selectedSubmission.studentId}</p>
              <p><strong>Associated Module:</strong> {courses.find(c => c.id === selectedSubmission.courseId)?.title}</p>
              <p><strong>File attachment:</strong> {selectedSubmission.files[0]?.title}</p>
              <p><strong>Submission date:</strong> {new Date(selectedSubmission.submittedAt).toLocaleDateString()}</p>
            </div>

            <Input 
              label="Evaluation score (0 - 5 Questions)"
              type="number"
              min="0"
              max="5"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={gradeForm.score}
              onChange={e => setGradeForm({ ...gradeForm, score: e.target.value })}
              required
            />

            <TextArea 
              label="Critique feedback and comments"
              placeholder="Provide grading comments..."
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={gradeForm.feedback}
              onChange={e => setGradeForm({ ...gradeForm, feedback: e.target.value })}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setSelectedSubmission(null)}>Cancel</Button>
              <Button type="submit" variant="primary">Submit Evaluation</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MANUAL CERTIFICATE EXEMPTION MODAL */}
      {isManualCertOpen && (
        <Modal isOpen={isManualCertOpen} onClose={() => setIsManualCertOpen(false)} title="Issue Exemption Certificate">
          <form onSubmit={handleIssueCertManual} className="space-y-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
                Select Student Profile
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-900 bg-gray-700 border-gray-600 text-gray-900"
                value={manualCertForm.studentId}
                onChange={e => setManualCertForm({ ...manualCertForm, studentId: e.target.value })}
                required
              >
                <option value="" disabled>Select Student</option>
                {activeStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.id})</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-2">
                Select Course Module
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-900 bg-gray-700 border-gray-600 text-gray-900"
                value={manualCertForm.courseId}
                onChange={e => setManualCertForm({ ...manualCertForm, courseId: e.target.value })}
                required
              >
                <option value="" disabled>Select Course</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsManualCertOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Issue Certificate</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* REVOKE CERTIFICATE REASON MODAL */}
      {certRevokeModal && (
        <Modal isOpen={!!certRevokeModal} onClose={() => setCertRevokeModal(null)} title="Revoke Certificate Exemption">
          <form onSubmit={handleRevokeCert} className="space-y-4">
            <p className="text-xs text-gray-500">
              You are about to revoke the certificate issued to <strong>{certRevokeModal.studentName}</strong> for course <strong>{certRevokeModal.courseName}</strong>. This action is recorded in security audit event trails.
            </p>
            <Input 
              label="Reason for revocation"
              type="text"
              placeholder="e.g. Incorrect score calculations detected"
              className="bg-gray-700 border-gray-600 text-gray-900"
              value={revokeReason}
              onChange={e => setRevokeReason(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setCertRevokeModal(null)}>Cancel</Button>
              <Button type="submit" variant="primary" className="bg-red-600 hover:bg-red-700">Confirm Revocation</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW RECEIPT INVOICE MODAL */}
      {selectedInvoice && (
        <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title="Receipt summary invoice">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 p-6 rounded-lg space-y-4 bg-white text-xs text-gray-700">
              <div className="text-center pb-4 border-b border-gray-200">
                <h4 className="font-extrabold text-sm text-orange-400">{platformName.toUpperCase()} LMS</h4>
                <p className="text-[10px] text-gray-500 mt-1">Electronic Payment Summary</p>
              </div>

              <div className="flex justify-between border-b border-gray-200/50 pb-2">
                <span><strong>Transaction:</strong> {selectedInvoice.transactionId}</span>
                <span><strong>Invoice:</strong> {selectedInvoice.invoiceId}</span>
              </div>

              <div className="space-y-1.5">
                <p><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}</p>
                <p><strong>Student ID:</strong> {selectedInvoice.studentId}</p>
                <p><strong>Billing Name:</strong> {users.find(u => u.id === selectedInvoice.studentId)?.fullName || 'John Smith'}</p>
                <p><strong>Checkout Method:</strong> {selectedInvoice.method.toUpperCase()}</p>
                <p><strong>Status:</strong> <span className="uppercase font-semibold">{selectedInvoice.status}</span></p>
              </div>

              <div className="border-t border-gray-200/50 pt-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{courses.find(c => c.id === selectedInvoice.courseId)?.title || 'Course Tuition'}</span>
                  <span>${selectedInvoice.amount}.00</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-900 text-sm border-t border-gray-200 pt-3 mt-3">
                  <span>Grand Total</span>
                  <span>${selectedInvoice.amount}.00</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>Close Receipt</Button>
              <Button variant="primary" onClick={() => alert('Printing summary receipt...')}>Print Receipt</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW CERTIFICATE COMPLETED MODAL (IMAGE 2 REPLICA) */}
      {selectedViewCert && (
        <Modal isOpen={!!selectedViewCert} onClose={() => setSelectedViewCert(null)} title="View Certificate Document">
          <div className="space-y-6">
            <div id="certificate-print-area" className="relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-2xl select-none">
              
              {/* Actual Certificate Template Image */}
              <img 
                src="/certificate_template.png" 
                alt="Certificate Template" 
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
              />

              {/* Masking Patch for baked-in screenshot text at top left */}
              <div className="absolute top-[2%] left-[2%] w-[48%] h-[10%] z-10 pointer-events-none flex">
                <div className="w-[32%] h-full bg-[#0c2340]" />
                <div className="w-[2%] h-full bg-[#c5a85c]" />
                <div className="w-[66%] h-full bg-[#fbf9f5]" />
              </div>

              {/* Masking Patch & Dynamic Student Name Overlay */}
              <div 
                className="absolute top-[44%] left-[23%] w-[54%] h-[12%] z-10 flex items-center justify-center bg-[#fbf9f5]"
              >
                <span className="text-3xl md:text-4xl font-serif font-bold text-[#0c2340] italic tracking-wide text-center">
                  {selectedViewCert.studentName}
                </span>
              </div>

              {/* Masking Patch & Dynamic Course Title Overlay */}
              <div 
                className="absolute top-[63%] left-[25%] w-[50%] h-[7%] z-10 flex items-center justify-center bg-[#fbf9f5]"
              >
                <span className="text-sm md:text-lg font-sans font-extrabold text-[#0c2340] uppercase tracking-wider text-center">
                  {selectedViewCert.courseName}
                </span>
              </div>

              {/* Masking Patch & Dynamic Certificate ID Overlay */}
              <div 
                className="absolute top-[89%] left-[17%] w-[20%] h-[4%] z-10 flex items-center justify-center bg-[#fbf9f5]"
              >
                <span className="text-[9px] md:text-[11px] font-mono font-bold text-[#0c2340] text-center">
                  {selectedViewCert.certificateId}
                </span>
              </div>

              {/* Masking Patch & Dynamic Completion Date Overlay */}
              <div 
                className="absolute top-[87%] left-[42%] w-[16%] h-[5%] z-10 flex items-center justify-center bg-[#fbf9f5]"
              >
                <span className="text-[9px] md:text-[10px] font-sans font-bold text-[#0c2340] text-center">
                  {new Date(selectedViewCert.completionDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="ghost" onClick={() => setSelectedViewCert(null)}>Close</Button>
              <Button variant="primary" onClick={() => {
                const printContents = document.getElementById('certificate-print-area')?.innerHTML;
                if (printContents) {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Print Certificate</title>
                          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                          <style>
                            @page {
                              size: A4 landscape;
                              margin: 0;
                            }
                            html, body {
                              margin: 0 !important;
                              padding: 0 !important;
                              width: 100%;
                              height: 100%;
                              background-color: white;
                              -webkit-print-color-adjust: exact;
                            }
                            .print-container {
                              position: absolute;
                              top: 0;
                              left: 0;
                              width: 100vw;
                              height: 100vh;
                              border: none;
                              border-radius: 0;
                              box-shadow: none;
                              margin: 0;
                              padding: 0;
                              overflow: hidden;
                            }
                            .print-container img {
                              width: 100% !important;
                              height: 100% !important;
                              object-fit: fill !important;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="print-container relative bg-white">
                            ${printContents}
                          </div>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                    }, 500);
                  }
                }
              }}>Print Certificate</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
