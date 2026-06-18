import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SITE_CONFIG, NAV_LINKS, STATS } from './constants';
import NavCard from './components/NavCard';
import MatrixRain from './components/MatrixRain';
import HackerText from './components/HackerText';
import MouseSpotlight from './components/MouseSpotlight';
import QuoteRotator from './components/QuoteRotator';
import ScrollToTop from './components/ScrollToTop';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import { NavItem } from './types';
import { Github, Globe, LayoutDashboard, Mail, Container, Network, Server, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [showMotto, setShowMotto] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NavItem['category'] | 'All'>('All');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowMotto(true), 500);
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: NAV_LINKS.length };
    NAV_LINKS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const featured = useMemo(() => NAV_LINKS.filter((i) => i.isFeatured), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NAV_LINKS.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-[#020617]">
      <MatrixRain />
      <MouseSpotlight />

      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950 pointer-events-none -z-0" />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-16">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">{SITE_CONFIG.shortName}</h2>
              <p className="text-xs font-mono text-slate-500">NAVIGATION PORTAL</p>
            </div>
          </a>
          <div className="flex items-center gap-3 text-sm">
            <a href="/9deck/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">9Deck</span>
            </a>
            <a href="https://github.com/htazq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a href="mailto:at9net@gmail.com" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-red-300 hover:border-red-500/30 transition-colors">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="mb-14 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            SYSTEM ONLINE • v3.0.0
          </div>

          <div className="mb-4 min-h-[4rem] md:min-h-[6rem]">
            <HackerText
              text={SITE_CONFIG.name}
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tight"
            />
          </div>

          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mb-8 leading-relaxed">
            {SITE_CONFIG.tagline}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: 'Total Sites', value: STATS.totalSites, icon: Globe },
              { label: 'Active Projects', value: STATS.activeProjects, icon: Sparkles },
              { label: 'Mirror Services', value: STATS.mirrorServices, icon: Container },
              { label: 'Open Source Repos', value: STATS.openSourceRepos, icon: Github },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase">{stat.label}</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-100">{stat.value}</div>
              </div>
            ))}
          </div>

          <div
            className={`transition-all duration-1000 transform ${
              showMotto ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <QuoteRotator />
          </div>
        </section>

        {/* Featured */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((link) => (
              <NavCard key={link.id} item={link} />
            ))}
          </div>
        </section>

        {/* Navigation Directory */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-pink-400" />
              <h2 className="text-xl font-bold text-slate-100">Navigation Directory</h2>
            </div>
            <div className="text-sm text-slate-500 font-mono">
              Showing {filtered.length} of {NAV_LINKS.length} entries
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <SearchBar ref={searchRef} value={query} onChange={setQuery} />
            <CategoryFilter active={category} onChange={setCategory} counts={categoryCounts} />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
              <p className="text-slate-500">No entries match your search.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
              >
                Reset filters
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

        {/* Quick service strip */}
        <section className="mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 to-slate-900/40 border border-slate-800">
            <h3 className="text-sm font-mono text-slate-500 mb-4 uppercase tracking-wider">Popular Services</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'ip.at9.net', url: 'https://ip.at9.net', icon: Network },
                { label: 'docker.at9.net', url: 'https://docker.at9.net', icon: Container },
                { label: 'gh-proxy.at9.net', url: 'https://gh-proxy.at9.net/', icon: Server },
                { label: 'github.at9.net', url: 'https://github.at9.net', icon: Github },
                { label: 'blog.at9.net', url: 'https://blog.at9.net', icon: Globe },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors text-sm"
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-8 border-t border-slate-900/50 bg-slate-950/50 text-center text-slate-600 text-sm backdrop-blur-sm">
        <p className="hover:text-slate-400 transition-colors cursor-default mb-2">
          © {new Date().getFullYear()} {SITE_CONFIG.domains[0]} [SYSTEM_ACTIVE]
        </p>
        <div className="flex justify-center items-center gap-6 text-xs">
          <a href="https://github.com/htazq" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
          <a href="https://cnb.cool/htazq" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">CNB</a>
          <a href="mailto:at9net@gmail.com" className="hover:text-red-400 transition-colors">at9net@gmail.com</a>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default App;
