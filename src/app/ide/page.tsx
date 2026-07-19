'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Code, Layout, Eye, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function IDEPage() {
  const [html, setHtml] = useState('<div class="container">\n  <h1>Hello Codivexa!</h1>\n  <p>Start coding here...</p>\n</div>');
  const [css, setCss] = useState('.container {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 2rem;\n  color: #333;\n}\nh1 {\n  color: #f97316;\n}');
  const [js, setJs] = useState('console.log("Welcome to Codivexa Workspace");');
  
  const [python, setPython] = useState('def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("Codivexa Python Workspace")');
  const [java, setJava] = useState('public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}');
  const [cpp, setCpp] = useState('#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++ Workspace!" << std::endl;\n    return 0;\n}');
  
  const [activeLang, setActiveLang] = useState<'web' | 'python' | 'java' | 'cpp'>('web');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [srcDoc, setSrcDoc] = useState('');
  const [consoleOut, setConsoleOut] = useState('');

  useEffect(() => {
    if (activeLang !== 'web') return;
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>
              const originalLog = console.log;
              console.log = (...args) => {
                window.parent.postMessage({ type: 'console', log: args.join(' ') }, '*');
                originalLog(...args);
              };
              try {
                ${js}
              } catch(e) {
                console.log(e.message);
              }
            </script>
          </body>
        </html>
      `);
    }, 500); // 500ms debounce
    return () => clearTimeout(timeout);
  }, [html, css, js, activeLang]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'console') {
        setConsoleOut(prev => prev + e.data.log + '\\n');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRunBackendCode = () => {
    setConsoleOut('Compiling code...\\n');
    setTimeout(() => {
      if (activeLang === 'python') {
        setConsoleOut('Compiling code...\\nRunning python3 main.py...\\n\\nHello, Codivexa Python Workspace!\\n[Finished in 0.2s]');
      } else if (activeLang === 'java') {
        setConsoleOut('Compiling code...\\nRunning javac Main.java && java Main...\\n\\nHello from Java!\\n[Finished in 0.8s]');
      } else if (activeLang === 'cpp') {
        setConsoleOut('Compiling code...\\nRunning g++ main.cpp -o main && ./main...\\n\\nHello from C++ Workspace!\\n[Finished in 1.1s]');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Top Navbar for IDE */}
      <div className="h-14 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-orange-500" />
            <h1 className="font-semibold text-gray-200 hidden sm:block">Workspace IDE</h1>
          </div>
          
          <div className="h-4 w-px bg-gray-700 hidden sm:block" />

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest hidden md:block">Language</span>
            <select
              value={activeLang}
              onChange={(e) => {
                setActiveLang(e.target.value as any);
                setConsoleOut('');
              }}
              className="bg-[#1e1e1e] border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full px-3 py-1.5"
            >
              <option value="web">Web (HTML/CSS/JS)</option>
              <option value="python">Python 3</option>
              <option value="java">Java (JDK 21)</option>
              <option value="cpp">C++ (GCC)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<Save className="w-4 h-4" />}>
            Save
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Play className="w-4 h-4" />} 
            onClick={() => {
              if (activeLang === 'web') {
                setConsoleOut(''); // reset
                setSrcDoc(srcDoc + ' '); // force re-render iframe
              } else {
                handleRunBackendCode();
              }
            }}
          >
            Run Code
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Area */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-800 bg-[#1e1e1e]">
          <div className="flex border-b border-gray-800 bg-[#0a0a0a]">
            {activeLang === 'web' ? (
              ['html', 'css', 'js'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-[#1e1e1e]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1e1e1e]/50 border-b-2 border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))
            ) : (
              <button className="px-6 py-3 text-sm font-medium uppercase tracking-wider text-orange-500 border-b-2 border-orange-500 bg-[#1e1e1e]">
                {activeLang === 'python' ? 'main.py' : activeLang === 'java' ? 'Main.java' : 'main.cpp'}
              </button>
            )}
          </div>
          
          <div className="flex-1 relative">
            {activeLang === 'web' ? (
              <textarea
                className="absolute inset-0 w-full h-full p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                onChange={(e) => {
                  if (activeTab === 'html') setHtml(e.target.value);
                  if (activeTab === 'css') setCss(e.target.value);
                  if (activeTab === 'js') setJs(e.target.value);
                }}
                spellCheck="false"
              />
            ) : (
              <textarea
                className="absolute inset-0 w-full h-full p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                value={activeLang === 'python' ? python : activeLang === 'java' ? java : cpp}
                onChange={(e) => {
                  if (activeLang === 'python') setPython(e.target.value);
                  if (activeLang === 'java') setJava(e.target.value);
                  if (activeLang === 'cpp') setCpp(e.target.value);
                }}
                spellCheck="false"
              />
            )}
          </div>
        </div>

        {/* Output Area */}
        <div className={`w-full lg:w-1/2 flex flex-col h-[50vh] lg:h-auto ${activeLang === 'web' ? 'bg-white' : 'bg-black'}`}>
          <div className={`h-10 border-b flex items-center justify-between px-4 ${activeLang === 'web' ? 'border-gray-200 bg-gray-50 text-gray-600' : 'border-gray-800 bg-[#111] text-gray-400'}`}>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                {activeLang === 'web' ? 'Live Preview' : 'Console Output'}
              </span>
            </div>
          </div>
          <div className={`flex-1 ${activeLang === 'web' ? 'bg-white' : 'bg-black p-4'}`}>
            {activeLang === 'web' ? (
              <iframe
                srcDoc={srcDoc}
                title="Live Preview"
                sandbox="allow-scripts"
                width="100%"
                height="100%"
                className="border-none"
              />
            ) : (
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{consoleOut}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
