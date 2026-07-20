import { useEffect, useRef, useState } from 'react';

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => () => void contextRef.current?.close(), []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      const AudioContextCtor = window.AudioContext;
      if (!AudioContextCtor) return;
      const context = new AudioContextCtor();
      contextRef.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 440;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.13);
    }
  };

  return (
    <button className="sound-toggle" type="button" aria-pressed={enabled} onClick={toggle}>
      音效 {enabled ? '开' : '关'}
    </button>
  );
}
