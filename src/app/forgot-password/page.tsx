'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { Input, Button, Card, CardBody, BackgroundBlobs, Logo } from '@/components/ui';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email format');
      return;
    }
    
    setLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success('OTP sent to your email!');
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    // Simulate API call to verify OTP
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      toast.success('OTP verified successfully!');
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successfully! Redirecting...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-4 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden">
      <BackgroundBlobs />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <Card glassmorphism>
          <CardBody className="p-8 relative z-10">
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="mb-6">
                <Logo withText={false} className="scale-125" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {step === 1 && "Enter your email to receive a secure OTP"}
                {step === 2 && "Enter the 6-digit code sent to your email"}
                {step === 3 && "Create a new strong password"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-6"
                >
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    placeholder="Enter your registered email"
                    required
                  />
                  <Button type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <Input
                    label="Enter OTP"
                    name="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    icon={<KeyRound className="w-5 h-5 text-gray-400" />}
                    placeholder="123456"
                    className="text-center tracking-widest text-lg font-bold"
                    required
                  />
                  <Button type="submit" variant="primary" fullWidth disabled={loading || otp.length !== 6}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    placeholder="Enter new password"
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    placeholder="Confirm new password"
                    required
                  />
                  <Button type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
