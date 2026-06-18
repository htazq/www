import React, { useRef, useState } from 'react';
import { NavItem } from '../types';
import { ExternalLink } from 'lucide-react';

interface LinkCardProps {
  item: NavItem;
}

const LinkCard: React.FC<LinkCardProps> = ({ item }) => {
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

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <a
      ref={divRef}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group flex items-start p-4 gap-4 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Spotlight Effect Layer */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Border Glow using Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.3), transparent 40%)`,
          maskImage: 'linear-gradient(#fff, #fff), linear-gradient(#fff, #fff)',
          maskClip: 'content-box, border-box',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      <div className={`relative z-10 p-3 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-${item.color.split('-')[1]}-500/50 transition-colors`}>
        {isImageUrl ? (
          <img 
            src={item.icon as string} 
            alt={item.title}
            className={`w-6 h-6 ${item.color} transition-transform duration-300 group-hover:scale-110 object-contain`}
          />
        ) : (
          <Icon className={`w-6 h-6 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
        )}
      </div>

      <div className="relative z-10 flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
            {item.title}
          </h3>
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors transform group-hover:rotate-45" />
        </div>
        <p className="text-sm text-slate-400 font-light leading-relaxed group-hover:text-slate-300 transition-colors">
          {item.description}
        </p>
      </div>
    </a>
  );
};

export default LinkCard;