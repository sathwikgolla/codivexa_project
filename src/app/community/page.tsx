'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Search, Send, User, Bell, Settings, HelpCircle, Users, Image as ImageIcon, Smile } from 'lucide-react';
import { Button } from '@/components/ui';

const MOCK_CHANNELS = [
  { id: 'general', name: 'general', unread: 0 },
  { id: 'help', name: 'help-and-questions', unread: 3 },
  { id: 'showcase', name: 'project-showcase', unread: 0 },
  { id: 'announcements', name: 'announcements', unread: 1 },
];

const MOCK_MESSAGES = [
  { id: 1, user: 'Alex', avatar: 'bg-orange-500', time: '10:30 AM', content: 'Hey everyone! Just finished the React hooks module, it was amazing.' },
  { id: 2, user: 'Sarah', avatar: 'bg-blue-500', time: '10:32 AM', content: 'That module was great! Are you working on the final project now?' },
  { id: 3, user: 'Instructor Bob', avatar: 'bg-green-500', time: '10:35 AM', content: 'Great job Alex! Let me know if you need any help with the project.', isInstructor: true },
  { id: 4, user: 'Alex', avatar: 'bg-orange-500', time: '10:36 AM', content: 'Will do, thanks Bob! 👍' },
];

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      user: 'You',
      avatar: 'bg-purple-500',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: input,
    };
    
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen pt-16 flex bg-white dark:bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Codivexa Community</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Channels</p>
          </div>
          <div className="space-y-0.5">
            {MOCK_CHANNELS.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                  activeChannel === channel.id
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 opacity-70" />
                  {channel.name}
                </div>
                {channel.unread > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
              Y
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">You</p>
              <p className="text-xs text-green-500 mt-1">Online</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a]">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">
              {MOCK_CHANNELS.find(c => c.id === activeChannel)?.name}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <Search className="w-5 h-5 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
            <Bell className="w-5 h-5 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
            <Users className="w-5 h-5 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className="flex gap-4 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 ${msg.avatar}`}>
                {msg.user.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`font-medium ${msg.isInstructor ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                    {msg.user}
                  </span>
                  {msg.isInstructor && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                      Instructor
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 px-6">
          <form onSubmit={handleSend} className="bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center px-4 py-2 border border-transparent focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-gray-900 transition-colors">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${MOCK_CHANNELS.find(c => c.id === activeChannel)?.name}`}
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white px-3"
            />
            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors ml-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
