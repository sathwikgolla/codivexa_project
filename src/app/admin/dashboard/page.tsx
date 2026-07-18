'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, DollarSign, TrendingUp, Shield, Settings,
  LogOut, BarChart3, AlertCircle, CheckCircle, Clock, UserPlus,
  Trash2, Edit, Eye, Ban
} from 'lucide-react';
import { Button, Card, CardBody, Badge, Avatar, ProgressBar } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { User, Course, Payment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'payments'>('overview');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/admin-login');
      return;
    }

    const allUsers = localStorageService.getUsers();
    const allCourses = localStorageService.getCourses();
    const allPayments = localStorageService.getPayments();

    setUsers(allUsers);
    setCourses(allCourses);
    setPayments(allPayments);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      localStorageService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      localStorageService.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success('Course deleted successfully');
    }
  };

  const handleBanUser = (userId: string) => {
    const userToBan = users.find(u => u.id === userId);
    if (userToBan) {
      const updatedUser = { ...userToBan, isBanned: !userToBan.isBanned };
      localStorageService.updateUser(userId, updatedUser);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast.success(updatedUser.isBanned ? 'User banned' : 'User unbanned');
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

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const studentCount = users.filter(u => u.role === 'student').length;
  const instructorCount = users.filter(u => u.role === 'instructor').length;
  const publishedCourses = courses.filter(c => c.published).length;

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
    },
    {
      label: 'Total Courses',
      value: courses.length,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'green',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple',
    },
    {
      label: 'Active Payments',
      value: payments.length,
      icon: <TrendingUp className="w-6 h-6" />,
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                System overview and management
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    User Distribution
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Students</span>
                        <span className="font-medium text-gray-900 dark:text-white">{studentCount}</span>
                      </div>
                      <ProgressBar value={(studentCount / users.length) * 100} color="blue" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Instructors</span>
                        <span className="font-medium text-gray-900 dark:text-white">{instructorCount}</span>
                      </div>
                      <ProgressBar value={(instructorCount / users.length) * 100} color="green" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Admins</span>
                        <span className="font-medium text-gray-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</span>
                      </div>
                      <ProgressBar value={(users.filter(u => u.role === 'admin').length / users.length) * 100} color="purple" size="sm" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Course Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Published</span>
                        <span className="font-medium text-gray-900 dark:text-white">{publishedCourses}</span>
                      </div>
                      <ProgressBar value={(publishedCourses / courses.length) * 100} color="green" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Draft</span>
                        <span className="font-medium text-gray-900 dark:text-white">{courses.length - publishedCourses}</span>
                      </div>
                      <ProgressBar value={((courses.length - publishedCourses) / courses.length) * 100} color="yellow" size="sm" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Recent Activity */}
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
                        New user registration: {users[users.length - 1]?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        New payment received: ${payments[payments.length - 1]?.amount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Course published: {courses[courses.length - 1]?.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  User Management ({users.length})
                </h3>
                <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
                  Add User
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Joined</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={userItem.avatar} alt={userItem.fullName} size="sm" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{userItem.fullName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{userItem.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={userItem.role === 'admin' ? 'danger' : userItem.role === 'instructor' ? 'warning' : 'success'}>
                            {userItem.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={userItem.isBanned ? 'danger' : 'success'}>
                            {userItem.isBanned ? 'Banned' : 'Active'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(userItem.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
                            <Button variant="ghost" size="sm" icon={<Ban className="w-4 h-4" />} onClick={() => handleBanUser(userItem.id)} />
                            <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDeleteUser(userItem.id)} className="text-red-600" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Course Management ({courses.length})
                </h3>
              </div>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg'}
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/course-placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructorName}</p>
                    </div>
                    <Badge variant={course.published ? 'success' : 'warning'}>
                      {course.published ? 'Published' : 'Draft'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
                      <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
                      <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDeleteCourse(course.id)} className="text-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Payment History ({payments.length})
                </h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Course</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{payment.transactionId}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{payment.studentId}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{payment.courseId}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">${payment.amount}</td>
                        <td className="py-3 px-4">
                          <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
