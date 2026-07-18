'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Trash2,
  LogOut, Settings, BarChart3, Clock, Award, MessageSquare
} from 'lucide-react';
import { Button, Card, CardBody, Badge, Avatar, ProgressBar } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course, Instructor } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function InstructorDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'instructor') {
      router.push('/instructor-login');
      return;
    }

    const instructorCourses = localStorageService.getCoursesByInstructor(user.id);
    setCourses(instructorCourses);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      localStorageService.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success('Course deleted successfully');
    }
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

  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledCount, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.enrolledCount), 0);

  const stats = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'blue',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: <Users className="w-6 h-6" />,
      color: 'green',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple',
    },
    {
      label: 'Average Rating',
      value: courses.length > 0 ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1) : '0',
      icon: <Award className="w-6 h-6" />,
      color: 'yellow',
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
                Instructor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.fullName}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/instructor/create-course">
                <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
                  Create Course
                </Button>
              </Link>
              <Button
                variant="outline"
                icon={<LogOut className="w-5 h-5" />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
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
            {/* My Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Courses
                </h2>
                <Link href="/instructor/create-course">
                  <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                    Add New
                  </Button>
                </Link>
              </div>

              {courses.length === 0 ? (
                <Card>
                  <CardBody className="p-8 text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No courses yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first course to start teaching
                    </p>
                    <Link href="/instructor/create-course">
                      <Button variant="primary">Create Course</Button>
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                <div className="space-y-4">
                  {courses.map((course, index) => (
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
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  {course.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  <span>{course.enrolledCount} students</span>
                                  <span>{course.rating} rating</span>
                                  <span>${course.price}</span>
                                </div>
                                <Badge variant={course.published ? 'success' : 'warning'}>
                                  {course.published ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/instructor/edit-course/${course.id}`}>
                                  <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />}>
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={<Trash2 className="w-4 h-4" />}
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <Card>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          New enrollment in "React Fundamentals"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          Course "Advanced CSS" published successfully
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          5-star review received for "JavaScript Basics"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
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
                    <Link href="/instructor/create-course">
                      <Button variant="ghost" fullWidth icon={<Plus className="w-4 h-4" />}>
                        Create Course
                      </Button>
                    </Link>
                    <Link href="/instructor/students">
                      <Button variant="ghost" fullWidth icon={<Users className="w-4 h-4" />}>
                        View Students
                      </Button>
                    </Link>
                    <Link href="/instructor/assignments">
                      <Button variant="ghost" fullWidth icon={<MessageSquare className="w-4 h-4" />}>
                        Review Assignments
                      </Button>
                    </Link>
                    <Link href="/instructor/analytics">
                      <Button variant="ghost" fullWidth icon={<BarChart3 className="w-4 h-4" />}>
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Overview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Course Completion Rate</span>
                        <span className="font-medium text-gray-900 dark:text-white">78%</span>
                      </div>
                      <ProgressBar value={78} color="blue" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Student Satisfaction</span>
                        <span className="font-medium text-gray-900 dark:text-white">4.8/5</span>
                      </div>
                      <ProgressBar value={96} color="green" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Quiz Pass Rate</span>
                        <span className="font-medium text-gray-900 dark:text-white">85%</span>
                      </div>
                      <ProgressBar value={85} color="purple" size="sm" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Pending Reviews */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Pending Reviews
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New review on React Course
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Assignment submission pending
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                      </div>
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
