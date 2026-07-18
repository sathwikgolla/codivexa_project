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
