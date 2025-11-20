import { useCallback, useRef, useEffect } from 'react';

export const useCyberSound = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        // Initialize Audio Context on user interaction to comply with browser policies
        const initAudio = () => {
            if (!audioContextRef.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContext();
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                gainNodeRef.current.gain.value = 0.1; // Low volume by default
            }
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        window.addEventListener('click', initAudio);
        return () => window.removeEventListener('click', initAudio);
    }, []);

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number) => {
        if (!audioContextRef.current || !gainNodeRef.current) return;

        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);

        gain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

        osc.connect(gain);
        gain.connect(gainNodeRef.current);

        osc.start();
        osc.stop(audioContextRef.current.currentTime + duration);
    }, []);

    const playHover = useCallback(() => {
        // High pitch short chirp
        playTone(800, 'sine', 0.05);
        setTimeout(() => playTone(1200, 'sine', 0.05), 30);
    }, [playTone]);

    const playClick = useCallback(() => {
        // Mechanical switch sound
        playTone(200, 'square', 0.1);
        playTone(150, 'sawtooth', 0.1);
    }, [playTone]);

    return { playHover, playClick };
};
