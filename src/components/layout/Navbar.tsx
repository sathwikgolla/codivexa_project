'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, BookOpen, GraduationCap, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, Logo } from '@/components/ui';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/admin-login')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Workspace', href: '/ide' },
    { name: 'Community', href: '/community' },
    { name: 'Challenges', href: '/challenges' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl dark:bg-black/50 border-b border-gray-200/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'student' && (
                  <div className="flex items-center space-x-3 mr-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-500/30 shadow-sm cursor-help" title="Daily Streak & Points">
                    <div className="flex items-center text-orange-600 dark:text-orange-400 font-bold text-sm">
                      <motion.span 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }} 
                        className="mr-1 inline-block"
                      >🔥</motion.span> {(user as any).streak || 2}
                    </div>
                    <div className="w-px h-4 bg-orange-300 dark:bg-orange-500/50"></div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      <span className="mr-1">⭐</span> {(user as any).points || 350}
                    </div>
                  </div>
                )}
                <Link href={getDashboardLink()}>
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500/20 transition-colors cursor-pointer">
                    <User className="w-5 h-5" />
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="sm" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full mt-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" size="sm" fullWidth>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
