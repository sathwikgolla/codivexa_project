'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, TrendingUp, Play, CheckCircle,
  Calendar, Bell, Settings, LogOut, User, BarChart3
} from 'lucide-react';
import { Button, Card, CardBody, Badge, Avatar, ProgressBar } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course, Certificate, CourseProgress } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    const loadDashboardData = () => {
      const allCourses = localStorageService.getCourses();
      const userCertificates = localStorageService.getCertificatesByStudent(user!.id);
      const userProgress = (user as any).progress || [];

      const enrolled = allCourses.filter(course => 
        (user as any).enrolledCourses?.includes(course.id)
      );

      const completed = allCourses.filter(course =>
        (user as any).completedCourses?.includes(course.id)
      );

      // Calculate progress for each enrolled course
      const enrolledWithProgress = enrolled.map(course => {
        const courseProgress = userProgress.find((p: any) => p.courseId === course.id);
        const progressPercentage = courseProgress?.progressPercentage || 0;
        return {
          ...course,
          progressPercentage,
          hasCertificate: userCertificates.some(cert => cert.courseId === course.id),
        };
      });

      setEnrolledCourses(enrolledWithProgress);
      setCompletedCourses(completed);
      setCertificates(userCertificates);
      setLoading(false);
    };

    loadDashboardData();
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'blue',
    },
    {
      label: 'Completed Courses',
      value: completedCourses.length,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
    },
    {
      label: 'Certificates',
      value: certificates.length,
      icon: <Award className="w-6 h-6" />,
      color: 'blue',
    },
    {
      label: 'Learning Hours',
      value: '24',
      icon: <Clock className="w-6 h-6" />,
      color: 'orange',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.fullName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Continue your learning journey
              </p>
            </div>
            <Button
              variant="outline"
              icon={<LogOut className="w-5 h-5" />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                      <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Continue Learning
                </h2>
                <Link href="/courses" className="text-blue-600 hover:text-blue-700 text-sm">
                  Browse Courses
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <Card>
                  <CardBody className="p-8 text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No courses enrolled yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Link href="/courses">
                      <Button variant="primary">Browse Courses</Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course: any, index) => (
                    <Card hover key={course.id}>
                      <CardBody>
                        <div className="flex gap-4">
                          <img
                            src={course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg'}
                            alt={course.title}
                            className="w-32 h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/images/course-placeholder.svg';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <span>{course.instructorName}</span>
                              <span>•</span>
                              <span>{Math.floor(course.duration / 60)} hours</span>
                              <span>•</span>
                              <span>{course.lessonsCount} lessons</span>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="font-medium text-gray-900 dark:text-white">{course.progressPercentage || 0}%</span>
                              </div>
                              <ProgressBar value={course.progressPercentage || 0} showLabel={false} size="sm" />
                            </div>
                            <div className="flex items-center gap-2">
                              {course.hasCertificate && (
                                <Badge variant="success" className="text-xs">Certificate Earned</Badge>
                              )}
                              <Badge variant={course.progressPercentage === 100 ? 'success' : 'warning'} className="text-xs">
                                {course.progressPercentage === 100 ? 'Completed' : 'In Progress'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Link href={`/courses/${course.id}/learn`}>
                              <Button variant="primary" size="sm" icon={<Play className="w-4 h-4" />}>
                                Continue
                              </Button>
                            </Link>
                            <Link href={`/courses/${course.id}`}>
                              <Button variant="ghost" size="sm">
                                View Course
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Completed Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedCourses.map((course) => (
                    <Card hover key={course.id}>
                      <CardBody>
                        <img
                          src={course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg'}
                          alt={course.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.currentTarget.src = '/images/course-placeholder.svg';
                          }}
                        />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <Badge variant="success">Completed</Badge>
                          <Link href="/student/certificates">
                            <Button variant="outline" size="sm">
                              View Certificate
                            </Button>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Link href="/courses">
                      <Button variant="ghost" fullWidth icon={<BookOpen className="w-4 h-4" />}>
                        Browse Courses
                      </Button>
                    </Link>
                    <Link href="/student/certificates">
                      <Button variant="ghost" fullWidth icon={<Award className="w-4 h-4" />}>
                        My Certificates
                      </Button>
                    </Link>
                    <Link href="/student/profile">
                      <Button variant="ghost" fullWidth icon={<User className="w-4 h-4" />}>
                        Profile Settings
                      </Button>
                    </Link>
                    <Link href="/student/notifications">
                      <Button variant="ghost" fullWidth icon={<Bell className="w-4 h-4" />}>
                        Notifications
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          Completed "React Basics" lesson
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          Passed JavaScript Quiz
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          Enrolled in "Advanced CSS"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Learning Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Learning Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">This Week</span>
                        <span className="font-medium text-gray-900 dark:text-white">12 hours</span>
                      </div>
                      <ProgressBar value={75} color="blue" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">This Month</span>
                        <span className="font-medium text-gray-900 dark:text-white">48 hours</span>
                      </div>
                      <ProgressBar value={60} color="green" size="sm" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
