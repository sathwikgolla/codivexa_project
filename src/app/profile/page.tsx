'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Camera, Save, Lock,
  Bell, Shield, CreditCard, BookOpen, Award, Settings
} from 'lucide-react';
import { Button, Card, CardBody, Input, Avatar, Badge } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { User as UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'billing'>('profile');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        address: user.address || '',
        avatar: user.avatar || '',
      });
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  const handleProfileSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedUser: UserType = {
        ...user,
        ...formData,
        updatedAt: new Date(),
      };

      localStorageService.updateUser(user.id, updatedUser);
      localStorageService.setCurrentUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      // In a real app, you would verify the current password
      const updatedUser: UserType = {
        ...user,
        password: passwordData.newPassword,
        updatedAt: new Date(),
      };

      localStorageService.updateUser(user.id, updatedUser);
      localStorageService.setCurrentUser(updatedUser);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <Avatar src={formData.avatar} alt={formData.fullName} size="xl" />
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formData.fullName}
                    </h2>
                    <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'instructor' ? 'warning' : 'success'}>
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    disabled
                  />
                  <Input
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  />
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                    <Button
                      variant="primary"
                      icon={<Save className="w-4 h-4" />}
                      onClick={handleProfileSave}
                      loading={saving}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Change Password
                </h2>

                <div className="space-y-6 mb-8">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                  />
                </div>

                <Button
                  variant="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handlePasswordChange}
                  loading={saving}
                >
                  Update Password
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new courses', checked: true },
                    { label: 'Email notifications for course updates', checked: true },
                    { label: 'Email notifications for quiz results', checked: true },
                    { label: 'Email notifications for certificates', checked: true },
                    { label: 'SMS notifications', checked: false },
                    { label: 'Push notifications', checked: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-900 dark:text-white">{item.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  variant="primary"
                  className="mt-6"
                  icon={<Save className="w-4 h-4" />}
                  onClick={() => toast.success('Notification preferences saved!')}
                >
                  Save Preferences
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardBody className="p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Billing Information
                </h2>

                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No payment methods on file
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add a payment method to enable quick checkout
                  </p>
                  <Button variant="primary">
                    Add Payment Method
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Payment History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No payment history available
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
