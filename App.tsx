import { useEffect, useMemo, useRef, useState } from 'react';
import { MIRROR_SITES, SITE_CONFIG } from './constants';
import NavCard from './components/NavCard';

const App = () => {
  const [query, setQuery] = useState('');
  const [showContent, setShowContent] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 250);
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
    <div className="grain min-h-screen w-full relative flex flex-col bg-ink text-paper selection:bg-cinnabar selection:text-paper">
      {/* 背景色块 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-cinnabar/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-indigo/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[26rem] h-[26rem] rounded-full bg-amber/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 py-14 md:py-20 flex flex-col">
        {/* Hero */}
        <section className="mb-14 md:mb-20">
          <div className="flex items-center gap-3 mb-8 font-mono text-[11px] tracking-[0.3em] text-paper/50">
            <span className="w-2 h-2 bg-cinnabar" />
            FREE PUBLIC MIRROR · EST. 2024
          </div>

          <h1 className="font-serifcn font-black leading-[0.95] tracking-tight text-[17vw] md:text-[9rem] mb-6">
            <span className="text-cinnabar">海棠</span>
            <span className="text-paper/90">的</span>
            <br />
            <span className="text-paper">数字空间</span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <p className="font-mono text-sm md:text-base text-amber tracking-wider">
              {SITE_CONFIG.name}
            </p>
            <p className="max-w-xl text-sm md:text-base text-paper/60 leading-relaxed">
              {SITE_CONFIG.bio}
            </p>
          </div>
        </section>

        {/* Search */}
        <section
          className={`w-full max-w-xl mb-12 transition-all duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索服务或工具…"
              className="w-full px-5 py-4 bg-paper/5 border border-paper/15 rounded-none text-paper placeholder:text-paper/30 focus:outline-none focus:border-cinnabar transition-colors text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-paper/40 hover:text-cinnabar text-xl"
              >
                ×
              </button>
            )}
          </div>
          <p className="text-[11px] text-paper/30 font-mono mt-3 tracking-wider">
            按 <kbd className="px-1.5 py-0.5 bg-paper/10 text-paper/60">/</kbd> 或 <kbd className="px-1.5 py-0.5 bg-paper/10 text-paper/60">Ctrl K</kbd> 搜索
          </p>
        </section>

        {/* Cards */}
        <section
          className={`transition-all duration-700 delay-150 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {filtered.length === 0 ? (
            <div className="py-20 border border-dashed border-paper/20 text-center">
              <p className="text-paper/50 mb-4">没有找到匹配的服务</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-5 py-2.5 bg-cinnabar text-paper hover:bg-cinnabar/85 transition-colors text-sm font-medium"
              >
                重置搜索
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((link, index) => (
                <NavCard key={link.id} item={link} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-t border-paper/10 mt-16 pt-8">
          <div>
            <p className="font-serifcn font-black text-2xl text-paper/90 mb-1">海棠 · at9.net</p>
            <p className="text-xs text-paper/40">{SITE_CONFIG.tagline}</p>
          </div>
          <p className="font-mono text-[11px] text-paper/30 tracking-wider">
            © {new Date().getFullYear()} · POWERED BY {SITE_CONFIG.poweredBy.toUpperCase()} · 免费供个人与开源使用
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
