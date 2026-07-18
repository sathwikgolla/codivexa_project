'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Star, Users, Clock, BookOpen, Award, CheckCircle, 
  Play, Heart, Share2, ArrowLeft, ChevronRight 
} from 'lucide-react';
import { Button, Card, CardBody, Badge, Avatar, ProgressBar } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course, Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const courseId = params.id as string;
    const foundCourse = localStorageService.getCourseById(courseId);
    setCourse(foundCourse || null);
    setLoading(false);
  }, [params.id]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in this course');
      router.push('/login');
      return;
    }

    if (user?.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    router.push(`/courses/${params.id}/payment`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add courses to wishlist');
      router.push('/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
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

  const discount = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="success">{course.category}</Badge>
            <Badge variant="info">{course.difficulty}</Badge>
            {discount > 0 && <Badge variant="danger">{discount}% OFF</Badge>}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {course.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">{course.rating}</span>
              <span>({course.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{course.enrolledCount} students enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{Math.floor(course.duration / 60)} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{course.lessonsCount} lessons</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Preview */}
            <Card>
              <CardBody className="p-0">
                <div className="relative aspect-video bg-gray-900 rounded-t-xl overflow-hidden">
                  <img
                    src={course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg'}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      e.currentTarget.src = '/images/course-placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={<Play className="w-6 h-6" />}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      Preview Course
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Course Content */}
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Course Content
                </h2>
                <div className="space-y-3">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                            </p>
                          </div>
                        </div>
                        {lesson.freePreview && (
                          <Badge variant="info" size="sm">Free Preview</Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      Course content will be available after enrollment.
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Requirements */}
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            {/* Instructor */}
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Instructor
                </h2>
                <div className="flex items-center gap-4">
                  <Avatar fallback={course.instructorName} alt={course.instructorName} size="xl" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {course.instructorName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">Expert Instructor</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardBody className="p-6">
                {/* Price */}
                <div className="mb-6">
                  {course.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${course.price}
                  </div>
                  {discount > 0 && (
                    <Badge variant="danger" className="mt-2">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    icon={<Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />}
                    onClick={handleWishlist}
                  >
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    icon={<Share2 className="w-5 h-5" />}
                  >
                    Share
                  </Button>
                </div>

                {/* Course Info */}
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Duration</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.floor(course.duration / 60)} hours
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Lessons</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {course.lessonsCount} lessons
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Students</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {course.enrolledCount} enrolled
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Certificate</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Yes, upon completion
                      </div>
                    </div>
                  </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">30-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
