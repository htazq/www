import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled upto given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                type="button"
                onClick={scrollToTop}
                className={`
          p-3 rounded-full bg-slate-900/80 border border-slate-700 text-cyan-400 
          shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md
          transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-slate-800 hover:text-cyan-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </button>
        </div>
    );
};

export default ScrollToTop;
