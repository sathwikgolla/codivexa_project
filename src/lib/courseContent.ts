import { Course, Lesson, CourseProgress } from '@/types';

const SAMPLE_LESSON_TITLES = [
  'Introduction',
  'Installation',
  'Basics',
  'Intermediate',
  'Advanced',
  'Project',
  'Quiz',
];

const SAMPLE_VIDEO_URLS = [
  'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
  'https://www.youtube.com/watch?v=SqcY0GlETPk',
  'https://www.youtube.com/watch?v=am5iO1l8dL4',
  'https://www.youtube.com/watch?v=Ke90Tje7VS0',
  'https://www.youtube.com/watch?v=2LhoC9j-3VY',
  'https://www.youtube.com/watch?v=0-S5a0eXPoc',
  'https://www.youtube.com/watch?v=3hLmX_PpJww',
];

export const normalizeYouTubeUrl = (value?: string): string => {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split(/[/?]/)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
  }

  if (trimmed.includes('youtube.com/watch?v=')) {
    const videoId = new URL(trimmed).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
  }

  if (trimmed.includes('youtube.com/shorts/')) {
    const videoId = trimmed.split('youtube.com/shorts/')[1]?.split(/[/?]/)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : trimmed;
  }

  return trimmed;
};

export const getLessonVideoUrl = (lesson?: Partial<Lesson> | null): string => {
  return normalizeYouTubeUrl((lesson as any)?.videoUrl || (lesson as any)?.youtubeUrl || '');
};

export const buildSampleLessons = (courseId: string): Lesson[] => {
  return SAMPLE_LESSON_TITLES.map((title, index) => {
    const duration = [600, 900, 1200, 1800, 2400, 3600, 1500][index] ?? 900;
    const description = `${title} lesson for this course. Learn the core concepts and apply them with a practical walkthrough.`;
    const videoUrl = normalizeYouTubeUrl(SAMPLE_VIDEO_URLS[index] || SAMPLE_VIDEO_URLS[0]);

    return {
      id: `lesson-${courseId}-${index + 1}`,
      courseId,
      title,
      description,
      videoUrl,
      youtubeUrl: videoUrl,
      duration,
      order: index + 1,
      resources: [],
      freePreview: index === 0,
      completed: false,
    } as Lesson;
  });
};

export const ensureCourseLessons = (course: Course): Course => {
  const lessons = Array.isArray(course.lessons) && course.lessons.length > 0
    ? course.lessons.map((lesson, index) => ({
        ...lesson,
        id: lesson.id || `lesson-${course.id}-${index + 1}`,
        courseId: lesson.courseId || course.id,
        title: lesson.title || SAMPLE_LESSON_TITLES[index] || `Lesson ${index + 1}`,
        description: lesson.description || `Lesson ${index + 1} for ${course.title}`,
        videoUrl: getLessonVideoUrl(lesson),
        youtubeUrl: lesson.youtubeUrl || getLessonVideoUrl(lesson),
        duration: lesson.duration || 900,
        order: lesson.order || index + 1,
        resources: lesson.resources || [],
        freePreview: lesson.freePreview ?? index === 0,
        completed: lesson.completed ?? false,
      }))
    : buildSampleLessons(course.id);

  const normalizedCourse = {
    ...course,
    lessons,
    lessonsCount: lessons.length,
    duration: course.duration || lessons.reduce((total, lesson) => total + lesson.duration, 0),
    thumbnail: course.thumbnail || course.image || course.coverImage || '/images/course-placeholder.svg',
    image: course.image || course.thumbnail || course.coverImage || '/images/course-placeholder.svg',
    coverImage: course.coverImage || course.thumbnail || course.image || '/images/course-placeholder.svg',
  } as Course;

  return normalizedCourse;
};

export const getCourseProgressSnapshot = (
  progressData: CourseProgress[] | undefined,
  courseId: string,
): CourseProgress | undefined => {
  return progressData?.find((entry) => entry.courseId === courseId);
};

export const buildProgressPayload = ({
  userId,
  courseId,
  completedLessons,
  currentLessonIndex,
  watchPercentage,
  completedQuizzes = [],
  completedAssignments = [],
  totalLessons,
}: {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLessonIndex: number;
  watchPercentage: number;
  completedQuizzes?: string[];
  completedAssignments?: string[];
  totalLessons: number;
}): CourseProgress => {
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const completed = progressPercentage >= 100;

  return {
    studentId: userId,
    courseId,
    completedLessons,
    completedQuizzes,
    completedAssignments,
    currentLessonIndex,
    currentLessonId: completedLessons[currentLessonIndex] || undefined,
    watchPercentage,
    progressPercentage,
    overallProgress: progressPercentage,
    lastAccessed: new Date(),
    timeSpent: 0,
    completed,
  };
};
