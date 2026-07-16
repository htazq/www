export const BLOCK_SIDE = 1000;
export const BLOCK_COUNT = BLOCK_SIDE * BLOCK_SIDE;
export const DISK_COUNT = 8;

export type BlockStatus = 0 | 1 | 2;

export function blockIndex(x: number, y: number) {
  if (
    !Number.isInteger(x) ||
    !Number.isInteger(y) ||
    x < 0 ||
    y < 0 ||
    x >= BLOCK_SIDE ||
    y >= BLOCK_SIDE
  )
    return -1;
  return y * BLOCK_SIDE + x;
}

export function blockCoordinates(index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= BLOCK_COUNT) return null;
  return { x: index % BLOCK_SIDE, y: Math.floor(index / BLOCK_SIDE) };
}

export function primaryDisk(index: number, diskCount = DISK_COUNT) {
  return index % diskCount;
}

export function replicaDisks(index: number, replicationFactor: number, diskCount = DISK_COUNT) {
  const primary = primaryDisk(index, diskCount);
  const factor = Math.max(1, Math.min(replicationFactor, diskCount));
  return Array.from({ length: factor }, (_, offset) => (primary + offset * 3) % diskCount);
}

export function isBlockLost(
  index: number,
  replicationFactor: number,
  failedDisks: ReadonlySet<number>,
  diskCount = DISK_COUNT,
) {
  return replicaDisks(index, replicationFactor, diskCount).every((disk) => failedDisks.has(disk));
}

export function calculateFragmentation(blocks: Uint8Array) {
  let used = 0;
  let transitions = 0;
  let previousUsed = false;
  for (const value of blocks) {
    const currentUsed = value !== 0;
    if (currentUsed) used += 1;
    if (currentUsed !== previousUsed) transitions += 1;
    previousUsed = currentUsed;
  }
  if (used === 0) return 0;
  return Math.min(100, (transitions / (used * 2)) * 100);
}

export function calculateMetrics(
  blocks: Uint8Array,
  replicationFactor: number,
  failedDisks: ReadonlySet<number>,
) {
  let used = 0;
  let hot = 0;
  let lost = 0;
  for (let index = 0; index < blocks.length; index += 1) {
    const value = blocks[index];
    if (value === undefined || value === 0) continue;
    used += 1;
    if (value === 2) hot += 1;
    if (isBlockLost(index, replicationFactor, failedDisks)) lost += 1;
  }
  return {
    used,
    hot,
    lost,
    fragmentation: calculateFragmentation(blocks),
    safety: lost > 0 ? 'DATA LOST' : failedDisks.size > 0 ? 'DEGRADED' : 'HEALTHY',
  } as const;
}
