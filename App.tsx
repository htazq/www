import React, { useEffect, useState, useRef } from 'react';
import { Activity, GitCommit, GitPullRequest, RefreshCw } from 'lucide-react';

/* ─────────────────────────────────────────────
   All in AI · 静态展示页
   ───────────────────────────────────────────── */

// ── 粒子背景 ──
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    const COUNT = 90;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
        a: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,210,255,${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(99,210,255,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

// ── 打字机效果 ──
const Typewriter: React.FC<{ texts: string[]; speed?: number; pause?: number }> = ({
  texts,
  speed = 80,
  pause = 2500,
}) => {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((textIdx + 1) % texts.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return (
    <span className="inline-block">
      {display}
      <span className="animate-pulse text-cyan-400 ml-0.5">|</span>
    </span>
  );
};

// ── AI 能力卡片数据 ──
const AI_CAPABILITIES = [
  {
    icon: '🧠',
    title: '认知觉醒',
    desc: 'AI 重新定义了人类的认知边界——从"知道"到"追问"，从"记忆"到"创造"。',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    glow: 'hover:shadow-violet-500/20',
  },
  {
    icon: '⚡',
    title: '效率革命',
    desc: '代码生成、文档撰写、数据分析——AI 将重复劳动压缩到毫秒级，释放你的创造力。',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    glow: 'hover:shadow-cyan-500/20',
  },
  {
    icon: '🔮',
    title: '预测与洞察',
    desc: '从海量数据中发现隐藏模式，AI 让决策从"凭直觉"变成"看证据"。',
    color: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    glow: 'hover:shadow-emerald-500/20',
  },
  {
    icon: '🤖',
    title: '智能体协作',
    desc: 'Agent 不只是工具，而是能自主规划、执行、反思的数字伙伴。',
    color: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/30',
    glow: 'hover:shadow-orange-500/20',
  },
  {
    icon: '🎨',
    title: '创意无界',
    desc: '文本、图像、音乐、视频——AI 打破媒介壁垒，让想象力成为唯一的上限。',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    glow: 'hover:shadow-pink-500/20',
  },
  {
    icon: '🌐',
    title: '万物互联',
    desc: '多模态大模型连接视觉、语言、行动——AI 正在成为物理与数字世界的桥梁。',
    color: 'from-sky-500/20 to-indigo-500/20',
    border: 'border-sky-500/30',
    glow: 'hover:shadow-sky-500/20',
  },
];

// ── 数据条 ──
const STATS = [
  { label: '大模型参数量', value: '1.8T+', sub: 'GPT-4 级别' },
  { label: '全球 AI 开发者', value: '2400万+', sub: '且在指数增长' },
  { label: 'AI 论文年发表量', value: '24万+', sub: '2024 数据' },
  { label: '企业 AI 采纳率', value: '72%', sub: 'Fortune 500' },
];

// ── 时间线 ──
const TIMELINE = [
  { year: '2017', event: 'Transformer 架构诞生', desc: 'Attention Is All You Need 改变了一切' },
  { year: '2018', event: 'BERT & GPT 登场', desc: '预训练语言模型时代开启' },
  { year: '2020', event: 'GPT-3 震撼发布', desc: '1750 亿参数，涌现能力初现' },
  { year: '2022', event: 'ChatGPT 引爆全球', desc: 'AI 从实验室走向每个人的桌面' },
  { year: '2023', event: 'GPT-4 & 多模态', desc: '视觉、代码、推理——通用智能的曙光' },
  { year: '2024', event: 'AI Agent 元年', desc: '从对话到行动，智能体开始接管工作流' },
  { year: '2025', event: 'All in AI', desc: '这不是选择，而是时代的洪流' },
];

// ── 语录 ──
const QUOTES = [
  '未来不会淘汰人类，但会淘汰不会使用 AI 的人。',
  '把 AI 仅仅当作搜索引擎，无异于用光剑切菜。',
  'Prompt 即是当代的咒语，自然语言已成为最高级的编程代码。',
  'AI 是人类灵魂的高保真镜像——平庸的提问得到平庸的答案。',
  '在 AI 时代，"知道答案"不再稀缺，"提出好问题"才是艺术。',
  '碳基生命用数亿年演化出意识，硅基生命用数年学完了全部文明。',
];

type FeedSource = {
  configured: boolean;
  usedApi: boolean;
  repos: number;
};

type DashboardRepo = {
  fullName: string;
  primaryUrl: string;
  latestCommit?: {
    sha?: string;
    message?: string;
    committedAt?: string;
    author?: string;
    url?: string;
  } | null;
  contribution?: {
    latest?: {
      number?: number;
      title?: string;
      state?: string;
      updatedAt?: string;
      url?: string;
    } | null;
  } | null;
};

type DashboardFeed = {
  generatedAt: string;
  source: {
    github: FeedSource;
    cnb: FeedSource;
  };
  summary: {
    total: number;
  };
  repositories: DashboardRepo[];
};

const formatDateTime = (value?: string) => {
  if (!value) return '等待同步';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '等待同步';
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const shortSha = (value?: string) => (value ? value.slice(0, 7) : 'pending');

// ── 主应用 ──
const App: React.FC = () => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [feed, setFeed] = useState<DashboardFeed | null>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState('');

  const loadFeed = async () => {
    setFeedLoading(true);
    try {
      const response = await fetch(`/data/dashboard-feed.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`dashboard-feed.json ${response.status}`);
      }
      const payload = (await response.json()) as DashboardFeed;
      setFeed(payload);
      setFeedError('');
    } catch (error) {
      setFeedError(error instanceof Error ? error.message : '无法读取动态 feed');
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 600);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    void loadFeed();
    const timer = setInterval(() => void loadFeed(), 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const latestCommitRepo = feed?.repositories.find((repo) => repo.latestCommit?.committedAt);
  const latestPrRepo = feed?.repositories.find((repo) => repo.contribution?.latest?.updatedAt);
  const latestCommit = latestCommitRepo?.latestCommit;
  const latestPr = latestPrRepo?.contribution?.latest;

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white font-sans overflow-x-hidden">
      <ParticleField />

      {/* 渐变覆盖层 */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#030712]/60 via-transparent to-[#030712] pointer-events-none -z-[5]" />

      {/* ── 导航 ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030712]/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm text-cyan-400">ALL IN AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#capabilities" className="hover:text-cyan-400 transition-colors">能力</a>
            <a href="#activity" className="hover:text-cyan-400 transition-colors">动态</a>
            <a href="#timeline" className="hover:text-cyan-400 transition-colors">演进</a>
            <a href="#manifesto" className="hover:text-cyan-400 transition-colors">宣言</a>
            <a href="#links" className="hover:text-cyan-400 transition-colors">链接</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-8 animate-pulse">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
            SYSTEM ONLINE · 2025
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              All in AI
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mb-4 min-h-[2.5rem]">
            <Typewriter
              texts={[
                '这不是选择，而是进化的必然',
                '从碳基到硅基，从算力到智能',
                '每一行代码都在重塑未来',
                '你的思维外骨骼已上线',
              ]}
            />
          </div>

          <p className="text-slate-500 max-w-xl leading-relaxed mb-10">
            当大模型的参数跨越临界点，硅基芯片的微弱噪鸣，听起来越来越像地平线上新物种的心跳。
            All in AI — 这不是赌注，而是通往未来的唯一入场券。
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#capabilities"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25"
            >
              探索 AI 能力
            </a>
            <a
              href="#manifesto"
              className="px-6 py-3 rounded-lg border border-white/10 text-slate-300 font-medium text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
            >
              阅读宣言
            </a>
            <a
              href="#activity"
              className="px-6 py-3 rounded-lg border border-emerald-400/30 text-emerald-300 font-medium text-sm hover:border-emerald-300 hover:text-emerald-200 transition-all"
            >
              查看代码动态
            </a>
          </div>

          {/* 向下滚动提示 */}
          <div className="absolute bottom-10 animate-bounce text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ── 数据条 ── */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-sm text-slate-300 mt-1">{s.label}</div>
                <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 代码动态 ── */}
        <section id="activity" className="py-24 px-6 bg-gradient-to-b from-cyan-500/[0.03] to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">Live Activity</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3">代码动态同步</h2>
                <p className="text-slate-400 mt-3 max-w-2xl">
                  聚合 GitHub 与 CNB feed，展示最近提交、最近 PR 和当前数据源状态。
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadFeed()}
                disabled={feedLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-sm hover:bg-cyan-500/15 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${feedLoading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'feed updated', value: formatDateTime(feed?.generatedAt), accent: 'text-cyan-300' },
                { label: 'GitHub repos', value: `${feed?.source.github.repos ?? 0} · ${feed?.source.github.usedApi ? 'API' : 'snapshot'}`, accent: 'text-blue-300' },
                { label: 'CNB repos', value: `${feed?.source.cnb.repos ?? 0} · ${feed?.source.cnb.usedApi ? 'API' : 'snapshot'}`, accent: 'text-orange-300' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.025] px-5 py-4">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-slate-600">{item.label}</div>
                  <div className={`mt-2 text-lg font-semibold ${item.accent}`}>{item.value}</div>
                </div>
              ))}
            </div>

            {feedError ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {feedError}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <a
                  href={latestCommit?.url || latestCommitRepo?.primaryUrl || 'https://github.com/htazq'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-cyan-500/15 bg-[#06111f]/80 p-6 hover:border-cyan-400/40 hover:bg-cyan-500/[0.08] transition-all"
                >
                  <div className="flex items-center gap-3 text-cyan-300 mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                      <GitCommit className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">最近 Commit</div>
                      <div className="font-mono text-xs text-slate-500">{formatDateTime(latestCommit?.committedAt)}</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-slate-500 mb-2">{shortSha(latestCommit?.sha)} · {latestCommitRepo?.fullName || '等待数据'}</div>
                  <p className="text-slate-200 leading-relaxed line-clamp-3">
                    {latestCommit?.message || 'feed 正在生成，稍后会显示最近提交。'}
                  </p>
                  <div className="mt-5 inline-flex items-center text-xs text-cyan-300 group-hover:translate-x-1 transition-transform">
                    打开提交记录 →
                  </div>
                </a>

                <a
                  href={latestPr?.url || latestPrRepo?.primaryUrl || 'https://github.com/htazq'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-emerald-500/15 bg-[#061610]/80 p-6 hover:border-emerald-400/40 hover:bg-emerald-500/[0.08] transition-all"
                >
                  <div className="flex items-center gap-3 text-emerald-300 mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
                      <GitPullRequest className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">最近 PR</div>
                      <div className="font-mono text-xs text-slate-500">{formatDateTime(latestPr?.updatedAt)}</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-slate-500 mb-2">
                    #{latestPr?.number ?? 0} · {latestPr?.state || 'pending'} · {latestPrRepo?.fullName || '等待数据'}
                  </div>
                  <p className="text-slate-200 leading-relaxed line-clamp-3">
                    {latestPr?.title || 'feed 正在生成，稍后会显示最近 PR。'}
                  </p>
                  <div className="mt-5 inline-flex items-center text-xs text-emerald-300 group-hover:translate-x-1 transition-transform">
                    打开 PR →
                  </div>
                </a>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>页面每 5 分钟自动重新读取一次 feed。</span>
            </div>
          </div>
        </section>

        {/* ── AI 能力 ── */}
        <section id="capabilities" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">AI 正在重塑一切</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                从认知到创造，从效率到协作——AI 的能力边界正在以指数级速度扩张
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AI_CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className={`group relative p-6 rounded-2xl border ${cap.border} bg-gradient-to-br ${cap.color} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cap.glow}`}
                >
                  <div className="text-4xl mb-4">{cap.icon}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors">{cap.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 时间线 ── */}
        <section id="timeline" className="py-24 px-6 bg-white/[0.01]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">Timeline</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">AI 演进之路</h2>
              <p className="text-slate-400">从 Transformer 到 All in AI，每一步都在重新定义可能的边界</p>
            </div>

            <div className="relative">
              {/* 竖线 */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent" />

              {TIMELINE.map((item, idx) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6 mb-12 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* 节点 */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 z-10 mt-1.5" />

                  {/* 内容 */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="font-mono text-cyan-400 text-sm">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1">{item.event}</h3>
                    <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 语录区 ── */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`transition-all duration-600 ${
                quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="relative p-10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-400">
                  AI INSIGHT
                </div>
                <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">
                  「{QUOTES[quoteIdx]}」
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 宣言 ── */}
        <section id="manifesto" className="py-24 px-6 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">Manifesto</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3">All in AI 宣言</h2>
            </div>

            <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>
                我们站在一个奇点上。前方的路只有一条：<strong className="text-cyan-400">All in AI</strong>。
              </p>
              <p>
                这不是跟风，不是 FOMO，而是一个基于事实的判断——当<strong className="text-white">智能本身成为基础设施</strong>，
                不接入这个基础设施的人和团队，将像没有接入电网的村庄一样被时代遗忘。
              </p>
              <p>
                AI 不是一个工具，它是一种<strong className="text-white">新的思维方式</strong>。
                就像电不只是"更好的蜡烛"，AI 也不只是"更好的搜索引擎"。
                它是思维的外骨骼，是创造力的放大器，是让每个人都能触及天才边界的阶梯。
              </p>
              <p>
                在 AGI 临门的前夜，拼写 Prompt 的速度已不再重要，
                如何与硅基心智进行深度的<strong className="text-cyan-400">"思维共振"</strong>才是唯一的入场券。
              </p>
              <p className="text-xl font-medium text-white text-center pt-4">
                All in AI — 不是赌注，是进化的方向。
              </p>
            </div>
          </div>
        </section>

        {/* ── 链接 ── */}
        <section id="links" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">Links</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3">探索更多</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Tech Blog', url: 'https://blog.at9.net', desc: '技术博客，记录 AI 与运维学习之路', icon: '📝' },
                { title: 'GitHub', url: 'https://github.com/htazq', desc: '开源项目与代码仓库', icon: '🐙' },
                { title: 'CNB 平台', url: 'https://cnb.cool/htazq', desc: 'Cloud Native Build', icon: '🚀' },
                { title: 'Docker Mirror', url: 'https://docker.at9.net', desc: 'Docker 镜像加速服务', icon: '🐳' },
                { title: 'View My IP', url: 'https://ip.at9.net', desc: '快速获取公网 IP 信息', icon: '🌐' },
                { title: 'GitHub Proxy', url: 'https://gh-proxy.at9.net/', desc: 'GitHub 文件加速下载', icon: '⚡' },
              ].map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <div>
                    <div className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {link.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{link.desc}</div>
                  </div>
                  <svg
                    className="w-4 h-4 ml-auto text-slate-600 group-hover:text-cyan-400 transition-all group-hover:translate-x-1 -rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 border-t border-white/5 bg-[#030712]/80 text-center text-slate-600 text-sm">
        <p className="mb-2">© {new Date().getFullYear()} at9.net · All in AI</p>
        <div className="flex justify-center items-center gap-6 text-xs">
          <a href="https://github.com/htazq" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
          <a href="https://cnb.cool/htazq" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">CNB</a>
          <a href="mailto:at9net@gmail.com" className="hover:text-red-400 transition-colors">at9net@gmail.com</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
