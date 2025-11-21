import React, { useState, useEffect, useRef } from 'react';

interface HackerTextProps {
  text: string;
  className?: string;
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*アィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ';

const HackerText: React.FC<HackerTextProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHovering = useRef(false);

  const startScramble = () => {
    isHovering.current = true;
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3; // Speed control
    }, 30);
  };

  const stopScramble = () => {
    isHovering.current = false;
    // Optional: Immediately resolve on mouse leave, or let it finish
    // setDisplayText(text); 
    // if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Trigger once on mount for effect
  useEffect(() => {
    startScramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h1 
      onMouseEnter={startScramble}
      className={`font-mono cursor-default ${className}`}
    >
      {displayText}
    </h1>
  );
};

export default HackerText;