'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Medal, Flame } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

const LEADERBOARD_DATA = [
  { id: 1, name: 'Alex Johnson', points: 14500, streak: 45, badges: 12, rank: 1, avatar: 'bg-orange-500' },
  { id: 2, name: 'Sarah Chen', points: 13200, streak: 30, badges: 9, rank: 2, avatar: 'bg-blue-500' },
  { id: 3, name: 'Michael Smith', points: 12100, streak: 21, badges: 8, rank: 3, avatar: 'bg-green-500' },
  { id: 4, name: 'Emily Davis', points: 10500, streak: 15, badges: 6, rank: 4, avatar: 'bg-purple-500' },
  { id: 5, name: 'David Wilson', points: 9800, streak: 12, badges: 5, rank: 5, avatar: 'bg-pink-500' },
  { id: 6, name: 'Jessica Brown', points: 8400, streak: 7, badges: 4, rank: 6, avatar: 'bg-indigo-500' },
  { id: 7, name: 'Daniel Taylor', points: 7900, streak: 5, badges: 3, rank: 7, avatar: 'bg-red-500' },
];

export default function LeaderboardPage() {
  const topThree = LEADERBOARD_DATA.slice(0, 3);
  const rest = LEADERBOARD_DATA.slice(3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full mb-4"
          >
            <Trophy className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4"
          >
            Global Leaderboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Compete with students worldwide. Earn points through courses, challenges, and helping others in the community.
          </motion.p>
        </div>

        {/* Podium for Top 3 */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-12 md:gap-4 mb-16 mt-8 md:mt-12 md:h-[320px]">
          {/* Rank 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-64 flex flex-col items-center order-2 md:order-1"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-gray-100 dark:border-gray-800 z-10 relative">
                {topThree[1].name.charAt(0)}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-900 z-20">
                2
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{topThree[1].name}</h3>
              <p className="text-blue-500 font-semibold">{topThree[1].points.toLocaleString()} pts</p>
            </div>
            <div className="w-full h-32 bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-t-xl border-t border-l border-r border-gray-300 dark:border-gray-700 flex items-start justify-center pt-4">
              <Medal className="w-8 h-8 text-gray-400" />
            </div>
          </motion.div>

          {/* Rank 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-72 flex flex-col items-center order-1 md:order-2"
          >
            <div className="relative mb-4">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 z-30">
                <Medal className="w-8 h-8 drop-shadow-md" />
              </div>
              <div className="w-28 h-28 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold shadow-xl shadow-orange-500/20 border-4 border-yellow-400 z-10 relative">
                {topThree[0].name.charAt(0)}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl border-2 border-white dark:border-gray-900 z-20">
                1
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">{topThree[0].name}</h3>
              <p className="text-orange-500 font-bold text-lg">{topThree[0].points.toLocaleString()} pts</p>
            </div>
            <div className="w-full h-44 bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-900/20 rounded-t-2xl border-t border-l border-r border-yellow-300 dark:border-yellow-700/50 flex items-start justify-center pt-6">
              <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
            </div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-64 flex flex-col items-center order-3"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-gray-100 dark:border-gray-800 z-10 relative">
                {topThree[2].name.charAt(0)}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-amber-700 dark:bg-amber-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-900 z-20">
                3
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{topThree[2].name}</h3>
              <p className="text-green-500 font-semibold">{topThree[2].points.toLocaleString()} pts</p>
            </div>
            <div className="w-full h-24 bg-gradient-to-t from-amber-900/10 to-amber-900/5 dark:from-amber-900/30 dark:to-amber-900/10 rounded-t-xl border-t border-l border-r border-amber-200 dark:border-amber-900/50 flex items-start justify-center pt-3">
              <Medal className="w-7 h-7 text-amber-700" />
            </div>
          </motion.div>
        </div>

        {/* List for Rank 4+ */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold text-center">Streak</th>
                  <th className="px-6 py-4 font-semibold text-center">Badges</th>
                  <th className="px-6 py-4 font-semibold text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rest.map((student, i) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-semibold text-lg">#{student.rank}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${student.avatar}`}>
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 text-orange-500 font-medium">
                        <Flame className="w-4 h-4" />
                        {student.streak}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {student.badges}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900 dark:text-white">{student.points.toLocaleString()}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
