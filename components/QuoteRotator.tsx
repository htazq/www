import React, { useState, useEffect } from 'react';
import { Quote } from '../types';

const QuoteRotator: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load quotes from JSON file
    fetch('/data/quotes.json')
      .then(response => response.json())
      .then(data => {
        setQuotes(data);
        if (data.length > 0) {
          setCurrentQuote(data[0]);
        }
      })
      .catch(error => console.error('Error loading quotes:', error));
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setIsFadingOut(true);
      
      // Wait for fade out animation
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % quotes.length;
        setCurrentIndex(nextIndex);
        setCurrentQuote(quotes[nextIndex]);
        setIsFadingOut(false);
      }, 800); // Match this with CSS transition duration
    }, 6000); // Change quote every 6 seconds

    return () => clearInterval(interval);
  }, [quotes, currentIndex]);

  // Helper to split text into interactive characters
  const renderInteractiveText = (text: string) => {
    return text.split('').map((char, idx) => (
      <span key={idx} className="flip-char inline-block whitespace-pre">
        {char}
      </span>
    ));
  };

  if (!currentQuote) {
    return (
      <div className="relative group p-6 md:p-10 rounded-2xl bg-slate-900/20 border border-white/5 backdrop-blur-md">
        <p className="text-lg md:text-xl text-slate-300 leading-loose font-light">
          Loading wisdom...
        </p>
      </div>
    );
  }

  return (
    <div className="relative group p-6 md:p-10 rounded-2xl bg-slate-900/20 border border-white/5 backdrop-blur-md transition-all duration-300 transform hover:bg-slate-800/30 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      {/* Corners */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-purple/50 group-hover:border-neon-purple transition-colors" />
      
      {/* Category Badge */}
      <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
        {currentQuote.category}
      </div>
      
      {/* Quote Content with Fade Transition */}
      <div className={`transition-opacity duration-700 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-lg md:text-xl text-slate-300 leading-loose font-light mb-4">
          {renderInteractiveText(currentQuote.content)}
        </p>
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute bottom-2 left-6 right-6 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse"
          style={{
            animation: 'slideProgress 6s linear infinite'
          }}
        />
      </div>
    </div>
  );
};

export default QuoteRotator;