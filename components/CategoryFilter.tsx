import React from 'react';
import { NavItem } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryFilterProps {
  active: NavItem['category'] | 'All';
  onChange: (category: NavItem['category'] | 'All') => void;
  counts: Record<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ active, onChange, counts }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('All')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
          active === 'All'
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
        }`}
      >
        全部
        <span className="ml-1.5 text-xs opacity-70">{counts['All'] ?? 0}</span>
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            active === cat.id
              ? `${cat.color} border-current`
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
          }`}
        >
          {cat.label}
          <span className="ml-1.5 text-xs opacity-70">{counts[cat.id] ?? 0}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
