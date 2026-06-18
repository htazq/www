import React, { useRef, useState } from 'react';
import { NavItem } from '../types';
import { ExternalLink } from 'lucide-react';

interface NavCardProps {
  item: NavItem;
}

const NavCard: React.FC<NavCardProps> = ({ item }) => {
  const divRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const isImageUrl = typeof item.icon === 'string';
  const Icon = item.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);
  const handleFocus = () => setOpacity(1);
  const handleBlur = () => setOpacity(0);

  const domain = (() => {
    try {
      return new URL(item.url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  return (
    <a
      ref={divRef}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="relative group flex flex-col p-5 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
    >
      {/* Spotlight layers */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.12), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.25), transparent 40%)`,
          maskImage: 'linear-gradient(#fff, #fff), linear-gradient(#fff, #fff)',
          maskClip: 'content-box, border-box',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* New badge */}
      {item.isNew && (
        <span className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold tracking-wider border border-rose-500/30 animate-pulse">
          NEW
        </span>
      )}

      <div className="relative z-10 flex items-start gap-4">
        <div className={`shrink-0 p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-slate-600 transition-colors`}>
          {isImageUrl ? (
            <img
              src={item.icon as string}
              alt={item.title}
              className={`w-7 h-7 ${item.color} object-contain transition-transform duration-300 group-hover:scale-110`}
            />
          ) : (
            <Icon className={`w-7 h-7 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
              {item.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 transform group-hover:rotate-45" />
          </div>
          {domain && (
            <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">{domain}</p>
          )}
        </div>
      </div>

      <p className="relative z-10 mt-4 text-sm text-slate-400 font-light leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors">
        {item.description}
      </p>

      <div className="relative z-10 mt-auto pt-4 flex flex-wrap items-center gap-2">
        {item.badge && (
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
            {item.badge}
          </span>
        )}
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 text-[10px] border border-slate-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
};

export default NavCard;
