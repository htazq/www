export function nanosecondsToSeconds(value: number) {
  return value / 1_000_000_000;
}
export function scaledHumanSeconds(
  latencyNs: number,
  benchmarkNs: number,
  benchmarkHumanSeconds = 1,
) {
  if (benchmarkNs <= 0 || benchmarkHumanSeconds <= 0) return 0;
  return (latencyNs / benchmarkNs) * benchmarkHumanSeconds;
}
export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return 'UNAVAILABLE';
  if (seconds < 0.001) return `${(seconds * 1_000_000).toFixed(2)} μs`;
  if (seconds < 1) return `${(seconds * 1000).toFixed(2)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(2)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} h`;
  if (seconds < 31_536_000) return `${(seconds / 86400).toFixed(2)} days`;
  return `${(seconds / 31_536_000).toFixed(2)} years`;
}
export function scalePosition(value: number, min: number, max: number, mode: 'linear' | 'log') {
  if (mode === 'linear') return (value - min) / (max - min);
  const safeMin = Math.max(min, Number.EPSILON);
  return (Math.log10(value) - Math.log10(safeMin)) / (Math.log10(max) - Math.log10(safeMin));
}
