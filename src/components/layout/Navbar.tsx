'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, BookOpen, GraduationCap, User, LayoutDashboard, LogOut, Award, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Assessment', href: '/assessment' },
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

  const profileLinks = [
    { label: 'Dashboard', href: getDashboardLink(), icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Certificates', href: '/student/certificates', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[color:var(--border)]/80 bg-[color:var(--card)]/80 backdrop-blur-xl shadow-[var(--shadow)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
  <Image
    src="/logo.jpg"
    alt="Codivexa Logo"
    width={80}
    height={80}
    className="rounded-lg"
  />

</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium text-[color:var(--foreground)]/80 transition-colors hover:text-[color:var(--primary)]"
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
              className="rounded-lg p-2 text-[color:var(--foreground)]/80 transition-colors hover:bg-[color:var(--muted)]"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="relative flex items-center space-x-3">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/80 px-2 py-1.5"
                  >
                    <Avatar src={user?.avatar} alt={user?.fullName} size="sm" />
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Student'}</p>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-14 w-56 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-2 shadow-xl"
                      >
                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/60">
                          <p className="text-sm font-semibold text-[color:var(--foreground)]">{user?.fullName || 'User'}</p>
                          <p className="text-xs text-[color:var(--foreground)]/70">{user?.email}</p>
                        </div>
                        <div className="mt-2 space-y-1">
                          {profileLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" onClick={() => setIsProfileOpen(false)}>
                              {link.icon}
                              {link.label}
                            </Link>
                          ))}
                          <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            className="rounded-lg p-2 text-[color:var(--foreground)]/80 transition-colors hover:bg-[color:var(--muted)] md:hidden"
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
          className="border-t border-[color:var(--border)] bg-[color:var(--card)] md:hidden"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 font-medium text-[color:var(--foreground)]/80 transition-colors hover:text-[color:var(--primary)]"
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
