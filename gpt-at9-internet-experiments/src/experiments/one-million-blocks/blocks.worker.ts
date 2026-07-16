/// <reference lib="webworker" />
import { BLOCK_COUNT, calculateMetrics } from './model';

let blocks = new Uint8Array(BLOCK_COUNT);
let replicationFactor = 1;
const failedDisks = new Set<number>();

function postMetrics() {
  self.postMessage({
    type: 'metrics',
    metrics: calculateMetrics(blocks, replicationFactor, failedDisks),
  });
}

self.addEventListener(
  'message',
  (
    event: MessageEvent<
      | { type: 'sync'; buffer: ArrayBuffer }
      | { type: 'paint'; indices: number[]; status: number }
      | { type: 'replication'; factor: number }
      | { type: 'disk'; disk: number; failed: boolean }
      | { type: 'reset' }
      | { type: 'defrag' }
    >,
  ) => {
    const message = event.data;
    if (message.type === 'sync') blocks = new Uint8Array(message.buffer);
    if (message.type === 'paint')
      for (const index of message.indices)
        if (index >= 0 && index < blocks.length) blocks[index] = message.status;
    if (message.type === 'replication') replicationFactor = message.factor;
    if (message.type === 'disk') {
      if (message.failed) failedDisks.add(message.disk);
      else failedDisks.delete(message.disk);
    }
    if (message.type === 'reset') {
      blocks = new Uint8Array(BLOCK_COUNT);
      failedDisks.clear();
      replicationFactor = 1;
    }
    if (message.type === 'defrag') {
      const compact = new Uint8Array(BLOCK_COUNT);
      let cursor = 0;
      for (const value of blocks) if (value !== 0) compact[cursor++] = value;
      blocks = compact;
      const output = compact.slice();
      self.postMessage({ type: 'defrag-result', buffer: output.buffer }, [output.buffer]);
    }
    postMetrics();
  },
);
