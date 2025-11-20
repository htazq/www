import React from 'react';

export const ArchitectureBg: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      {/* Base Grid - Static Technical Background */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      
      {/* Switched to 1600x900 (16:9) to prevent vertical cropping on desktop screens */}
      <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Neon Glow Filters */}
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradients */}
          <linearGradient id="traffic-flow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="cicd-flow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="earth-gradient" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
             <stop offset="80%" stopColor="#0ea5e9" stopOpacity="0.05" />
             <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ==================================================================================
            1. TOP LAYER: HOLOGRAPHIC EARTH (Global Traffic) 
            Position: Center X (800), Top Y (150)
           ================================================================================== */}
        <g transform="translate(800, 180)">
          {/* Atmosphere */}
          <circle r="300" fill="url(#earth-gradient)" />
          
          {/* Rotating Globe Wireframe */}
          <g className="animate-[spin_60s_linear_infinite]">
             {/* Main sphere outline */}
             <circle r="120" fill="#020617" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.4" />
             
             {/* Longitude Lines */}
             <ellipse cx="0" cy="0" rx="40" ry="120" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.2" />
             <ellipse cx="0" cy="0" rx="80" ry="120" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.2" />
             <line x1="0" y1="-120" x2="0" y2="120" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
             
             {/* Latitude Lines */}
             <ellipse cx="0" cy="0" rx="120" ry="40" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.2" />
             <ellipse cx="0" cy="0" rx="120" ry="80" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.2" />
             <line x1="-120" y1="0" x2="120" y2="0" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
          </g>

          {/* Orbiting Satellites */}
          <circle r="4" fill="#fff" filter="url(#glow-strong)">
            <animateMotion dur="10s" repeatCount="indefinite" path="M-160 0 A 160 40 0 1 0 160 0 A 160 40 0 1 0 -160 0" />
          </circle>
          <circle r="3" fill="#60a5fa" filter="url(#glow-strong)">
            <animateMotion dur="15s" begin="2s" repeatCount="indefinite" path="M-160 0 A 160 160 0 1 0 160 0 A 160 160 0 1 0 -160 0" transform="rotate(30)" />
          </circle>

          <text x="0" y="-150" textAnchor="middle" fill="#38bdf8" fontSize="14" fontFamily="monospace" letterSpacing="4" opacity="0.8">GLOBAL INTERNET TRAFFIC</text>
        </g>


        {/* ==================================================================================
            CONNECTIONS: EARTH -> EDGEONE (Downstream Traffic)
           ================================================================================== */}
        <g>
           {/* Paths from Earth (800, 300 - bottom of globe approx) to EdgeOne (800, 450) */}
           <path d="M700 280 Q750 380 780 450" fill="none" stroke="url(#traffic-flow)" strokeWidth="1.5" />
           <path d="M900 280 Q850 380 820 450" fill="none" stroke="url(#traffic-flow)" strokeWidth="1.5" />
           
           {/* Flowing Particles */}
           <circle r="2" fill="#60a5fa" filter="url(#glow-strong)">
              <animateMotion dur="2s" repeatCount="indefinite" path="M700 280 Q750 380 780 450" />
           </circle>
           <circle r="2" fill="#60a5fa" filter="url(#glow-strong)">
              <animateMotion dur="2.3s" begin="1s" repeatCount="indefinite" path="M900 280 Q850 380 820 450" />
           </circle>
        </g>


        {/* ==================================================================================
            2. MIDDLE LAYER: TENCENT EDGEONE (CDN Node)
            Position: Center X (800), Center Y (500)
           ================================================================================== */}
        <g transform="translate(800, 500)">
          {/* Outer Ring */}
          <circle r="80" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="10 10" opacity="0.3">
             <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="30s" repeatCount="indefinite" />
          </circle>

          {/* Hexagon Core */}
          <path d="M0 -40 L35 -20 L35 20 L0 40 L-35 20 L-35 -20 Z" fill="#0f172a" stroke="#60a5fa" strokeWidth="3" filter="url(#glow-strong)" />
          
          {/* EdgeOne Logo/Symbol Representation */}
          <path d="M-15 0 L0 15 L15 0 M0 -15 L0 15" stroke="#fff" strokeWidth="2" filter="url(#glow-strong)" />

          {/* Text Label */}
          <text x="60" y="5" textAnchor="start" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="monospace" filter="url(#glow-strong)">Tencent EdgeOne</text>
          <text x="60" y="25" textAnchor="start" fill="#94a3b8" fontSize="12" fontFamily="monospace">Pages Hosting & CDN</text>
          
          {/* Ripples */}
          <circle r="40" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0">
             <animate attributeName="r" values="40;100" dur="3s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="0.5;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>


        {/* ==================================================================================
            CONNECTIONS: CNB -> EDGEONE (Upstream CI/CD)
           ================================================================================== */}
        <g>
           {/* Pipeline Vertical */}
           <path d="M800 780 L800 550" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
           
           {/* Deploy Packets */}
           <circle r="4" fill="#10b981" filter="url(#glow-strong)">
             <animateMotion dur="2.5s" repeatCount="indefinite" path="M800 780 L800 550" />
             <animate attributeName="opacity" values="1;1;0" dur="2.5s" repeatCount="indefinite" />
           </circle>
           <circle r="4" fill="#10b981" filter="url(#glow-strong)">
             <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M800 780 L800 550" />
             <animate attributeName="opacity" values="1;1;0" dur="2.5s" repeatCount="indefinite" />
           </circle>
        </g>


        {/* ==================================================================================
            3. BOTTOM LAYER: CNB.COOL (DevOps Base)
            Position: Center X (800), Bottom Y (800)
           ================================================================================== */}
        <g transform="translate(800, 820)">
           {/* Base Platform */}
           <path d="M-120 0 L120 0 L100 40 L-100 40 Z" fill="#0f172a" stroke="#10b981" strokeWidth="2" filter="url(#glow-strong)" />
           
           {/* Decor Lines */}
           <line x1="-100" y1="10" x2="100" y2="10" stroke="#10b981" strokeWidth="1" opacity="0.3" />
           <line x1="-90" y1="20" x2="90" y2="20" stroke="#10b981" strokeWidth="1" opacity="0.2" />

           {/* Server Rack Lights */}
           <rect x="-80" y="30" width="10" height="4" fill="#10b981" />
           <rect x="-60" y="30" width="10" height="4" fill="#10b981" opacity="0.5" />
           <rect x="-40" y="30" width="10" height="4" fill="#10b981" />

           {/* Label */}
           <text x="0" y="-15" textAnchor="middle" fill="#34d399" fontSize="24" fontWeight="bold" fontFamily="monospace" filter="url(#glow-strong)">CNB.COOL</text>
           <text x="0" y="65" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="monospace" letterSpacing="2">CI/CD PIPELINE RUNNER</text>
        </g>

      </svg>
    </div>
  );
};
