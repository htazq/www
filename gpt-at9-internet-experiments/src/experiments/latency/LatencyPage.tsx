import { useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { latencyItems } from './latencyData';
import { formatDuration, scalePosition, scaledHumanSeconds } from './timeMath';
import './latency.css';

export default function LatencyPage() {
  usePageMetadata({
    title: 'Latency',
    description:
      'Translate nanoseconds, microseconds, milliseconds, and human delays into one explorable scale.',
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
      <ExperimentHeader
        number="05"
        title="LATENCY"
        description="Choose a reference scale, then walk from CPU time to network time, model inference, and human coordination."
      />
      <section className="latency-controls">
        <div className="benchmark-control">
          <span className="panel-label">REFERENCE</span>
          <strong>{benchmarkNs.toLocaleString()} ns = 1 second</strong>
          <input
            aria-label="Latency reference exponent"
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
          <span className="panel-label">VIEW MODE</span>
          <div className="mode-buttons">
            {(['linear', 'log', 'narrative'] as const).map((item) => (
              <button
                className={`control-button ${mode === item ? 'active' : ''}`}
                key={item}
                onClick={() => setMode(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="latency-layout">
        <div className={`latency-scale mode-${mode}`}>
          <div className="scale-axis">
            <span>FASTER</span>
            <i />
            <span>SLOWER</span>
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
                  <p>{item.kind.toUpperCase()} VALUE</p>
                  <h2>{item.name}</h2>
                  <strong>{item.display}</strong>
                  <p>{item.context}</p>
                  <details>
                    <summary>VIEW CONVERSION</summary>
                    <code>
                      {item.nanoseconds.toLocaleString()} ns ÷ {benchmarkNs.toLocaleString()} ns × 1
                      s = {formatDuration(human)}
                    </code>
                  </details>
                </div>
                <em>{formatDuration(human)}</em>
              </article>
            );
          })}
        </div>
        <aside className="latency-compare">
          <span className="panel-label">COMPARE TWO WORLDS</span>
          <div className="field">
            <label htmlFor="compare-a">ITEM A</label>
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
            <label htmlFor="compare-b">ITEM B</label>
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
              {b.name} is approximately this many times slower than {a.name} using the selected
              representative values.
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
            These are typical, ranged, or illustrative values—not universal constants. CPU
            generation, memory topology, storage queue depth, network distance, software stacks, and
            workload shape all matter.
          </p>
        </aside>
      </section>
    </>
  );
}
