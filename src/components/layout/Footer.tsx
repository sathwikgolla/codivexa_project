'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/' },
      { name: 'Courses', href: '/courses' },
      { name: 'Contact', href: '/' },
    ],
    resources: [
      { name: 'Courses', href: '/courses' },
      { name: 'Assessment', href: '/assessment' },
      { name: 'Dashboard', href: '/student/dashboard' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/' },
      { name: 'Terms of Service', href: '/' },
    ],
    support: [
      { name: 'Help Center', href: '/' },
      { name: 'Contact Us', href: '/' },
      { name: 'FAQ', href: '/' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'GitHub', href: '#' },
  ];

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[color:var(--foreground)]">Codivexa</span>
            </div>
            <p className="mb-6 text-[color:var(--foreground)]/70">
              Empowering learners worldwide with premium education. Master new skills with expert-led courses and hands-on projects.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-sm">support@codivexa.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 font-semibold capitalize text-[color:var(--foreground)]">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--foreground)]/70 transition-colors hover:text-[color:var(--primary)]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-[color:var(--border)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 text-sm text-[color:var(--foreground)]/70 md:mb-0">
              © {currentYear} Codivexa. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
