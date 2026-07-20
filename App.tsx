import { useEffect, useMemo, useRef, useState } from 'react';
import { MIRROR_SITES, TRUST_BADGES, SITE_CONFIG } from './constants';
import NavCard from './components/NavCard';
import MatrixRain from './components/MatrixRain';
import HackerText from './components/HackerText';
import MouseSpotlight from './components/MouseSpotlight';
import { Cloud } from 'lucide-react';

const App = () => {
  const [query, setQuery] = useState('');
  const [showContent, setShowContent] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MIRROR_SITES;
    return MIRROR_SITES.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <MatrixRain />
      <MouseSpotlight />

      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950 pointer-events-none z-0" />

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col">
        {/* Hero */}
        <section className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-6 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            FREE PUBLIC MIRROR
          </div>

          <div className="mb-5 min-h-[4.5rem] md:min-h-[6.5rem] flex items-center justify-center">
            <HackerText
              text={SITE_CONFIG.name}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tighter"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-light text-slate-300 mb-3">
            {SITE_CONFIG.headline}
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-mono mb-6">
            {SITE_CONFIG.tagline}
          </p>
          <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed">
            {SITE_CONFIG.bio}
          </p>
        </section>

        {/* Trust badges */}
        <section
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
            >
              <badge.icon className={`w-4 h-4 ${badge.color}`} />
              <span className="text-slate-300">{badge.label}</span>
            </div>
          ))}
        </section>

        {/* Search */}
        <section
          className={`w-full max-w-xl mx-auto mb-10 transition-all duration-700 delay-100 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative group">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索镜像或工具..."
              className="w-full pl-4 pr-10 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-light text-center"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
              >
                ×
              </button>
            )}
          </div>
          <p className="text-center text-xs text-slate-600 font-mono mt-3">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">/</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Ctrl K</kbd> to search
          </p>
        </section>

        {/* Cards */}
        <section
          className={`transition-all duration-700 delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <p className="text-slate-500 mb-3">No matches found</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((link) => (
                <NavCard key={link.id} item={link} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-16 text-center text-xs text-slate-600 font-mono">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Cloud className="w-4 h-4 text-orange-400" />
            <span>Powered by {SITE_CONFIG.poweredBy}</span>
          </div>
          <p className="mb-1">© {new Date().getFullYear()} {SITE_CONFIG.domains[0]}</p>
          <p>Free for personal and open-source use.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
