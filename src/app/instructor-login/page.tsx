'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input, Button, Card, CardBody } from '@/components/ui';
import toast from 'react-hot-toast';

export default function InstructorLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Check if user is instructor
        const user = JSON.parse(localStorage.getItem('codivexa_currentUser') || '{}');
        if (user.role === 'instructor') {
          toast.success('Instructor login successful! Redirecting to dashboard...', {
            duration: 2000,
          });
          setTimeout(() => {
            router.push('/instructor/dashboard');
          }, 1500);
        } else {
          toast.error('Access denied. Instructor privileges required.');
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card glassmorphism>
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-green-600 to-teal-600 mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Instructor Login
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Access your instructor dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                placeholder="Enter instructor email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  placeholder="Enter instructor password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                Instructor Sign In
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Student Login
              </Link>
              {' | '}
              <Link
                href="/admin-login"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Admin Login
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
