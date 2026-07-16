import type { ReactNode } from 'react';

export interface ExperimentSummary {
  number: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  preview: ReactNode;
}

export const experiments: ExperimentSummary[] = [
  {
    number: '01',
    slug: 'stack-craft',
    title: 'STACK CRAFT',
    description: 'Compose infrastructure concepts into a working AI data center.',
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
    description: 'Break a simplified HA cluster and inspect the consequences.',
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
    description: 'Follow a request across cities, protocols, and physical distance.',
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
    description: 'Operate a one-million-block storage array held in your browser.',
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
    description: 'Stretch nanoseconds into human time and compare worlds.',
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
    description: 'Travel from one byte to one exabyte through nested scale.',
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
    description: 'Operate reconstructed artifacts from Telnet to autonomous agents.',
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
