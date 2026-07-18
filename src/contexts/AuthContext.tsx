'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { localStorageService } from '@/services/localStorage';
import { initializeDummyData } from '@/data/dummyData';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dummy data on first load
    const users = localStorageService.getUsers();
    if (users.length === 0) {
      initializeDummyData();
    } else {
      // Seed progress fallback if empty
      const progressList = localStorageService.getCourseProgressList();
      if (progressList.length === 0) {
        const students = users.filter(u => u.role === 'student');
        students.forEach((student: any) => {
          student.enrolledCourses?.forEach((courseId: string) => {
            const isCompleted = student.completedCourses?.includes(courseId);
            localStorageService.addCourseProgress({
              studentId: student.id,
              courseId,
              completedLessons: [],
              completedQuizzes: [],
              completedAssignments: [],
              overallProgress: isCompleted ? 100 : Math.floor(Math.random() * 50) + 20,
              lastAccessed: new Date(),
              timeSpent: Math.floor(Math.random() * 300) + 60
            });
          });
        });
      }

      const hasSanjana = users.some(u => u.email === 'sanjanakasarla25092006@gmail.com');
      if (!hasSanjana) {
        const sanjanaAdmin = {
          id: Math.random().toString(36).substr(2, 9),
          fullName: 'Sanjana Kasarla',
          email: 'sanjanakasarla25092006@gmail.com',
          mobile: '+1987654321',
          password: 'admin123',
          role: 'admin' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjana',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        };
        localStorageService.addUser(sanjanaAdmin);
      }

      // Seed Rohan Sharma student profile matching Image 2
      const allCourses = localStorageService.getCourses();
      const hasRohan = users.some(u => u.fullName === 'Rohan Sharma');
      if (!hasRohan && allCourses.length > 0) {
        const rohanStudent = {
          id: 'rohan-sharma-id',
          fullName: 'Rohan Sharma',
          email: 'rohan.sharma@example.com',
          mobile: '+919876543210',
          password: 'password123',
          role: 'student' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
          enrolledCourses: [allCourses[0]?.id || 'course-1', allCourses[2]?.id || 'course-3'],
          completedCourses: [allCourses[2]?.id || 'course-3'],
          certificates: [],
          wishlist: [],
          progress: [],
          createdAt: new Date('2023-11-01'),
          updatedAt: new Date('2023-11-01'),
        };
        localStorageService.addUser(rohanStudent);

        // Seed CourseProgress for Rohan
        localStorageService.addCourseProgress({
          studentId: 'rohan-sharma-id',
          courseId: allCourses[2]?.id || 'course-3',
          completedLessons: [],
          completedQuizzes: [],
          completedAssignments: [],
          overallProgress: 100,
          lastAccessed: new Date(),
          timeSpent: 180
        });

        // Seed Pending Certificate Request matching Image 2 details
        const courseAI = allCourses.find(c => c.title.toLowerCase().includes('machine learning') || c.title.toLowerCase().includes('ai')) || allCourses[2] || allCourses[0];
        const certsList = localStorageService.getCertificates();
        const hasReq = certsList.some(c => c.studentName === 'Rohan Sharma');
        if (!hasReq) {
          const request1 = {
            id: 'cert-req-1',
            studentId: 'rohan-sharma-id',
            studentName: 'Rohan Sharma',
            courseId: courseAI.id,
            courseName: 'AI & MACHINE LEARNING',
            instructorId: courseAI.instructorId,
            instructorName: 'Arjun Mehta',
            completionDate: new Date('2024-05-15'),
            certificateId: 'CVX-2024-ML-05879',
            qrCode: 'QR-05879',
            issuedBy: 'Codivexa Learning Management System',
            status: 'pending' as const
          };
          localStorageService.addCertificate(request1);
        }
      }
    }

    // Check for existing session
    const currentUser = localStorageService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = localStorageService.getUserByEmail(email);
      
      if (!foundUser) {
        toast.error('User not found');
        return false;
      }

      if (foundUser.password !== password) {
        toast.error('Invalid password');
        return false;
      }

      setUser(foundUser);
      localStorageService.setCurrentUser(foundUser);
      toast.success('Login successful');
      return true;
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const existingUser = localStorageService.getUserByEmail(userData.email);
      
      if (existingUser) {
        toast.error('Email already registered');
        return false;
      }

      if (userData.password !== userData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: userData.fullName,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        role: 'student' as const,
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        wishlist: [],
        progress: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorageService.addUser(newUser);
      toast.success('Registration successful');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorageService.setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
