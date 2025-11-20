import React from 'react';
import { Hero } from './components/Hero';
import { SkillMatrix } from './components/SkillMatrix';
import { AILab } from './components/AILab';
import { ArchitectureBg } from './components/ArchitectureBg';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      {/* Dynamic Architecture Background - Z-0 */}
      <ArchitectureBg />

      {/* Minimal Gradient Overlay - Increased transparency to show background details */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617]/80 z-0"></div>

      {/* Sticky Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-[#020617]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
             <Terminal className="text-emerald-500" size={20} />
             <span className="font-mono font-bold text-lg tracking-tight text-white">
               htazq<span className="text-slate-500">@at9.net</span>
             </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-mono text-slate-400">
            <a href="#" className="hover:text-emerald-400 cursor-pointer transition-colors">~/简介 (about)</a>
            <a href="#" className="hover:text-emerald-400 cursor-pointer transition-colors">~/技能 (skills)</a>
            <a href="#" className="hover:text-emerald-400 cursor-pointer transition-colors">~/AI实验室 (ai-lab)</a>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded bg-slate-900/50">
             v2.1.0-arch-viz
          </div>
        </div>
      </nav>

      {/* Main Content - Z-10 to sit above background */}
      <main className="relative z-10 pt-16">
        <Hero />
        <SkillMatrix />
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-900/50 to-transparent my-12"></div>
        
        <AILab />

        {/* Footer */}
        <footer className="border-t border-slate-800/50 bg-[#01040f]/80 backdrop-blur-sm py-12 mt-20 relative">
          <div className="max-w-6xl mx-auto px-4 text-center">
             <p className="font-mono text-slate-500 text-sm mb-4">
               Designed & Engineered by htazq
             </p>
             <div className="flex justify-center space-x-6 text-xs text-slate-600 font-mono">
                <span>Linux Foundation</span>
                <span>•</span>
                <span>CNCF</span>
                <span>•</span>
                <span>QuantConnect</span>
             </div>
             <p className="mt-8 text-[10px] text-slate-700 uppercase tracking-widest">
               驱动引擎：Google Gemini 2.5 & 3.0 Pro
             </p>
             <p className="mt-2 text-[10px] text-slate-800">
               <a href="mailto:huayuhuia@gmail.com" className="hover:text-slate-600 transition-colors">huayuhuia@gmail.com</a>
             </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
