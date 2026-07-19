'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Star, Users, Clock, Heart, ChevronDown } from 'lucide-react';
import { Button, Card, CardBody, Badge, Avatar, Input, Select } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course, CourseCategory, DifficultyLevel, CourseFilters } from '@/types';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  const [filters, setFilters] = useState<CourseFilters>({
    category: undefined,
    difficulty: undefined,
    search: '',
    sortBy: 'popular',
  });

  const categories: { value: CourseCategory; label: string }[] = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI & ML' },
    { value: 'devops', label: 'DevOps' },
    { value: 'other', label: 'Other' },
  ];

  const difficulties: { value: DifficultyLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    const allCourses = localStorageService.getCourses();
    setCourses(allCourses);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          course.instructorName.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filters.difficulty);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [filters, courses]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: undefined,
      difficulty: undefined,
      search: '',
      sortBy: 'popular',
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover {filteredCourses.length} courses to enhance your skills
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                icon={<Search className="w-5 h-5 text-gray-400" />}
                placeholder="Search courses, instructors, or topics..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<SlidersHorizontal className="w-5 h-5" />}
            >
              Filters
              {showFilters && <ChevronDown className="w-4 h-4 ml-2 rotate-180" />}
            </Button>

            {/* Sort */}
            <Select
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full lg:w-48"
            />
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    options={[{ value: '', label: 'All Categories' }, ...categories]}
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  />
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <Select
                    options={[{ value: '', label: 'All Levels' }, ...difficulties]}
                    value={filters.difficulty || ''}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : currentCourses.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="h-full overflow-hidden">
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
                      <Badge variant="info" className="absolute top-4 right-4">
                        {course.difficulty}
                      </Badge>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <Badge variant="danger" className="absolute bottom-4 right-4">
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardBody className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar alt={course.instructorName} size="sm" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{course.instructorName}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
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
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">${course.price}</span>
                          {course.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" icon={<Heart className="w-4 h-4" />} />
                          <Link href={`/courses/${course.id}`}>
                            <Button variant="primary" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'primary' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                    size="sm"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
