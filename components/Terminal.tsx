import React from 'react';
import { Terminal as TerminalIcon, Circle } from 'lucide-react';

interface TerminalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-emerald-900/20 ${className}`}>
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <TerminalIcon size={14} className="text-slate-400" />
          <span className="text-xs font-mono text-slate-400">{title}</span>
        </div>
        <div className="flex space-x-1.5">
          <Circle size={10} className="fill-red-500 text-red-500" />
          <Circle size={10} className="fill-yellow-500 text-yellow-500" />
          <Circle size={10} className="fill-green-500 text-green-500" />
        </div>
      </div>
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
};