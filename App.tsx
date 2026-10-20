import { MIRROR_SITES, SITE_CONFIG } from './constants';

const App = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-ink text-paper selection:bg-cinnabar selection:text-paper">
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col justify-center">
        <h1 className="font-serifcn font-black text-4xl md:text-5xl mb-10">
          <span className="text-cinnabar">海棠</span>
          <span className="text-paper/90">的数字空间</span>
        </h1>

        <nav className="flex flex-col gap-3">
          {MIRROR_SITES.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                className="group flex items-center gap-4 px-5 py-4 border border-paper/15 bg-paper/5 hover:border-cinnabar hover:bg-paper/10 transition-colors"
              >
                <Icon size={20} style={{ color: link.color }} />
                <span className="font-mono text-base font-bold text-paper group-hover:text-cinnabar transition-colors">
                  {link.title}
                </span>
                <span className="text-sm text-paper/40 hidden sm:inline">
                  {link.description}
                </span>
                <span className="ml-auto text-paper/25 group-hover:text-cinnabar transition-colors">→</span>
              </a>
            );
          })}
        </nav>
      </main>

      <footer className="w-full py-8 text-center border-t border-paper/10">
        <p className="font-mono text-[11px] text-paper/30 tracking-wider">
          基于 EdgeOne 全球网络
        </p>
      </footer>
    </div>
  );
};

export default App;
