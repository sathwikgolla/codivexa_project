'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, BookOpen, Image as ImageIcon, Video, PlayCircle } from 'lucide-react';
import { Button, Card, CardBody, Input, TextArea, Select } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { localStorageService } from '@/services/localStorage';
import { Course, Lesson, CourseCategory, DifficultyLevel } from '@/types';
import toast from 'react-hot-toast';

export default function CreateCoursePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // Basic Course Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'development' as CourseCategory,
    difficulty: 'beginner' as DifficultyLevel,
    price: '',
    thumbnail: '',
    coverImage: '',
    language: 'English',
  });

  // Dynamic Lists
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>(['']);
  
  // Lessons
  const [lessons, setLessons] = useState<Partial<Lesson>[]>([
    { title: '', description: '', videoUrl: '', duration: 15, freePreview: true }
  ]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'instructor') {
      router.push('/instructor-login');
      return;
    }
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, type: 'req' | 'learn') => {
    if (type === 'req') {
      const newReqs = [...requirements];
      newReqs[index] = value;
      setRequirements(newReqs);
    } else {
      const newLearn = [...whatYouLearn];
      newLearn[index] = value;
      setWhatYouLearn(newLearn);
    }
  };

  const addArrayItem = (type: 'req' | 'learn') => {
    if (type === 'req') setRequirements([...requirements, '']);
    else setWhatYouLearn([...whatYouLearn, '']);
  };

  const removeArrayItem = (index: number, type: 'req' | 'learn') => {
    if (type === 'req') setRequirements(requirements.filter((_, i) => i !== index));
    else setWhatYouLearn(whatYouLearn.filter((_, i) => i !== index));
  };

  const handleLessonChange = (index: number, field: keyof Lesson, value: any) => {
    const newLessons = [...lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setLessons(newLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', description: '', videoUrl: '', duration: 15, freePreview: false }]);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title || !formData.description || !formData.price || !formData.thumbnail) {
      toast.error('Please fill in all required course details.');
      return;
    }

    const cleanedReqs = requirements.filter(r => r.trim() !== '');
    const cleanedLearn = whatYouLearn.filter(l => l.trim() !== '');

    const finalLessons: Lesson[] = lessons.map((l, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      courseId: '', // Will be set after course ID is generated
      title: l.title || `Lesson ${index + 1}`,
      description: l.description || '',
      videoUrl: l.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: Number(l.duration) || 15,
      order: index + 1,
      resources: [],
      freePreview: l.freePreview || false,
    }));

    const courseId = Math.random().toString(36).substr(2, 9);
    finalLessons.forEach(l => l.courseId = courseId);

    const newCourse: Course = {
      id: courseId,
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      coverImage: formData.coverImage || formData.thumbnail,
      instructorId: user.id,
      instructorName: user.fullName,
      category: formData.category,
      difficulty: formData.difficulty,
      price: Number(formData.price),
      duration: finalLessons.reduce((acc, curr) => acc + curr.duration, 0),
      lessonsCount: finalLessons.length,
      rating: 0,
      reviewCount: 0,
      enrolledCount: 0,
      language: formData.language,
      requirements: cleanedReqs,
      whatYouLearn: cleanedLearn,
      lessons: finalLessons,
      quizzes: [],
      assignments: [],
      published: true, // Auto publish for this demo
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorageService.addCourse(newCourse);
    toast.success('Course created and published successfully!');
    router.push('/instructor/dashboard');
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/instructor/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create New Course</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Fill in the details below to publish your new course to the platform.</p>
        </div>
        <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSubmit}>
          Publish Course
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardBody className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input label="Course Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Complete Web Development Bootcamp" required />
              </div>
              <div className="md:col-span-2">
                <TextArea label="Course Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe what students will learn..." rows={4} required />
              </div>
              <Select 
                label="Category" 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                options={[
                  { value: 'development', label: 'Development' },
                  { value: 'design', label: 'Design' },
                  { value: 'business', label: 'Business' },
                  { value: 'data-science', label: 'Data Science' },
                  { value: 'ai-ml', label: 'AI & Machine Learning' }
                ]}
              />
              <Select 
                label="Difficulty Level" 
                name="difficulty" 
                value={formData.difficulty} 
                onChange={handleChange}
                options={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' }
                ]}
              />
              <Input label="Price (USD)" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="99.99" required />
              <Input label="Language" name="language" value={formData.language} onChange={handleChange} placeholder="English" />
            </div>
          </CardBody>
        </Card>

        {/* Media */}
        <Card>
          <CardBody className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-500" />
              Course Media
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <Input label="Thumbnail Image URL" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://example.com/image.jpg" required />
              <Input label="Cover Banner URL (Optional)" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/banner.jpg" />
            </div>
          </CardBody>
        </Card>

        {/* Arrays (Learn & Requirements) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardBody className="p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What Students Will Learn</h2>
              {whatYouLearn.map((item, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <Input value={item} onChange={(e) => handleArrayChange(index, e.target.value, 'learn')} placeholder={`Learning objective ${index + 1}`} className="flex-1" />
                  <Button type="button" variant="ghost" className="text-red-500 px-2" onClick={() => removeArrayItem(index, 'learn')} disabled={whatYouLearn.length === 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('learn')} icon={<Plus className="w-4 h-4" />}>
                Add Objective
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Requirements / Prerequisites</h2>
              {requirements.map((item, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <Input value={item} onChange={(e) => handleArrayChange(index, e.target.value, 'req')} placeholder={`Requirement ${index + 1}`} className="flex-1" />
                  <Button type="button" variant="ghost" className="text-red-500 px-2" onClick={() => removeArrayItem(index, 'req')} disabled={requirements.length === 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('req')} icon={<Plus className="w-4 h-4" />}>
                Add Requirement
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Curriculum / Lessons */}
        <Card>
          <CardBody className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-orange-500" />
                Course Curriculum (Lessons)
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addLesson} icon={<Plus className="w-4 h-4" />}>
                Add Lesson
              </Button>
            </div>
            
            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <div key={index} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] relative">
                  <div className="absolute top-4 right-4">
                    <Button type="button" variant="ghost" className="text-red-500 px-2" onClick={() => removeLesson(index)} disabled={lessons.length === 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-gray-500" /> Lesson {index + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Lesson Title" value={lesson.title || ''} onChange={(e) => handleLessonChange(index, 'title', e.target.value)} placeholder="e.g. Introduction to HTML" required />
                    <Input label="Duration (minutes)" type="number" value={lesson.duration?.toString() || '15'} onChange={(e) => handleLessonChange(index, 'duration', e.target.value)} required />
                    <div className="md:col-span-2">
                      <Input label="Video Embed URL (YouTube)" value={lesson.videoUrl || ''} onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Bottom Submit */}
        <div className="flex justify-end pt-4">
          <Button variant="primary" size="lg" icon={<Save className="w-5 h-5" />} type="submit">
            Publish Course Now
          </Button>
        </div>
      </form>
    </div>
  );
}
