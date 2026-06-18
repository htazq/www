import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CORE_SITES, SOCIAL_LINKS, SITE_CONFIG } from './constants';
import NavCard from './components/NavCard';
import MatrixRain from './components/MatrixRain';
import HackerText from './components/HackerText';
import MouseSpotlight from './components/MouseSpotlight';
import QuoteRotator from './components/QuoteRotator';
import SearchBar from './components/SearchBar';
import { NavItem } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NavItem['category'] | 'All'>('All');
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

  const allLinks = useMemo(() => [...CORE_SITES, ...SOCIAL_LINKS], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allLinks.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category, allLinks]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <MatrixRain />
      <MouseSpotlight />

      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950 pointer-events-none z-0" />

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col">
        {/* Hero */}
        <section className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-8 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            SYSTEM ONLINE
          </div>

          <div className="mb-6 min-h-[4.5rem] md:min-h-[6.5rem] flex items-center justify-center">
            <HackerText
              text={SITE_CONFIG.name}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tighter"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-light text-slate-300 mb-3">
            {SITE_CONFIG.headline}
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-mono mb-8">
            {SITE_CONFIG.tagline}
          </p>

          <div
            className={`max-w-2xl mx-auto transition-all duration-1000 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <QuoteRotator />
          </div>
        </section>

        {/* Search & Filter */}
        <section
          className={`w-full max-w-2xl mx-auto mb-10 transition-all duration-700 delay-100 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <SearchBar ref={searchRef} value={query} onChange={setQuery} />
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {['All', 'Site', 'Tool', 'Social'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat as NavItem['category'] | 'All')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  category === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? '全部' : cat}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-slate-600 font-mono mt-3">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">/</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Ctrl K</kbd> to search
          </p>
        </section>

        {/* Links Grid */}
        <section
          className={`transition-all duration-700 delay-200 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <p className="text-slate-500 mb-3">No matches found</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((link) => (
                <NavCard key={link.id} item={link} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-16 text-center text-xs text-slate-600 font-mono">
          <p className="mb-2">© {new Date().getFullYear()} {SITE_CONFIG.domains[0]}</p>
          <p>All systems nominal. Keep building.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
