import React from 'react';

export const Scanline: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Scanline moving bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-full w-full animate-scanline opacity-30"></div>

            {/* Static CRT lines */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwgMjU1LCA3MCwgMC4wNSkiLz48L3N2Zz4=')] z-50 pointer-events-none"></div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>
    );
};
