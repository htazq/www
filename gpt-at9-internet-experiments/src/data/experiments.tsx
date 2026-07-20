import type { ReactNode } from 'react';

export interface ExperimentSummary {
  number: string;
  slug: string;
  title: string;
  enTitle: string;
  description: string;
  detailDescription: string;
  type: string;
  color: string;
  preview: ReactNode;
}

export const experiments: ExperimentSummary[] = [
  {
    number: '01',
    slug: 'stack-craft',
    title: '堆栈合成',
    enTitle: 'STACK CRAFT',
    description: '把基础设施概念两两组合，一路合成出一座 AI 数据中心。',
    detailDescription:
      '从 Linux、进程、内存、磁盘与网络出发，按照确定性的技术配方不断组合，直到系统成为一座 AI 数据中心。',
    type: '系统合成',
    color: '#e8452c',
    preview: (
      <div className="preview-stack">
        <span>Linux</span>
        <b>+</b>
        <span>磁盘</span>
        <b>→</b>
        <span>文件系统</span>
      </div>
    ),
  },
  {
    number: '02',
    slug: 'quorum',
    title: '仲裁集群',
    enTitle: 'QUORUM',
    description: '亲手破坏一个高可用集群，观察投票、分区与脑裂的后果。',
    detailDescription:
      '破坏一个简化的高可用集群，理解投票、网络分区、虚拟 IP 归属、隔离机制与脑裂风险。',
    type: '状态机',
    color: '#3fae8a',
    preview: (
      <svg className="preview-quorum" viewBox="0 0 320 130" aria-label="三节点集群示意">
        <line x1="70" y1="50" x2="250" y2="50" />
        <line x1="70" y1="50" x2="160" y2="108" />
        <line x1="250" y1="50" x2="160" y2="108" />
        <circle cx="70" cy="50" r="22" />
        <circle cx="250" cy="50" r="22" />
        <circle cx="160" cy="108" r="15" />
        <text x="70" y="55">A</text>
        <text x="250" y="55">B</text>
        <text x="160" y="112">W</text>
      </svg>
    ),
  },
  {
    number: '03',
    slug: 'internet-garden',
    title: '网络花园',
    enTitle: 'INTERNET GARDEN',
    description: '跟随一次请求，穿过城市、协议与物理距离。',
    detailDescription:
      '选择两座城市，查看物理延迟下限、示意性的协议旅程，以及当前浏览器采集的页面计时数据。',
    type: '网络地图',
    color: '#4a6fd6',
    preview: (
      <div className="preview-route">
        <i />
        <span>上海</span>
        <em />
        <span>法兰克福</span>
        <i />
      </div>
    ),
  },
  {
    number: '04',
    slug: 'one-million-blocks',
    title: '百万区块',
    enTitle: 'ONE MILLION BLOCKS',
    description: '操作一个完全运行在浏览器里的百万区块存储阵列。',
    detailDescription:
      '使用 Canvas、TypedArray、Web Worker 与 IndexedDB 模拟 1000 × 1000 存储阵列；所有指标都来自你在本地创建的状态。',
    type: 'Canvas + Worker',
    color: '#f0a832',
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
    title: '延迟尺度',
    enTitle: 'LATENCY',
    description: '把纳秒拉伸成人类时间，比较两个世界的速度。',
    detailDescription:
      '选择一个参考尺度，然后从 CPU 时间一路走到网络延迟、模型推理与人类协作。',
    type: '时间尺度',
    color: '#9a5fd0',
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
    title: '数据量级',
    enTitle: 'DATA SCALE',
    description: '沿着嵌套尺度，从一个字节走到一个艾字节。',
    detailDescription:
      '从 1 字节走到 1 EB，切换十进制与二进制单位，检查换算假设，并用日常物体理解数据规模。',
    type: '数据规模',
    color: '#e87f2c',
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
    title: '互联网考古',
    enTitle: 'INTERNET ARCHAEOLOGY',
    description: '一座可动手操作的博物馆，从 Telnet 到自主智能体。',
    detailDescription:
      '操作受不同时代启发的原创界面重构——从明文终端，一直到智能体控制循环。',
    type: '交互博物馆',
    color: '#d4b48c',
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
