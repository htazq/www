export interface LatencyItem {
  id: string;
  name: string;
  nanoseconds: number;
  display: string;
  kind: 'typical' | 'range' | 'illustrative';
  context: string;
}

export const latencyItems: LatencyItem[] = [
  {
    id: 'instruction',
    name: 'CPU instruction',
    nanoseconds: 0.5,
    display: '~0.5 ns',
    kind: 'typical',
    context: 'A simple operation on a modern high-frequency CPU.',
  },
  {
    id: 'l1',
    name: 'L1 cache',
    nanoseconds: 1,
    display: '~1 ns',
    kind: 'typical',
    context: 'A cache hit close to the execution core.',
  },
  {
    id: 'l2',
    name: 'L2 cache',
    nanoseconds: 4,
    display: '~4 ns',
    kind: 'typical',
    context: 'A cache hit in the private or shared L2 hierarchy.',
  },
  {
    id: 'l3',
    name: 'L3 cache',
    nanoseconds: 12,
    display: '~12 ns',
    kind: 'typical',
    context: 'A last-level cache hit; topology and contention matter.',
  },
  {
    id: 'memory',
    name: 'Main memory',
    nanoseconds: 90,
    display: '70–120 ns',
    kind: 'range',
    context: 'Local DRAM access under favorable conditions.',
  },
  {
    id: 'nvme',
    name: 'NVMe SSD',
    nanoseconds: 100_000,
    display: '70–200 μs',
    kind: 'range',
    context: 'A small random read on a fast local SSD.',
  },
  {
    id: 'local-network',
    name: 'Local network',
    nanoseconds: 250_000,
    display: '100–500 μs',
    kind: 'range',
    context: 'A low-latency datacenter network round trip.',
  },
  {
    id: 'same-region',
    name: 'Same-region service',
    nanoseconds: 2_000_000,
    display: '1–5 ms',
    kind: 'range',
    context: 'A service call within one cloud region.',
  },
  {
    id: 'cross-region',
    name: 'Cross-region network',
    nanoseconds: 30_000_000,
    display: '20–60 ms',
    kind: 'range',
    context: 'A network round trip between nearby regions.',
  },
  {
    id: 'intercontinental',
    name: 'Intercontinental network',
    nanoseconds: 150_000_000,
    display: '100–250 ms',
    kind: 'range',
    context: 'A long-haul internet round trip constrained by distance.',
  },
  {
    id: 'database',
    name: 'Database query',
    nanoseconds: 12_000_000,
    display: '2–50 ms',
    kind: 'range',
    context: 'A simple indexed query; workload and storage dominate.',
  },
  {
    id: 'inference',
    name: 'AI model inference',
    nanoseconds: 800_000_000,
    display: '50 ms–several s',
    kind: 'illustrative',
    context: 'Highly dependent on model, batch size, hardware, and output length.',
  },
  {
    id: 'reaction',
    name: 'Human reaction',
    nanoseconds: 250_000_000,
    display: '200–300 ms',
    kind: 'range',
    context: 'A simple visual reaction by a person.',
  },
  {
    id: 'approval',
    name: 'Human approval',
    nanoseconds: 30_000_000_000,
    display: 'seconds to days',
    kind: 'illustrative',
    context: 'A deliberately simplified organizational handoff.',
  },
];
