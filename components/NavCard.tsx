import React from 'react';
import { NavItem } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface NavCardProps {
  item: NavItem;
  index: number;
}

const NavCard: React.FC<NavCardProps> = ({ item, index }) => {
  const Icon = item.icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

  const domain = (() => {
    try {
      return new URL(item.url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col p-6 md:p-7 border border-paper/12 bg-paper/[0.03] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-transparent"
      style={{ ['--accent' as string]: item.color }}
    >
      {/* 悬停时的色彩底 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}08)` }}
      />
      {/* 左侧色条 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
        style={{ background: item.color }}
      />

      <div className="relative flex items-start justify-between gap-4 mb-5">
        <span className="font-mono text-[11px] tracking-[0.25em] text-paper/35">
          {String(index + 1).padStart(2, '0')}
        </span>
        {item.isNew && (
          <span
            className="px-2 py-0.5 text-[10px] font-bold tracking-widest text-ink"
            style={{ background: item.color }}
          >
            NEW
          </span>
        )}
      </div>

      <div className="relative flex items-center gap-4 mb-3">
        <div
          className="shrink-0 p-2.5 border border-paper/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ color: item.color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-paper group-hover:text-white transition-colors truncate">
            {item.title}
          </h3>
          {domain && (
            <p className="font-mono text-[11px] text-paper/40 mt-0.5 truncate">{domain}</p>
          )}
        </div>
        <ArrowUpRight
          className="w-5 h-5 ml-auto shrink-0 text-paper/30 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: undefined }}
        />
      </div>

      <p className="relative text-sm text-paper/55 leading-relaxed group-hover:text-paper/80 transition-colors">
        {item.description}
      </p>

      <div className="relative mt-5 pt-4 border-t border-paper/10 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-paper/35 uppercase">
          {item.category}
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: item.color }}
        >
          进入 →
        </span>
      </div>
    </a>
  );
};

export default NavCard;
