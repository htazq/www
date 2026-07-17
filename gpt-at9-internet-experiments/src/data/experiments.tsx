import type { ReactNode } from 'react';
import type { LocalizedText } from '../app/language';

export interface ExperimentSummary {
  number: string;
  slug: string;
  title: string;
  description: LocalizedText;
  detailDescription: LocalizedText;
  type: string;
  preview: ReactNode;
}

export const experiments: ExperimentSummary[] = [
  {
    number: '01',
    slug: 'stack-craft',
    title: 'STACK CRAFT',
    description: {
      zh: '将基础设施概念组合成一个可运行的 AI 数据中心。',
      en: 'Compose infrastructure concepts into a working AI data center.',
    },
    detailDescription: {
      zh: '从 Linux、进程、内存、磁盘和网络开始，组合确定性的技术配方，直到系统成为一个 AI 数据中心。',
      en: 'Begin with Linux, processes, memory, disks, and networks. Compose deterministic technology recipes until the system becomes an AI data center.',
    },
    type: 'SYSTEM COMPOSITION',
    preview: (
      <div className="preview-stack">
        <span>Linux</span>
        <b>+</b>
        <span>Disk</span>
        <b>→</b>
        <span>File System</span>
      </div>
    ),
  },
  {
    number: '02',
    slug: 'quorum',
    title: 'QUORUM',
    description: {
      zh: '破坏一个简化的高可用集群，并观察产生的后果。',
      en: 'Break a simplified HA cluster and inspect the consequences.',
    },
    detailDescription: {
      zh: '破坏一个简化的高可用集群，理解投票、网络分区、虚拟 IP 归属、隔离机制和脑裂风险。',
      en: 'Break a simplified high-availability cluster to understand votes, network partitions, Virtual IP ownership, fencing, and split-brain risk.',
    },
    type: 'STATE MACHINE',
    preview: (
      <svg
        className="preview-quorum"
        viewBox="0 0 320 130"
        aria-label="Simplified three-node cluster preview"
      >
        <line x1="70" y1="50" x2="250" y2="50" />
        <line x1="70" y1="50" x2="160" y2="108" />
        <line x1="250" y1="50" x2="160" y2="108" />
        <circle cx="70" cy="50" r="22" />
        <circle cx="250" cy="50" r="22" />
        <circle cx="160" cy="108" r="15" />
        <text x="70" y="55">
          A
        </text>
        <text x="250" y="55">
          B
        </text>
        <text x="160" y="112">
          W
        </text>
      </svg>
    ),
  },
  {
    number: '03',
    slug: 'internet-garden',
    title: 'INTERNET GARDEN',
    description: {
      zh: '跟随一次请求穿过城市、协议与物理距离。',
      en: 'Follow a request across cities, protocols, and physical distance.',
    },
    detailDescription: {
      zh: '选择两座城市，查看物理延迟下限、示意性的协议旅程，以及当前浏览器采集的页面计时数据。',
      en: 'Choose two cities and inspect the physical lower bound, an illustrative protocol journey, and measurements collected by this browser for the current page.',
    },
    type: 'NETWORK MAP',
    preview: (
      <div className="preview-route">
        <i />
        <span>Shanghai</span>
        <em />
        <span>Frankfurt</span>
        <i />
      </div>
    ),
  },
  {
    number: '04',
    slug: 'one-million-blocks',
    title: 'ONE MILLION BLOCKS',
    description: {
      zh: '操作一个完全运行在浏览器中的百万区块存储阵列。',
      en: 'Operate a one-million-block storage array held in your browser.',
    },
    detailDescription: {
      zh: '使用 Canvas、TypedArray、Web Worker 和 IndexedDB 模拟 1000 × 1000 存储阵列；所有指标都来自你在本地创建的状态。',
      en: 'A 1000 × 1000 storage array simulated with Canvas, TypedArray, a Web Worker, and IndexedDB. Every metric comes from the local state you create.',
    },
    type: 'CANVAS + WORKER',
    preview: (
      <div className="preview-blocks">
        {Array.from({ length: 84 }, (_, i) => (
          <i key={i} className={i % 11 === 0 ? 'hot' : i % 7 === 0 ? 'used' : ''} />
        ))}
      </div>
    ),
  },
  {
    number: '05',
    slug: 'latency',
    title: 'LATENCY',
    description: {
      zh: '把纳秒拉伸成人类时间，比较不同尺度。',
      en: 'Stretch nanoseconds into human time and compare worlds.',
    },
    detailDescription: {
      zh: '选择一个参考尺度，然后从 CPU 时间一路走到网络延迟、模型推理和人类协作。',
      en: 'Choose a reference scale, then walk from CPU time to network time, model inference, and human coordination.',
    },
    type: 'TIME SCALE',
    preview: (
      <div className="preview-latency">
        <span>1 ns</span>
        <i />
        <span>100 μs</span>
        <i />
        <span>100 ms</span>
      </div>
    ),
  },
  {
    number: '06',
    slug: 'data-scale',
    title: 'DATA SCALE',
    description: {
      zh: '沿着嵌套尺度，从一个字节走到一个艾字节。',
      en: 'Travel from one byte to one exabyte through nested scale.',
    },
    detailDescription: {
      zh: '从一个字节走到一个艾字节，切换十进制与二进制单位，检查换算假设，并用日常物体理解数据规模。',
      en: 'Enter one byte and continue to an exabyte. Toggle decimal and binary units, inspect assumptions, and see how many human-scale objects fit.',
    },
    type: 'DATA MAGNITUDE',
    preview: (
      <div className="preview-scale">
        <span>1B</span>
        <span>KB</span>
        <span>MB</span>
        <span>GB</span>
        <span>TB</span>
        <span>PB</span>
        <span>EB</span>
      </div>
    ),
  },
  {
    number: '07',
    slug: 'internet-archaeology',
    title: 'INTERNET ARCHAEOLOGY',
    description: {
      zh: '操作从 Telnet 到自主智能体的重构交互装置。',
      en: 'Operate reconstructed artifacts from Telnet to autonomous agents.',
    },
    detailDescription: {
      zh: '一座可动手操作的博物馆，展示受不同时代启发的原创界面重构，从明文终端一直到智能体控制循环。',
      en: 'A hands-on museum of era-inspired, original interface reconstructions—from clear-text terminals to agent control loops.',
    },
    type: 'INTERACTIVE MUSEUM',
    preview: (
      <div className="preview-history">
        <span>1970s</span>
        <b>—</b>
        <span>1990s</span>
        <b>—</b>
        <span>2020s</span>
      </div>
    ),
  },
];
