import {
  BLOCK_COUNT,
  blockCoordinates,
  blockIndex,
  calculateMetrics,
  isBlockLost,
  primaryDisk,
  replicaDisks,
} from './model';

describe('One Million Blocks model', () => {
  it('maps coordinates and indices exactly', () => {
    expect(blockIndex(0, 0)).toBe(0);
    expect(blockIndex(999, 999)).toBe(BLOCK_COUNT - 1);
    expect(blockCoordinates(1001)).toEqual({ x: 1, y: 1 });
    expect(blockIndex(1000, 0)).toBe(-1);
  });

  it('maps primary disks deterministically', () => {
    expect(primaryDisk(0)).toBe(0);
    expect(primaryDisk(9)).toBe(1);
    expect(replicaDisks(0, 3)).toEqual([0, 3, 6]);
  });

  it('loses a single-copy block when its disk fails', () => {
    expect(isBlockLost(8, 1, new Set([0]))).toBe(true);
    expect(isBlockLost(8, 2, new Set([0]))).toBe(false);
    expect(isBlockLost(8, 2, new Set([0, 3]))).toBe(true);
  });

  it('calculates metrics from real block state', () => {
    const blocks = new Uint8Array(32);
    blocks[0] = 1;
    blocks[1] = 2;
    blocks[8] = 1;
    const metrics = calculateMetrics(blocks, 1, new Set([0]));
    expect(metrics.used).toBe(3);
    expect(metrics.hot).toBe(1);
    expect(metrics.lost).toBe(2);
    expect(metrics.safety).toBe('DATA LOST');
  });
});
