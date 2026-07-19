'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, CheckCircle, Clock,
  BookOpen, FileText, Download, MessageSquare, Bookmark,
  ChevronRight, List, Volume2, Settings, Maximize2, Award, Trophy
} from 'lucide-react';
import { Button, Card, CardBody, Badge, ProgressBar, AIChat } from '@/components/ui';
import { localStorageService } from '@/services/localStorage';
import { Course, Lesson, CourseProgress } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ensureCourseLessons, getLessonVideoUrl, buildProgressPayload } from '@/lib/courseContent';
import toast from 'react-hot-toast';

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookmarks, setBookmarks] = useState<{id: number, time: string, note: string}[]>([
    { id: 1, time: '02:15', note: 'Important explanation of React Hooks' }
  ]);
  const [ideCode, setIdeCode] = useState('console.log("Hello Codivexa!");');
  const [ideOutput, setIdeOutput] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const courseId = params.id as string;
    const foundCourse = localStorageService.getCourseById(courseId);

    if (!foundCourse) {
      router.push('/courses');
      return;
    }

    const normalizedCourse = ensureCourseLessons(foundCourse);

    if (!(user as any).enrolledCourses?.includes(courseId)) {
      router.push(`/courses/${courseId}`);
      return;
    }

    const userProgress = (user as any).progress || [];
    const courseProgress = userProgress.find((p: any) => p.courseId === courseId);
    const completedLessonsData = courseProgress?.completedLessons || [];
    const savedLessonIndex = Number(courseProgress?.currentLessonIndex ?? 0);

    setCompletedLessons(completedLessonsData);
    setCourse(normalizedCourse);
    setCurrentLessonIndex(Math.min(savedLessonIndex, normalizedCourse.lessons.length - 1));
    setLoading(false);

    if (completedLessonsData.length > 0 && completedLessonsData.length < normalizedCourse.lessons.length) {
      const firstIncompleteIndex = normalizedCourse.lessons.findIndex(
        lesson => !completedLessonsData.includes(lesson.id)
      );
      if (firstIncompleteIndex !== -1) {
        setCurrentLessonIndex(firstIncompleteIndex);
      }
    }
  }, [isAuthenticated, user, params.id, router]);

  const persistProgress = (nextCompletedLessons: string[], nextLessonIndex: number, nextWatchPercentage: number) => {
    if (!course || !user) return;

    const existingProgress = (user as any).progress || [];
    const courseProgressIndex = existingProgress.findIndex((p: any) => p.courseId === course.id);
    const payload = buildProgressPayload({
      userId: user.id,
      courseId: course.id,
      completedLessons: nextCompletedLessons,
      currentLessonIndex: nextLessonIndex,
      watchPercentage: nextWatchPercentage,
      completedQuizzes: [],
      completedAssignments: [],
      totalLessons: course.lessons.length,
    });

    const updatedProgress = [...existingProgress];
    if (courseProgressIndex >= 0) {
      updatedProgress[courseProgressIndex] = payload;
    } else {
      updatedProgress.push(payload);
    }

    const updatedUser = {
      ...user,
      progress: updatedProgress,
    } as any;

    localStorageService.updateUser(user.id, updatedUser);
    localStorageService.setCurrentUser(updatedUser);
    setCompletedLessons(nextCompletedLessons);
  };

  const handleLessonClick = (index: number) => {
    if (!isLessonUnlocked(index)) {
      toast.error('Complete the previous lesson to unlock this one');
      return;
    }
    setCurrentLessonIndex(index);
    persistProgress(completedLessons, index, Math.round((completedLessons.length / course!.lessons.length) * 100));
  };

  const handleMarkComplete = () => {
    if (!course || !user) return;

    const lessonId = course.lessons[currentLessonIndex]?.id;
    if (lessonId && !completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      const nextProgress = Math.round((newCompletedLessons.length / course.lessons.length) * 100);
      persistProgress(newCompletedLessons, currentLessonIndex, nextProgress);

      if (nextProgress >= 100) {
        setShowCelebration(true);
        toast.success('🎉 All lessons completed! Take the final quiz to earn your certificate.');
      } else {
        toast.success('Lesson marked as complete!');
      }
    }
  };

  const handleNextLesson = () => {
    if (course && currentLessonIndex < course.lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextIndex);
      const nextProgress = Math.round((completedLessons.length / course.lessons.length) * 100);
      persistProgress(completedLessons, nextIndex, nextProgress);
    }
  };

  const handlePreviousLesson = () => {
    if (!course) return;

    if (currentLessonIndex > 0) {
      const previousIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(previousIndex);
      const nextProgress = Math.round((completedLessons.length / course.lessons.length) * 100);
      persistProgress(completedLessons, previousIndex, nextProgress);
    }
  };

  // Early returns after all hooks are called
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
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

  // Calculate derived values (safe to access course here since we've checked it exists)
  const currentLesson = course.lessons[currentLessonIndex];
  const progress = course.lessons.length > 0 
    ? Math.round((completedLessons.length / course.lessons.length) * 100) 
    : 0;

  // Check if lesson is unlocked (previous lesson must be completed)
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true; // First lesson is always unlocked
    const previousLessonId = course.lessons[index - 1]?.id;
    if (!previousLessonId) return false;
    return completedLessons.includes(previousLessonId);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-900">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {currentLesson?.videoUrl ? (
              <div className="relative w-full h-full">
                <iframe
                  src={getLessonVideoUrl(currentLesson)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLesson.title}
                />
                <a
                  href={getLessonVideoUrl(currentLesson).replace('embed/', 'watch?v=')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Open on YouTube
                </a>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white/80">Video Player Placeholder</p>
                  <p className="text-white/60 text-sm mt-2">
                    {currentLesson?.title || 'Select a lesson to begin'}
                  </p>
                </div>
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <ProgressBar value={progress} color="blue" showLabel size="sm" className="mb-4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-white/80"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<SkipBack className="w-5 h-5" />}
                    onClick={handlePreviousLesson}
                    className="text-white hover:text-white/80"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<SkipForward className="w-5 h-5" />}
                    onClick={handleNextLesson}
                    className="text-white hover:text-white/80"
                  />
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-white" />
                    <div className="w-24 h-1 bg-white/30 rounded-full">
                      <div className="w-1/2 h-full bg-white rounded-full" />
                    </div>
                  </div>
                  <span className="text-white text-sm">
                    {currentLesson ? `${Math.floor(currentLesson.duration / 60)}:${(currentLesson.duration % 60).toString().padStart(2, '0')}` : '0:00'} / {Math.floor(course.duration / 60)}:00
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Settings className="w-5 h-5" />}
                    className="text-white hover:text-white/80"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Maximize2 className="w-5 h-5" />}
                    className="text-white hover:text-white/80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="p-6 bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {currentLesson?.title || 'No lesson selected'}
                </h1>
                <p className="text-gray-400">
                  {currentLesson?.description || 'Select a lesson from the playlist'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  icon={<Bookmark className="w-4 h-4" />}
                  className="border-gray-600 text-white hover:bg-gray-700"
                  onClick={() => {
                    const newBookmark = {
                      id: Date.now(),
                      time: `0${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                      note: 'New bookmark added at current timestamp'
                    };
                    setBookmarks(prev => [...prev, newBookmark]);
                    setActiveTab('bookmarks');
                    toast.success('Bookmark added at current time');
                  }}
                >
                  Bookmark
                </Button>
                <Button
                  variant="primary"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={handleMarkComplete}
                  disabled={!currentLesson || completedLessons.includes(currentLesson.id)}
                >
                  {completedLessons.includes(currentLesson?.id) ? 'Completed' : 'Mark Complete'}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-4">
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'border-blue-500 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'notes' 
                      ? 'border-blue-500 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Notes
                </button>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'resources' 
                      ? 'border-blue-500 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Resources
                </button>
                <button 
                  onClick={() => setActiveTab('bookmarks')}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'bookmarks' 
                      ? 'border-orange-500 text-orange-400' 
                      : 'border-transparent text-gray-400 hover:text-orange-400'
                  }`}
                >
                  Bookmarks
                </button>
                <button 
                  onClick={() => setActiveTab('discussion')}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'discussion' 
                      ? 'border-blue-500 text-white' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Discussion
                </button>
                <button 
                  onClick={() => setActiveTab('editor')}
                  className={`pb-2 border-b-2 font-medium transition-colors ${
                    activeTab === 'editor' 
                      ? 'border-green-500 text-green-400' 
                      : 'border-transparent text-gray-400 hover:text-green-400'
                  }`}
                >
                  Code Editor
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="text-gray-300">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Course Overview</h4>
                    <p className="text-sm">{course.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Instructor</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {course.instructorName?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{course.instructorName}</p>
                        <p className="text-sm text-gray-400">Expert Instructor</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">What You'll Learn</h4>
                    <ul className="space-y-2">
                      {course.whatYouLearn?.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {course.requirements?.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500"
                    rows={8}
                    placeholder="Take notes for this lesson..."
                  />
                  <Button variant="primary" size="sm">
                    Save Notes
                  </Button>
                </div>
              )}
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Downloadable Resources</h3>
                  {currentLesson?.resources ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {currentLesson.resources.map((resource, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium text-white">{resource.title}</span>
                          </div>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <Download className="w-4 h-4 text-gray-400 hover:text-white" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                      <p className="text-gray-400">No resources available for this lesson.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Video Bookmarks</h3>
                    <Badge variant="warning">{bookmarks.length} saved</Badge>
                  </div>
                  {bookmarks.length > 0 ? (
                    <div className="space-y-3">
                      {bookmarks.map((bm) => (
                        <div key={bm.id} className="flex gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center justify-center bg-gray-900 px-3 py-1 rounded text-orange-400 font-mono text-sm shrink-0">
                            <Play className="w-3 h-3 mb-1" />
                            {bm.time}
                          </div>
                          <div>
                            <p className="text-gray-200 text-sm">{bm.note}</p>
                            <p className="text-xs text-gray-500 mt-1">Click to jump to timestamp</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                      <Bookmark className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">You haven't added any bookmarks yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Click the Bookmark button to save a timestamp.</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'discussion' && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex flex-shrink-0 items-center justify-center text-white font-medium">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        placeholder="Add to the discussion..."
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button variant="primary" size="sm">Post Comment</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to start the discussion!</p>
                  </div>
                </div>
              )}

              {activeTab === 'editor' && (
                <div className="space-y-4 bg-[#1e1e1e] p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2">
                      <Badge variant="success">JavaScript</Badge>
                      <span className="text-gray-400 text-sm">Interactive Workspace</span>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon={<Play className="w-4 h-4" />}
                      onClick={() => {
                        try {
                          // Simple safe eval for demonstration
                          const log: string[] = [];
                          const originalLog = console.log;
                          console.log = (...args) => {
                            log.push(args.join(' '));
                          };
                          // eslint-disable-next-line no-eval
                          eval(ideCode);
                          console.log = originalLog;
                          setIdeOutput(log.join('\n') || 'Executed successfully (no output)');
                        } catch (e: any) {
                          setIdeOutput(`Error: ${e.message}`);
                        }
                      }}
                    >
                      Run Code
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      className="w-full h-48 bg-[#0a0a0a] text-green-400 font-mono p-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                      value={ideCode}
                      onChange={(e) => setIdeCode(e.target.value)}
                      spellCheck={false}
                    />
                    <div className="w-full h-48 bg-black text-gray-300 font-mono p-4 rounded-lg overflow-y-auto">
                      <div className="text-gray-500 text-xs mb-2 border-b border-gray-800 pb-1">CONSOLE OUTPUT</div>
                      <pre className="whitespace-pre-wrap">{ideOutput}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Playlist */}
        <div className={`w-full lg:w-96 bg-gray-800 border-l border-gray-700 ${showPlaylist ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Course Content</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={<List className="w-5 h-5" />}
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-white lg:hidden"
            />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">
                {completedLessons.length} of {course.lessons.length} completed
              </span>
              <ProgressBar value={progress} color="blue" size="sm" />
            </div>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {course.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = index === currentLessonIndex;
                const isUnlocked = isLessonUnlocked(index);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-blue-600/20 border-2 border-blue-600'
                        : isUnlocked
                        ? 'bg-gray-700/50 hover:bg-gray-700 border border-transparent hover:border-gray-600'
                        : 'bg-gray-800/50 border border-gray-700 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-600'
                          : isCurrent
                          ? 'bg-blue-600'
                          : isUnlocked
                          ? 'bg-gray-600'
                          : 'bg-gray-700'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : !isUnlocked ? (
                          <span className="text-gray-400 text-lg">🔒</span>
                        ) : isCurrent ? (
                          <Play className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm mb-1 ${
                          isCurrent ? 'text-white' : isUnlocked ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className={`text-xs mb-2 line-clamp-2 ${
                          isCurrent ? 'text-gray-300' : isUnlocked ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s</span>
                          </div>
                          {lesson.freePreview && (
                            <Badge variant="info" size="sm">Free</Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="success" size="sm">Completed</Badge>
                          )}
                        </div>
                      </div>
                      {isCurrent && (
                        <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Playlist Toggle */}
      <button
        onClick={() => setShowPlaylist(!showPlaylist)}
        className="lg:hidden fixed bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-50"
      >
        <List className="w-6 h-6 text-white" />
      </button>

      {/* Celebration Modal */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCelebration(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Congratulations! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You have successfully completed all lessons in this course!
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  setShowCelebration(false);
                  setShowQuiz(true);
                }}
              >
                Take Final Quiz
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setShowCelebration(false)}
              >
                Review Lessons
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQuiz(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Final Assessment
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon={<List className="w-5 h-5" />}
                onClick={() => setShowQuiz(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Answer the following questions to complete the course. You need to score at least 70% to pass.
                </p>
              </div>

              {/* Sample Quiz Questions */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    1. What is the main concept covered in this course?
                  </h3>
                  <div className="space-y-2">
                    {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => (
                      <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="q1" value={option} className="w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    2. Which of the following best describes the course topic?
                  </h3>
                  <div className="space-y-2">
                    {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => (
                      <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="q2" value={option} className="w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
                  setQuizScore(score);
                  setShowQuiz(false);
                  if (score >= 70) {
                    setShowAssignment(true);
                    toast.success(`Quiz passed! Score: ${score}%`);
                  } else {
                    toast.error(`Quiz failed. Score: ${score}%. Please try again.`);
                  }
                }}
              >
                Submit Quiz
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Assignment Modal */}
      {showAssignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAssignment(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Course Assignment
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon={<List className="w-5 h-5" />}
                onClick={() => setShowAssignment(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Great job on the quiz! Complete this assignment to earn your certificate.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assignment Description
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    Apply what you've learned in this course by completing the following task. 
                    Submit your code, files, or written response below.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={6}
                    placeholder="Enter your solution or explanation here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Files (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop files here or click to upload
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  setAssignmentSubmitted(true);
                  setShowAssignment(false);
                  toast.success('Assignment submitted successfully!');
                  
                  // Generate certificate after assignment submission
                  if (course && user) {
                    const certificate = {
                      id: Math.random().toString(36).substr(2, 9),
                      studentId: user.id,
                      studentName: user.fullName,
                      courseId: course.id,
                      courseName: course.title,
                      instructorId: course.instructorId,
                      instructorName: course.instructorName,
                      completionDate: new Date(),
                      certificateId: `CERT-${Date.now()}-${user.id.substr(0, 4).toUpperCase()}`,
                      qrCode: `https://codivexa.com/verify/${Math.random().toString(36).substr(2, 9)}`,
                      issuedBy: 'Codivexa LMS',
                    };
                    
                    localStorageService.addCertificate(certificate);
                    
                    // Update user's completed courses
                    const currentUser = localStorageService.getUserById(user.id);
                    if (currentUser) {
                      const completedCourses = (currentUser as any).completedCourses || [];
                      if (!completedCourses.includes(course.id)) {
                        const updatedUserWithCompleted = {
                          ...currentUser,
                          completedCourses: [...completedCourses, course.id],
                        };
                        localStorageService.updateUser(user.id, updatedUserWithCompleted as any);
                        localStorageService.setCurrentUser(updatedUserWithCompleted as any);
                      }
                    }
                    
                    toast.success('🎉 Certificate generated! Check your certificates.');
                  }
                }}
              >
                Submit Assignment
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating AI Chat Assistant */}
      <AIChat />
    </div>
  );
}
