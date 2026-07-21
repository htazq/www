import {
  formatDuration,
  nanosecondsToSeconds,
  scalePosition,
  scaledHumanSeconds,
} from './timeMath';

describe('latency unit conversion', () => {
  it('converts nanoseconds to seconds', () => expect(nanosecondsToSeconds(1_000_000_000)).toBe(1));
  it('scales a latency against a human reference', () =>
    expect(scaledHumanSeconds(100, 1)).toBe(100));
  it('formats multiple time ranges', () => {
    expect(formatDuration(0.5)).toContain('毫秒');
    expect(formatDuration(90)).toContain('分钟');
  });
  it('positions values on logarithmic and linear scales', () => {
    expect(scalePosition(10, 1, 100, 'log')).toBeCloseTo(0.5);
    expect(scalePosition(50, 0, 100, 'linear')).toBe(0.5);
  });
});
