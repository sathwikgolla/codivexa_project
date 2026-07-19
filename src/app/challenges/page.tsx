'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Star, Code2, Clock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { Button, Card, CardBody, Badge } from '@/components/ui';

const MOCK_CHALLENGES = [
  {
    id: 'html-layout',
    title: 'Responsive Flexbox Layout',
    difficulty: 'Easy',
    points: 100,
    timeEstimate: '30 mins',
    tags: ['HTML', 'CSS', 'Flexbox'],
    completed: true,
  },
  {
    id: 'js-array-methods',
    title: 'Data Transformation with Map/Filter',
    difficulty: 'Medium',
    points: 250,
    timeEstimate: '45 mins',
    tags: ['JavaScript', 'Arrays', 'ES6'],
    completed: false,
  },
  {
    id: 'react-hooks-counter',
    title: 'Complex State with useReducer',
    difficulty: 'Hard',
    points: 500,
    timeEstimate: '1.5 hrs',
    tags: ['React', 'Hooks', 'State'],
    completed: false,
  },
];

export default function ChallengesPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 text-white mb-6"
          >
            <Trophy className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4"
          >
            Coding Challenges
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Solve real-world problems, build your portfolio, and earn points to climb the global leaderboard.
          </motion.p>
        </div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        >
          <Card>
            <CardBody className="p-6 flex items-center gap-4">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Points</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 flex items-center gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12 Challenges</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 flex items-center gap-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global Rank</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">#42</p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Challenges List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Weekly Challenges</h2>
          {MOCK_CHALLENGES.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link href={`/challenges/${challenge.id}`}>
                <div className="group block bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500/50 rounded-2xl p-6 transition-all shadow-sm hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${
                        challenge.completed 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {challenge.completed ? <CheckCircle2 className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                            {challenge.title}
                          </h3>
                          <Badge 
                            variant={
                              challenge.difficulty === 'Easy' ? 'success' : 
                              challenge.difficulty === 'Medium' ? 'warning' : 'danger'
                            }
                            size="sm"
                          >
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{challenge.points} pts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{challenge.timeEstimate}</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                            <div className="flex gap-1">
                              {challenge.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end sm:flex-shrink-0">
                      {challenge.completed ? (
                        <Button variant="outline" size="sm">Review Solution</Button>
                      ) : (
                        <Button variant="primary" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                          Start Challenge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
