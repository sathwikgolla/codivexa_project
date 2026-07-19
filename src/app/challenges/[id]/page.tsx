'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Code2, ArrowLeft, CheckCircle2, ChevronRight, Save, Layout, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function ChallengeArenaPage() {
  const params = useParams();
  const router = useRouter();
  
  const [html, setHtml] = useState('<!-- Build a flexible layout container here -->\n<div class="flex-container">\n  <div class="box">1</div>\n  <div class="box">2</div>\n  <div class="box">3</div>\n</div>');
  const [css, setCss] = useState('/* Add your Flexbox magic here */\n.flex-container {\n  \n}\n\n.box {\n  width: 50px;\n  height: 50px;\n  background: #f97316;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 5px;\n  border-radius: 8px;\n}');
  const [js, setJs] = useState('// No JavaScript needed for this challenge');
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('css');
  const [srcDoc, setSrcDoc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f9fafb; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success('Challenge passed! +100 Points');
    setTimeout(() => {
      router.push('/challenges');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e] text-white overflow-hidden pt-16">
      {/* Top Navbar */}
      <div className="h-14 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-gray-800" />
          <h1 className="font-semibold text-gray-200 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-orange-500" />
            Responsive Flexbox Layout
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<Save className="w-4 h-4" />}>
            Save
          </Button>
          <Button 
            variant={submitted ? "secondary" : "primary"} 
            size="sm" 
            icon={submitted ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />} 
            onClick={handleSubmit}
          >
            {submitted ? 'Passed!' : 'Submit Solution'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Instructions */}
        <div className="w-full lg:w-1/3 flex flex-col border-r border-gray-800 bg-[#111]">
          <div className="h-10 border-b border-gray-800 bg-[#0a0a0a] flex items-center px-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium tracking-wider uppercase">
              <FileText className="w-4 h-4" />
              Instructions
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Flexbox Basics</h2>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-bold uppercase rounded">Easy</span>
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase rounded">+100 Pts</span>
              </div>
            </div>
            
            <div className="prose prose-invert prose-sm">
              <p>
                In this challenge, you need to use CSS Flexbox to align the three boxes in the center of the screen, spaced evenly.
              </p>
              <h3>Requirements:</h3>
              <ul>
                <li>Target the <code>.flex-container</code> class.</li>
                <li>Make it a flex container.</li>
                <li>Align items to the center horizontally and vertically.</li>
                <li>Add a gap of <code>20px</code> between items.</li>
              </ul>
              
              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mt-6">
                <h4 className="text-blue-400 flex items-center gap-2 m-0 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Hint
                </h4>
                <p className="m-0 text-blue-200/70">Remember to use <code>display: flex</code> and <code>justify-content</code>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor and Preview */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {/* Editor */}
          <div className="flex-1 flex flex-col border-b border-gray-800">
            <div className="flex border-b border-gray-800 bg-[#0a0a0a]">
              {['html', 'css', 'js'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-[#1e1e1e]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1e1e1e]/50 border-b-2 border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 relative">
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
            </div>
          </div>

          {/* Preview */}
          <div className="h-48 lg:h-[35%] border-t border-gray-800 flex flex-col bg-white">
            <div className="h-8 border-b border-gray-200 bg-gray-50 flex items-center px-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold tracking-wider uppercase">
                <Layout className="w-3 h-3" />
                Live Output
              </div>
            </div>
            <div className="flex-1">
              <iframe
                srcDoc={srcDoc}
                title="Live Output"
                sandbox="allow-scripts"
                width="100%"
                height="100%"
                className="border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
