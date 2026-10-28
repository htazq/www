import { useEffect, useState, useCallback, useRef } from 'react';
import { ComponentType } from 'react';
import { ArrowUpRight, Sparkles, Zap, Lock, ChevronDown, Quote, RefreshCw } from 'lucide-react';
import { MIRROR_SITES, FRIEND_LINKS, INTERNAL_SERVICES, SITE_CONFIG } from './constants';
import quotesData from './data/quotes.json';

/* ---------- 随机金句 · 打字机 ---------- */
const RandomQuote = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotesData.length));
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const startTyping = useCallback((text: string) => {
    clearInterval(timerRef.current);
    setTyped('');
    setDone(false);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, 45);
  }, []);

  useEffect(() => {
    startTyping(quotesData[index].content);
    return () => clearInterval(timerRef.current);
  }, [index, startTyping]);

  const next = () => {
    let n;
    do {
      n = Math.floor(Math.random() * quotesData.length);
    } while (n === index && quotesData.length > 1);
    setIndex(n);
  };

  const quote = quotesData[index];
  return (
    <div className="relative rounded-2xl border-2 border-midnight bg-cream hard-shadow-sm px-5 py-4 max-w-xl">
      <Quote size={18} className="absolute -top-2.5 -left-2 text-coral fill-coral rotate-180" />
      <p className="text-sm md:text-base leading-relaxed font-medium text-midnight/85 min-h-[3em] break-words">
        {typed}
        {!done && <span className="inline-block w-2 h-4 ml-0.5 bg-coral align-middle animate-pulse" />}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-ocean/10 text-ocean border border-ocean/30">
          {quote.category}
        </span>
        <button
          onClick={next}
          className="group flex items-center gap-1.5 font-mono text-[11px] font-bold text-midnight/45 hover:text-coral transition-colors"
          title="换一句"
        >
          <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
          换一句
        </button>
      </div>
    </div>
  );
};

/* ---------- 实时时钟 ---------- */
const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = now.getHours();
  const pad = (n: number) => String(n).padStart(2, '0');
  // 随时间变化的标题
  const timeTitle =
    h >= 0 && h < 5
      ? '宇宙寂静时'
      : h < 8
        ? '晨光乘客'
        : h < 11
          ? '上午燃料充足'
          : h < 14
            ? '正午充电中'
            : h < 18
              ? '黄昏建造者'
              : h < 23
                ? '夜间思维加速'
                : '宇宙寂静时';
  return {
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    greeting: h < 6 ? '夜深了' : h < 12 ? '早上好' : h < 18 ? '下午好' : '晚上好',
    timeTitle,
  };
};

/* ---------- 贴纸徽章 ---------- */
const Sticker = ({ text, color, rotate }: { text: string; color: string; rotate: string }) => (
  <span
    className={`inline-block font-mono text-[11px] font-bold px-3 py-1 rounded-full text-cream hard-shadow-sm ${rotate}`}
    style={{ background: color }}
  >
    {text}
  </span>
);

/* ---------- 站点卡片 ---------- */
type IconType = ComponentType<{ size?: number; color?: string; className?: string }>;
const SiteCard = ({ item, featured }: { item: (typeof MIRROR_SITES)[number]; featured?: boolean }) => {
  const Icon = item.icon as IconType;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-2xl border-2 border-midnight bg-cream p-4 sm:p-6 hard-shadow flex flex-col hover:-translate-y-1.5 sm:hover:rotate-[-1deg] transition-all duration-300 active:scale-[.98] ${
        featured ? 'md:col-span-2 md:row-span-2 min-h-[230px]' : 'min-h-[130px] sm:min-h-[150px]'
      }`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: item.color }} />
      <div className="relative flex items-start justify-between">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border-2 border-midnight group-hover:bg-cream transition-colors"
          style={{ background: `${item.color}33` }}
        >
          <Icon size={20} color={item.color} />
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2 sm:px-2.5 py-1 rounded-full border-2 border-midnight bg-sun">
          {item.category}
        </span>
      </div>
      <div className="relative mt-auto pt-6">
        <div className="flex items-center gap-2">
          <h3 className={`font-serifcn font-black text-midnight group-hover:text-cream transition-colors ${featured ? 'text-4xl' : 'text-xl sm:text-2xl'}`}>
            {item.title}
          </h3>
          <ArrowUpRight
            size={featured ? 22 : 18}
            className="text-midnight group-hover:text-cream group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
          />
        </div>
        <p className={`text-midnight/60 group-hover:text-cream/85 transition-colors ${featured ? 'text-sm mt-2' : 'text-xs mt-1'}`}>
          {item.description}
        </p>
        <p className="font-mono text-[11px] text-midnight/40 group-hover:text-cream/60 transition-colors mt-2 truncate">
          {item.url.replace('https://', '')}
        </p>
      </div>
    </a>
  );
};

/* ---------- 跑马灯 ---------- */
const Marquee = () => {
  const words = SITE_CONFIG.marquee;
  const row = [...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y-2 border-midnight bg-coral py-3 -rotate-1 my-4">
      <div className="flex gap-12 whitespace-nowrap animate-marquee w-max items-center">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-12 font-mono text-xs font-bold tracking-[0.25em] text-cream uppercase">
            {w}
            <Sparkles size={14} className="text-sun" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------- 内部服务折叠区 ---------- */
const InternalSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-10 pb-14">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 font-mono text-xs font-bold tracking-[0.3em] text-midnight/50 uppercase hover:text-coral transition-colors"
      >
        <Lock size={13} />
        / 内部服务
        <ChevronDown size={15} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        <span className="text-[10px] text-midnight/30 normal-case tracking-normal">
          （需登录，仅自用）
        </span>
      </button>
      <div
        className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 overflow-hidden transition-all duration-500 ${
          open ? 'max-h-[600px] opacity-100 mt-5' : 'max-h-0 opacity-0'
        }`}
      >
        {INTERNAL_SERVICES.map((s, i) => {
          const Icon = s.icon as IconType;
          return (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed border-midnight/25 bg-cream/70 hover:border-midnight hover:bg-cream hover:-translate-y-0.5 transition-all"
            >
              <Icon size={17} className="text-midnight/50 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-midnight truncate">{s.title}</p>
                <p className="text-[11px] text-midnight/45 truncate">{s.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

const App = () => {
  const { time, greeting, timeTitle } = useClock();

  return (
    <div className="min-h-screen w-full flex flex-col text-midnight relative overflow-x-hidden">
      <div className="aurora" />

      {/* 顶部导航 */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-coral border-2 border-midnight hard-shadow-sm flex items-center justify-center floaty">
            <span className="font-serifcn font-black text-cream text-2xl sm:text-3xl leading-none">{SITE_CONFIG.seal}</span>
          </div>
          <div>
            <p className="font-serifcn font-black text-lg sm:text-xl leading-tight">{SITE_CONFIG.name}</p>
            <p className="font-mono text-[9px] sm:text-[10px] text-midnight/50 tracking-widest uppercase">{SITE_CONFIG.sub}</p>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-5">
          {FRIEND_LINKS.map((f) => (
            <a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs font-bold text-midnight/60 hover:text-coral transition-colors tracking-wider"
            >
              {f.title}
            </a>
          ))}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero */}
        <section className="py-10 sm:py-14 md:py-20">
          <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
            <Sticker text="✦ 你就是宇宙" color="#ff4d3d" rotate="rotate-[-3deg]" />
            <Sticker text="星星的工作坊" color="#1e7dff" rotate="rotate-[2deg]" />
            <Sticker text="由星尘组装" color="#00b876" rotate="rotate-[-1deg]" />
          </div>
          <h1 className="font-serifcn font-black text-[2.6rem] xs:text-5xl sm:text-6xl md:text-7xl leading-[1.08]">
            你好，我是
            <span className="relative inline-block mx-2 sm:mx-3 text-coral">
              Brooks
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M2 9 Q 50 2 100 7 T 198 5" stroke="#ffc700" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <h2 className="stroke-text font-serifcn font-black text-3xl sm:text-4xl md:text-6xl mt-3">
            {timeTitle}
          </h2>
          <p className="mt-5 sm:mt-6 text-midnight/60 max-w-md leading-relaxed text-sm sm:text-base">
            {SITE_CONFIG.tagline}。这里收录了我运营的公益服务、镜像加速与个人站点 —— 全部免费开放。
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-sm">
            <span className="flex items-center gap-2 font-bold text-midnight/80 tabular-nums">
              <Zap size={16} className="text-tangerine fill-sun" />
              {time}
            </span>
            <span className="px-3 py-1 rounded-full border-2 border-midnight bg-cream font-bold text-xs">
              {greeting}，访客 ✧
            </span>
          </div>
          <div className="mt-6 sm:mt-8">
            <RandomQuote />
          </div>
        </section>

        {/* 公开服务网格 */}
        <section>
          <div className="flex items-baseline justify-between mb-4 sm:mb-5">
            <h2 className="font-mono text-xs font-bold tracking-[0.3em] text-midnight/50 uppercase">/ 我的站点</h2>
            <span className="font-mono text-[10px] font-bold text-midnight/40">{MIRROR_SITES.length} SERVICES</span>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {MIRROR_SITES.map((item) => (
              <SiteCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 友链 */}
        <section className="mt-12 sm:mt-14">
          <h2 className="font-mono text-xs font-bold tracking-[0.3em] text-midnight/50 uppercase mb-4 sm:mb-5">/ 找到我</h2>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {FRIEND_LINKS.map((f, i) => {
              const Icon = f.icon as IconType;
              const bg = ['#ff4d3d', '#8b3dff', '#1e7dff'][i % 3];
              return (
                <a
                  key={f.id}
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 sm:gap-2.5 pl-3.5 sm:pl-4 pr-4 sm:pr-5 py-2 sm:py-2.5 rounded-full border-2 border-midnight bg-cream hard-shadow-sm hover:-translate-y-1 transition-all active:scale-95"
                  onMouseEnter={(e) => (e.currentTarget.style.background = bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  <Icon size={15} />
                  <span className="font-mono text-sm font-bold group-hover:text-cream transition-colors">{f.title}</span>
                  <span className="text-xs text-midnight/45 group-hover:text-cream/80 transition-colors hidden xs:inline">
                    {f.description}
                  </span>
                  <ArrowUpRight size={13} className="text-midnight/30 group-hover:text-cream transition-colors" />
                </a>
              );
            })}
          </div>
        </section>
      </main>

      <div className="mt-8 sm:mt-10"><Marquee /></div>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <InternalSection />
      </main>

      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 relative z-10 text-center">
        <p className="font-mono text-[11px] font-bold text-midnight/40 tracking-wider">
          © {new Date().getFullYear()} Brooks · htazq
        </p>
        <p className="font-mono text-[11px] font-bold text-midnight/30 tracking-wider">
          Powered by EdgeOne & Cloudflare · Made with ♥
        </p>
      </footer>
    </div>
  );
};

export default App;
