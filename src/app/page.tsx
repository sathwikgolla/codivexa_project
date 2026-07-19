'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Clock, CheckCircle, Star, Play, ChevronRight } from 'lucide-react';
import { Button, Card, CardBody, Badge, Avatar } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course } from '@/types';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allCourses = localStorageService.getCourses();
    setCourses(allCourses.slice(0, 6));
    setLoading(false);
  }, []);

  const benefits = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry experts with real-world experience and proven track records.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Support',
      description: 'Join a thriving community of learners and get help whenever you need it.',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Certified Learning',
      description: 'Earn recognized certificates to showcase your skills to employers.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Learn at Your Pace',
      description: 'Access courses 24/7 and learn at your own schedule from anywhere.',
    },
  ];

  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
      comment: 'Codivexa transformed my career. The courses are comprehensive and the instructors are amazing!',
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      rating: 5,
      comment: 'Best platform for learning data science. The practical projects helped me land my dream job.',
    },
    {
      name: 'Emily Davis',
      role: 'UI/UX Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 4,
      comment: 'Great content and excellent support. The design courses are top-notch!',
    },
  ];

  const faqs = [
    {
      question: 'How do I access the courses?',
      answer: 'After enrolling in a course, you can access it immediately from your dashboard. Courses are available 24/7.',
    },
    {
      question: 'Do I get a certificate upon completion?',
      answer: 'Yes! Upon successful completion of a course, you will receive a verified certificate that you can share with employers.',
    },
    {
      question: 'Can I download the course videos?',
      answer: 'Yes, most courses allow you to download videos for offline viewing. Check individual course details.',
    },
    {
      question: 'What if I\'m not satisfied with a course?',
      answer: 'We offer a 30-day money-back guarantee on all courses. If you\'re not satisfied, we\'ll refund your payment.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden px-4 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_35%),linear-gradient(135deg,_var(--background)_0%,_var(--muted)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_transparent_45%,_rgba(15,23,42,0.08)_100%)] dark:bg-[radial-gradient(circle_at_center,_transparent_0%,_transparent_45%,_rgba(248,250,252,0.08)_100%)]" />
        <div className="absolute left-10 top-40 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-orange-400/15 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <div className="relative h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] rounded-full">
            <Image
              src="/logo.jpg"
              alt="Codivexa Logo"
              fill
              priority
              className="scale-150 select-none object-contain opacity-[0.07] blur-3xl dark:opacity-[0.11]"
              style={{ animation: 'heroLogoFloat 24s ease-in-out infinite' }}
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="info" className="mb-4">
              🎓 Start Learning Today
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-[color:var(--primary)] via-orange-500 to-blue-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Master New Skills with Codivexa
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-[color:var(--foreground)]/75 md:text-2xl">
              Join thousands of learners worldwide. Access premium courses, learn from experts, and accelerate your career.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/courses">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Browse Courses
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              { label: 'Students', value: '50K+' },
              { label: 'Courses', value: '500+' },
              { label: 'Instructors', value: '100+' },
              { label: 'Certificates', value: '25K+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/80 px-4 py-6 text-center shadow-[var(--shadow)]">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-[color:var(--foreground)]/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Courses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Explore our most popular courses</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full overflow-hidden border-[color:var(--border)] bg-[color:var(--card)]">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg'}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/images/course-placeholder.svg';
                        }}
                      />
                      <Badge variant="success" className="absolute top-4 left-4">
                        {course.category}
                      </Badge>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <Badge variant="danger" className="absolute top-4 right-4">
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardBody className="p-6">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-[color:var(--foreground)]">
                        {course.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-[color:var(--foreground)]/70">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar alt={course.instructorName} size="sm" />
                        <span className="text-sm text-[color:var(--foreground)]/70">{course.instructorName}</span>
                      </div>
                      <div className="mb-4 flex items-center gap-4 text-sm text-[color:var(--foreground)]/70">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.enrolledCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(course.duration / 60)}h</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-[color:var(--foreground)]">${course.price}</span>
                          {course.originalPrice && (
                            <span className="ml-2 text-sm text-[color:var(--foreground)]/60 line-through">${course.originalPrice}</span>
                          )}
                        </div>
                        <Link href={`/courses/${course.id}`}>
                          <Button variant="primary" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose Codivexa?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Experience the future of online learning</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card glassmorphism className="h-full">
                  <CardBody className="p-8 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 text-white mb-4 shadow-lg shadow-orange-500/30">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Reviews */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">What Our Students Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Join thousands of satisfied learners</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar src={review.avatar} alt={review.name} size="lg" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Got questions? We've got answers</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardBody className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 ml-7">{faq.answer}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Start Learning?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join Codivexa today and transform your career with our expert-led courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button variant="secondary" size="lg" icon={<Play className="w-5 h-5" />}>
                  Register Now
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
