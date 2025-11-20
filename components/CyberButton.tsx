import React from 'react';
import { useCyberSound } from '../hooks/useCyberSound';

interface CyberButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export const CyberButton: React.FC<CyberButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const { playHover, playClick } = useCyberSound();

    const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-mono font-bold uppercase tracking-widest transition-all duration-200 group overflow-hidden";
    const variants = {
        primary: "text-black bg-emerald-400 hover:bg-emerald-300 border border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.6)]",
        secondary: "text-emerald-400 bg-transparent border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]"
    };

    return (
        <a
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onMouseEnter={playHover}
            onClick={playClick}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Glitch effect layers */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 skew-x-12"></div>
        </a>
    );
};
