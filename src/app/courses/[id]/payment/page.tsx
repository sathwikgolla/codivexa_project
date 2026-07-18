'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CreditCard, Smartphone, Wallet, Building2, CheckCircle, 
  ArrowLeft, Lock, ShieldCheck 
} from 'lucide-react';
import { Button, Card, CardBody, Input, Badge } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course, Payment, PaymentMethod, Invoice } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
  });

  const paymentMethods: { id: PaymentMethod; name: string; icon: React.ReactNode }[] = [
    { id: 'upi', name: 'UPI', icon: <Smartphone className="w-6 h-6" /> },
    { id: 'credit-card', name: 'Credit Card', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'debit-card', name: 'Debit Card', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'wallet', name: 'Wallet', icon: <Wallet className="w-6 h-6" /> },
    { id: 'net-banking', name: 'Net Banking', icon: <Building2 className="w-6 h-6" /> },
  ];

  useEffect(() => {
    const courseId = params.id as string;
    const foundCourse = localStorageService.getCourseById(courseId);
    setCourse(foundCourse || null);
    setLoading(false);
  }, [params.id]);

  const handlePayment = async () => {
    if (!user || !course) return;

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Create payment record
      const payment: Payment = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: user.id,
        courseId: course.id,
        amount: course.price,
        method: selectedMethod,
        status: 'completed',
        transactionId: `TXN${Date.now()}`,
        invoiceId: `INV${Date.now()}`,
        createdAt: new Date(),
      };

      localStorageService.addPayment(payment);

      // Create invoice
      const invoice: Invoice = {
        id: Math.random().toString(36).substr(2, 9),
        paymentId: payment.id,
        studentId: user.id,
        studentName: user.fullName,
        studentEmail: user.email,
        courseId: course.id,
        courseName: course.title,
        amount: course.price,
        tax: 0,
        total: course.price,
        paidAt: new Date(),
      };

      localStorageService.addInvoice(invoice);

      // Update user's enrolled courses
      const currentUser = localStorageService.getUserById(user.id);
      if (currentUser) {
        const enrolledCourses = (currentUser as any).enrolledCourses || [];
        if (!enrolledCourses.includes(course.id)) {
          const updatedUser = {
            ...currentUser,
            enrolledCourses: [...enrolledCourses, course.id],
          };
          localStorageService.updateUser(user.id, updatedUser);
          localStorageService.setCurrentUser(updatedUser);
          
          // Initialize course progress
          const courseProgress = {
            courseId: course.id,
            completedLessons: [],
            completedQuizzes: [],
            completedAssignments: [],
            progressPercentage: 0,
            lastAccessed: new Date(),
          };
          
          const existingProgress = (currentUser as any).progress || [];
          localStorageService.updateUser(user.id, {
            ...updatedUser,
            progress: [...existingProgress, courseProgress],
          });
        }
      }

      setPaymentSuccess(true);
      toast.success('Payment successful! Course enrolled successfully.');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h2>
          <Link href="/courses">
            <Button variant="primary">Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardBody className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have successfully enrolled in {course.title}. You can now access the course from your dashboard.
              </p>
              <div className="space-y-3">
                <Link href="/student/dashboard">
                  <Button variant="primary" size="lg" fullWidth>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href={`/courses/${course.id}/learn`}>
                  <Button variant="outline" size="lg" fullWidth>
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href={`/courses/${params.id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Secure payment powered by Codivexa
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>
                <div className="flex gap-4 mb-6">
                  <img
                    src={course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg'}
                    alt={course.title}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/images/course-placeholder.svg';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.category} • {course.difficulty}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${course.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">${course.price}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Secure SSL encrypted payment</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                        selectedMethod === method.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        {method.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Payment Form */}
                {selectedMethod === 'credit-card' || selectedMethod === 'debit-card' ? (
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      icon={<CreditCard className="w-5 h-5 text-gray-400" />}
                    />
                    <Input
                      label="Cardholder Name"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="CVV"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : selectedMethod === 'upi' ? (
                  <div className="space-y-4">
                    <Input
                      label="UPI ID"
                      name="upiId"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      icon={<Smartphone className="w-5 h-5 text-gray-400" />}
                    />
                  </div>
                ) : selectedMethod === 'net-banking' ? (
                  <div className="space-y-4">
                    <Input
                      label="Bank Name"
                      name="bankName"
                      placeholder="Select your bank"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      icon={<Building2 className="w-5 h-5 text-gray-400" />}
                    />
                  </div>
                ) : null}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handlePayment}
                  loading={processing}
                  className="mt-6"
                >
                  Pay ${course.price}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Your payment information is secure</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
