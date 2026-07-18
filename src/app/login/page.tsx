'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input, Button, Card, CardBody } from '@/components/ui';
import toast from 'react-hot-toast';

export default function LoginPage() {
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
        const user = (login as any).user || JSON.parse(localStorage.getItem('codivexa_currentUser') || '{}');
        const userRole = user.role || 'student';
        
        toast.success('Login successful! Redirecting to dashboard...', {
          duration: 2000,
        });
        setTimeout(() => {
          if (userRole === 'student') {
            router.push('/student/dashboard');
          } else if (userRole === 'instructor') {
            router.push('/instructor/dashboard');
          } else if (userRole === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/student/dashboard');
          }
        }, 1500);
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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(135deg,_var(--background)_0%,_var(--muted)_100%)] px-4 pb-12 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-6 inline-flex items-center text-[color:var(--foreground)]/70 hover:text-[color:var(--primary)]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card glassmorphism>
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-[color:var(--foreground)]">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to continue your learning journey
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
                placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-[color:var(--foreground)]/60 hover:text-[color:var(--foreground)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-[color:var(--foreground)]/70">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[color:var(--primary)] hover:text-[color:var(--secondary)]"
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
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link
                href="/admin-login"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Admin Login
              </Link>
              {' | '}
              <Link
                href="/instructor-login"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Instructor Login
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
