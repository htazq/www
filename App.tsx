import React, { useEffect, useState } from 'react';
import { SITE_CONFIG, LINKS } from './constants';
import LinkCard from './components/LinkCard';
import AiTerminal from './components/AiTerminal';
import MatrixRain from './components/MatrixRain';
import HackerText from './components/HackerText';
import MouseSpotlight from './components/MouseSpotlight';

const App: React.FC = () => {
  const [showMotto, setShowMotto] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowMotto(true), 500);
  }, []);

  // Helper to split text into interactive characters
  const renderInteractiveText = (text: string) => {
    return text.split('').map((char, idx) => (
      <span key={idx} className="flip-char inline-block whitespace-pre">
        {char}
      </span>
    ));
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#020617]">
      <MatrixRain />
      <MouseSpotlight />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950 pointer-events-none -z-0" />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-12 md:py-24 max-w-5xl flex flex-col justify-center">
        
        {/* Hero Section */}
        <section className="mb-20 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-6 animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            SYSTEM ONLINE • v2.5.1
          </div>
          
          {/* Hacker Text Effect for Name */}
          <div className="mb-4 min-h-[4rem] md:min-h-[6rem]">
             <HackerText 
               text={SITE_CONFIG.name} 
               className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tight"
             />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-10">
            {SITE_CONFIG.titles.map((title, index) => (
              <div key={index} className="group relative cursor-default">
                <span className="text-sm md:text-base text-slate-400 font-light glitch-wrapper group-hover:text-white transition-colors" data-text={title}>
                  {title}
                </span>
                {index < SITE_CONFIG.titles.length - 1 && (
                   <span className="ml-4 text-slate-700">/</span>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Motto Block */}
          <div 
            className={`relative group p-6 md:p-10 rounded-2xl bg-slate-900/20 border border-white/5 backdrop-blur-md transition-all duration-1000 transform hover:bg-slate-800/30 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] ${
              showMotto ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-purple/50 group-hover:border-neon-purple transition-colors" />
            
            <p className="text-lg md:text-xl text-slate-300 leading-loose font-light">
              {renderInteractiveText(SITE_CONFIG.motto)}
            </p>
          </div>
        </section>

        {/* Links Grid with Spotlight Effect */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {LINKS.map((link) => (
            <LinkCard key={link.id} item={link} />
          ))}
        </section>
      </main>

      {/* Static Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-900/50 bg-slate-950/50 text-center text-slate-600 text-sm backdrop-blur-sm">
        <p className="hover:text-slate-400 transition-colors cursor-default">© {new Date().getFullYear()} {SITE_CONFIG.domains[0]} [SYSTEM_ACTIVE]</p>
      </footer>

      {/* Chat Widget */}
      <AiTerminal />
    </div>
  );
};

export default App;