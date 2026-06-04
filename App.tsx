import React, { useEffect, useState } from 'react';
import { SITE_CONFIG, LINKS } from './constants';
import LinkCard from './components/LinkCard';
import MatrixRain from './components/MatrixRain';
import HackerText from './components/HackerText';
import MouseSpotlight from './components/MouseSpotlight';
import QuoteRotator from './components/QuoteRotator';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const [showMotto, setShowMotto] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowMotto(true), 500);
  }, []);



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

          {/* Dynamic Quote Rotator */}
          <div
            className={`transition-all duration-1000 transform ${showMotto ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
          >
            <QuoteRotator />
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
        <p className="hover:text-slate-400 transition-colors cursor-default mb-2">© {new Date().getFullYear()} {SITE_CONFIG.domains[0]} [SYSTEM_ACTIVE]</p>
        <div className="flex justify-center items-center gap-6 text-xs">
          <a href="https://github.com/htazq" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
          <a href="https://cnb.cool/htazq" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">CNB</a>
          <a href="mailto:at9net@gmail.com" className="hover:text-red-400 transition-colors">at9net@gmail.com</a>
        </div>
      </footer>

      {/* Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default App;