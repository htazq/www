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
          // Randomly select initial quote
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentIndex(randomIndex);
          setCurrentQuote(data[randomIndex]);
        }
      })
      .catch(error => console.error('Error loading quotes:', error));
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;

    // Calculate total animation time based on text length
    // 50ms per char + 800ms base animation time
    const currentTextLength = quotes[currentIndex]?.content.length || 0;
    const animationDuration = currentTextLength * 50 + 800;
    const displayDuration = 4000; // Time to stay visible

    const interval = setTimeout(() => {
      setIsFadingOut(true);

      // Wait for fade out animation to complete
      setTimeout(() => {
        let nextIndex;
        if (quotes.length <= 1) {
          nextIndex = 0;
        } else {
          do {
            nextIndex = Math.floor(Math.random() * quotes.length);
          } while (nextIndex === currentIndex);
        }

        setCurrentIndex(nextIndex);
        setCurrentQuote(quotes[nextIndex]);
        setIsFadingOut(false);
      }, animationDuration);
    }, displayDuration + animationDuration);

    return () => clearTimeout(interval);
  }, [quotes, currentIndex]);

  // Helper to split text into interactive characters
  const renderInteractiveText = (text: string) => {
    return text.split('').map((char, idx) => (
      <span
        key={idx}
        className={`flip-char inline-block whitespace-pre ${isFadingOut ? 'animate-fly-out' : 'animate-fly-in'
          }`}
        style={{
          animationDelay: `${idx * 50}ms`
        }}
      >
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

      {/* Quote Content */}
      <div>
        <p className="text-lg md:text-xl text-slate-300 leading-loose font-light mb-4">
          {renderInteractiveText(currentQuote.content)}
        </p>
      </div>
    </div>
  );
};

export default QuoteRotator;