import { useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { kindNames, latencyItems } from './latencyData';
import { formatDuration, scalePosition, scaledHumanSeconds } from './timeMath';
import './latency.css';

const modeNames = { linear: '线性', log: '对数', narrative: '叙事' } as const;

export default function LatencyPage() {
  usePageMetadata({
    title: '延迟尺度',
    description: '把纳秒、微秒、毫秒与人类延迟放进同一条可探索的尺度。',
    path: '/experiments/latency',
  });
  const [benchmarkExponent, setBenchmarkExponent] = useState(0);
  const [mode, setMode] = useState<'linear' | 'log' | 'narrative'>('log');
  const [compareA, setCompareA] = useState('memory');
  const [compareB, setCompareB] = useState('intercontinental');
  const benchmarkNs = 10 ** benchmarkExponent;
  const a = latencyItems.find((item) => item.id === compareA) ?? latencyItems[0]!;
  const b = latencyItems.find((item) => item.id === compareB) ?? latencyItems[1]!;
  const min = Math.min(...latencyItems.map((item) => item.nanoseconds));
  const max = Math.max(...latencyItems.map((item) => item.nanoseconds));

  return (
    <>
      <ExperimentHeader number="05" title="延迟尺度" />
      <section className="latency-controls">
        <div className="benchmark-control">
          <span className="panel-label">参考尺度</span>
          <strong>{benchmarkNs.toLocaleString()} ns = 1 秒</strong>
          <input
            aria-label="延迟参考指数"
            type="range"
            min="-1"
            max="9"
            step="1"
            value={benchmarkExponent}
            onChange={(event) => setBenchmarkExponent(Number(event.target.value))}
          />
          <div>
            <span>0.1 ns</span>
            <span>1 s</span>
          </div>
        </div>
        <div>
          <span className="panel-label">视图模式</span>
          <div className="mode-buttons">
            {(['linear', 'log', 'narrative'] as const).map((item) => (
              <button
                className={`control-button ${mode === item ? 'active' : ''}`}
                key={item}
                onClick={() => setMode(item)}
              >
                {modeNames[item]}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="latency-layout">
        <div className={`latency-scale mode-${mode}`}>
          <div className="scale-axis">
            <span>更快</span>
            <i />
            <span>更慢</span>
          </div>
          {latencyItems.map((item, index) => {
            const position =
              mode === 'narrative'
                ? index / (latencyItems.length - 1)
                : scalePosition(item.nanoseconds, min, max, mode);
            const human = scaledHumanSeconds(item.nanoseconds, benchmarkNs);
            return (
              <article
                className="latency-stop"
                style={{ '--position': `${position * 100}%` } as React.CSSProperties}
                key={item.id}
                tabIndex={0}
              >
                <span className="latency-dot" />
                <div>
                  <p>{kindNames[item.kind]}</p>
                  <h2>{item.name}</h2>
                  <strong>{item.display}</strong>
                  <p>{item.context}</p>
                  <details>
                    <summary>查看换算</summary>
                    <code>
                      {item.nanoseconds.toLocaleString()} ns ÷ {benchmarkNs.toLocaleString()} ns × 1
                      秒 = {formatDuration(human)}
                    </code>
                  </details>
                </div>
                <em>{formatDuration(human)}</em>
              </article>
            );
          })}
        </div>
        <aside className="latency-compare">
          <span className="panel-label">比较两个世界</span>
          <div className="field">
            <label htmlFor="compare-a">对象 A</label>
            <select
              id="compare-a"
              value={compareA}
              onChange={(event) => setCompareA(event.target.value)}
            >
              {latencyItems.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="compare-b">对象 B</label>
            <select
              id="compare-b"
              value={compareB}
              onChange={(event) => setCompareB(event.target.value)}
            >
              {latencyItems.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ratio-readout">
            <strong>
              {(b.nanoseconds / a.nanoseconds).toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
              ×
            </strong>
            <p>
              按所选的代表值估算，「{b.name}」大约比「{a.name}」慢这么多倍。
            </p>
          </div>
          <div className="raw-values">
            <div>
              <span>{a.name}</span>
              <strong>{a.nanoseconds.toLocaleString()} ns</strong>
            </div>
            <div>
              <span>{b.name}</span>
              <strong>{b.nanoseconds.toLocaleString()} ns</strong>
            </div>
          </div>
          <p className="latency-disclaimer">
            这些是典型值、范围值或示意值——并非普适常数。CPU 代际、内存拓扑、存储队列深度、
            网络距离、软件栈与负载形态都会有影响。
          </p>
        </aside>
      </section>
    </>
  );
}
