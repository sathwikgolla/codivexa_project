import { localStorageService } from '@/services/localStorage';
import { CourseProgress } from '@/types';

export const getUserCourseProgress = (userId: string, courseId: string): CourseProgress | undefined => {
  const currentUser = localStorageService.getUserById(userId) as any;
  return (currentUser?.progress || []).find((entry: CourseProgress) => entry.courseId === courseId);
};

export const syncUserProgress = (userId: string, courseId: string, partial: Partial<CourseProgress>) => {
  const currentUser = localStorageService.getUserById(userId) as any;
  const progressEntries = (currentUser?.progress || []) as CourseProgress[];
  const existingIndex = progressEntries.findIndex((entry) => entry.courseId === courseId);

  const baseEntry: CourseProgress = {
    studentId: userId,
    courseId,
    completedLessons: [],
    completedQuizzes: [],
    completedAssignments: [],
    overallProgress: 0,
    lastAccessed: new Date(),
    timeSpent: 0,
  };

  const nextEntry: CourseProgress = {
    ...baseEntry,
    ...progressEntries[existingIndex],
    ...partial,
    studentId: userId,
    courseId,
  };

  if (existingIndex >= 0) {
    progressEntries[existingIndex] = nextEntry;
  } else {
    progressEntries.push(nextEntry);
  }

  const updatedUser = {
    ...currentUser,
    progress: progressEntries,
  };

  localStorageService.updateUser(userId, updatedUser as any);
  localStorageService.setCurrentUser(updatedUser as any);
};
