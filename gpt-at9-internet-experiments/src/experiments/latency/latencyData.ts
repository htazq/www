export interface LatencyItem {
  id: string;
  name: string;
  nanoseconds: number;
  display: string;
  kind: 'typical' | 'range' | 'illustrative';
  context: string;
}

export const kindNames: Record<LatencyItem['kind'], string> = {
  typical: '典型值',
  range: '范围值',
  illustrative: '示意值',
};

export const latencyItems: LatencyItem[] = [
  { id: 'instruction', name: 'CPU 指令', nanoseconds: 0.5, display: '~0.5 ns', kind: 'typical', context: '现代高频 CPU 上的一次简单运算。' },
  { id: 'l1', name: 'L1 缓存', nanoseconds: 1, display: '~1 ns', kind: 'typical', context: '离执行核心最近的缓存命中。' },
  { id: 'l2', name: 'L2 缓存', nanoseconds: 4, display: '~4 ns', kind: 'typical', context: '私有或共享 L2 层级的缓存命中。' },
  { id: 'l3', name: 'L3 缓存', nanoseconds: 12, display: '~12 ns', kind: 'typical', context: '末级缓存命中；拓扑与争用影响很大。' },
  { id: 'memory', name: '主内存', nanoseconds: 90, display: '70–120 ns', kind: 'range', context: '理想条件下的本地 DRAM 访问。' },
  { id: 'nvme', name: 'NVMe 固态盘', nanoseconds: 100_000, display: '70–200 μs', kind: 'range', context: '高速本地 SSD 上的一次小块随机读。' },
  { id: 'local-network', name: '本地网络', nanoseconds: 250_000, display: '100–500 μs', kind: 'range', context: '低延迟数据中心网络的一次往返。' },
  { id: 'same-region', name: '同区域服务', nanoseconds: 2_000_000, display: '1–5 ms', kind: 'range', context: '同一个云区域内的一次服务调用。' },
  { id: 'cross-region', name: '跨区域网络', nanoseconds: 30_000_000, display: '20–60 ms', kind: 'range', context: '相邻区域之间的一次网络往返。' },
  { id: 'intercontinental', name: '跨洲网络', nanoseconds: 150_000_000, display: '100–250 ms', kind: 'range', context: '受物理距离约束的长途互联网往返。' },
  { id: 'database', name: '数据库查询', nanoseconds: 12_000_000, display: '2–50 ms', kind: 'range', context: '一次简单的索引查询；负载与存储占主导。' },
  { id: 'inference', name: 'AI 模型推理', nanoseconds: 800_000_000, display: '50 ms–数秒', kind: 'illustrative', context: '高度依赖模型、批大小、硬件与输出长度。' },
  { id: 'reaction', name: '人类反应', nanoseconds: 250_000_000, display: '200–300 ms', kind: 'range', context: '人的一次简单视觉反应。' },
  { id: 'approval', name: '人类审批', nanoseconds: 30_000_000_000, display: '数秒到数天', kind: 'illustrative', context: '一次被刻意简化的组织协作交接。' },
];
