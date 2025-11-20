import React, { useState, useEffect } from 'react';
import { ArrowDown, Github, AtSign, Globe, Mail } from 'lucide-react';

export const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "sysadmin@htazq:~$ ./init_portfolio.sh --lang=zh_CN";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center z-10 pt-16">
      <div className="text-center space-y-8 px-4">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wider">
          System Monitor
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter glitch-text text-white mb-2" data-text="HTAZQ">
          海棠
        </h1>
        
        <div className="h-8 text-lg md:text-xl text-emerald-500 font-mono">
          {text}<span className="animate-pulse">_</span>
        </div>

        <p className="max-w-2xl text-slate-400 text-lg leading-relaxed">
          专注于 <span className="text-white font-bold">Linux 基础设施</span>、<span className="text-white font-bold">网络工程 (Network)</span>、<span className="text-white font-bold">Kubernetes 编排</span> 以及 <span className="text-white font-bold">量化交易策略 (Quant)</span>。
          <br className="hidden md:block" />
          在 DevOps 运维与金融科技的交叉领域，构建稳健的高性能系统。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <a href="https://github.com/htazq" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group">
            <Github className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
            <span>Github</span>
          </a>
          <a href="https://cnb.cool/htazq" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group">
            <Globe className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>CNB.cool</span>
          </a>
          <a href="mailto:huayuhuia@gmail.com" className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group">
            <Mail className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span>Email Me</span>
          </a>
          <div className="flex items-center space-x-2 text-slate-400">
            <AtSign className="w-5 h-5 text-emerald-400" />
            <span>at9.net</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-600">
        <ArrowDown size={24} />
      </div>
    </div>
  );
};