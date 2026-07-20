import { useEffect, useMemo, useRef, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cities, simplifiedLand } from './cities';
import { estimateRtt, haversineDistance, project, stageBreakdown } from './networkMath';
import './internet-garden.css';

interface NavigationMetrics {
  dns: number | null;
  tcp: number | null;
  tls: number | null;
  ttfb: number | null;
  download: number | null;
  total: number | null;
}

const stageNames: Record<string, string> = {
  dns: 'DNS 查询',
  tcp: 'TCP 连接',
  tls: 'TLS 握手',
  request: '请求处理',
  download: '内容下载',
};

const timingNames: Record<keyof NavigationMetrics, string> = {
  dns: 'DNS',
  tcp: 'TCP',
  tls: 'TLS',
  ttfb: '首字节',
  download: '下载',
  total: '总计',
};

function getNavigationMetrics(): NavigationMetrics {
  const entry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!entry) return { dns: null, tcp: null, tls: null, ttfb: null, download: null, total: null };
  const nonNegative = (value: number) => (value >= 0 ? value : null);
  return {
    dns: nonNegative(entry.domainLookupEnd - entry.domainLookupStart),
    tcp: nonNegative(entry.connectEnd - entry.connectStart),
    tls:
      entry.secureConnectionStart > 0
        ? nonNegative(entry.connectEnd - entry.secureConnectionStart)
        : null,
    ttfb: nonNegative(entry.responseStart - entry.requestStart),
    download: nonNegative(entry.responseEnd - entry.responseStart),
    total: nonNegative(entry.loadEventEnd - entry.startTime),
  };
}

export default function InternetGardenPage() {
  usePageMetadata({
    title: '网络花园',
    description: '探索示意性的网络路径与浏览器实测的页面导航计时。',
    path: '/experiments/internet-garden',
  });
  const reducedMotion = useReducedMotion();
  const [sourceId, setSourceId] = useState('shanghai');
  const [targetId, setTargetId] = useState('frankfurt');
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [ipInfo, setIpInfo] = useState<string>('不可用');
  const svgRef = useRef<SVGSVGElement>(null);
  const source = cities.find((city) => city.id === sourceId) ?? cities[0]!;
  const target = cities.find((city) => city.id === targetId) ?? cities[1]!;
  const distance = haversineDistance(source, target);
  const rtt = estimateRtt(distance);
  const stages = stageBreakdown(rtt);
  const measured = useMemo(() => getNavigationMetrics(), []);
  const from = project(source.lon, source.lat);
  const to = project(target.lon, target.lat);
  const midX = (from.x + to.x) / 2;
  const arcY = Math.min(from.y, to.y) - Math.min(85, Math.abs(from.x - to.x) * 0.18 + 25);
  const path = `M ${from.x} ${from.y} Q ${midX} ${arcY} ${to.x} ${to.y}`;

  useEffect(() => {
    const url = import.meta.env.VITE_IP_API_URL as string | undefined;
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) =>
        response.ok
          ? (response.json() as Promise<Record<string, unknown>>)
          : Promise.reject(new Error('IP endpoint failed')),
      )
      .then((data) =>
        setIpInfo(
          [data.city, data.region, data.country, data.org]
            .filter((value): value is string => typeof value === 'string')
            .join(' · ') || '不可用',
        ),
      )
      .catch(() => setIpInfo('不可用'));
    return () => controller.abort();
  }, []);

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    setView((current) => ({
      ...current,
      x: current.x + event.clientX - drag.x,
      y: current.y + event.clientY - drag.y,
    }));
    setDrag({ x: event.clientX, y: event.clientY });
  };

  const format = (value: number | null) =>
    value === null || !Number.isFinite(value) ? '不可用' : `${value.toFixed(1)} ms`;

  return (
    <>
      <ExperimentHeader number="03" title="网络花园" />
      <section className="garden-controls">
        <div className="field">
          <label htmlFor="source-city">起点城市</label>
          <select
            id="source-city"
            value={sourceId}
            onChange={(event) => setSourceId(event.target.value)}
          >
            {cities.map((city) => (
              <option value={city.id} key={city.id}>
                {city.name} · {city.country}
              </option>
            ))}
          </select>
        </div>
        <button
          className="swap-route"
          type="button"
          aria-label="交换起点与终点"
          onClick={() => {
            setSourceId(targetId);
            setTargetId(sourceId);
          }}
        >
          ⇄
        </button>
        <div className="field">
          <label htmlFor="target-city">终点城市</label>
          <select
            id="target-city"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
          >
            {cities.map((city) => (
              <option value={city.id} key={city.id}>
                {city.name} · {city.country}
              </option>
            ))}
          </select>
        </div>
        <div className="map-zoom">
          <button
            className="control-button"
            onClick={() =>
              setView((current) => ({ ...current, scale: Math.min(2.4, current.scale + 0.2) }))
            }
          >
            放大 +
          </button>
          <button
            className="control-button"
            onClick={() =>
              setView((current) => ({ ...current, scale: Math.max(0.8, current.scale - 0.2) }))
            }
          >
            缩小 −
          </button>
          <button className="control-button" onClick={() => setView({ x: 0, y: 0, scale: 1 })}>
            复位
          </button>
        </div>
      </section>
      <section className="garden-layout">
        <div className="world-panel">
          <div className="garden-heading">
            <span className="panel-label">示意路由</span>
            <span className="status-pill warn">估算值</span>
          </div>
          <svg
            ref={svgRef}
            className="world-map"
            viewBox="0 0 560 310"
            role="img"
            aria-label={`从${source.name}到${target.name}的示意路径`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDrag({ x: event.clientX, y: event.clientY });
            }}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDrag(null)}
            onPointerCancel={() => setDrag(null)}
          >
            <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
              {simplifiedLand.map((shape) => (
                <path className="land" d={shape} key={shape} />
              ))}
              <path id="route-path" className="route-arc" d={path} />
              {!reducedMotion && (
                <circle className="route-pulse" r="5">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path={path} />
                </circle>
              )}
              {cities.map((city) => {
                const point = project(city.lon, city.lat);
                const selected = city.id === sourceId || city.id === targetId;
                return (
                  <g
                    className={selected ? 'city selected' : 'city'}
                    key={city.id}
                    transform={`translate(${point.x} ${point.y})`}
                    onClick={() => (city.id !== sourceId ? setTargetId(city.id) : undefined)}
                  >
                    <circle r={selected ? 5 : 3} />
                    <text x="8" y="4">
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="route-summary">
            <div>
              <span>大圆距离</span>
              <strong>{Math.round(distance).toLocaleString()} km</strong>
            </div>
            <div>
              <span>光纤光速下限</span>
              <strong>{((distance * 2) / 200).toFixed(1)} ms</strong>
            </div>
            <div>
              <span>估算往返延迟</span>
              <strong>{rtt.toFixed(1)} ms</strong>
            </div>
          </div>
        </div>
        <aside className="route-stages">
          <div className="garden-heading">
            <span className="panel-label">请求旅程</span>
            <span className="status-pill warn">估算值</span>
          </div>
          {Object.entries(stages)
            .filter(([key]) => key !== 'total')
            .map(([key, value]) => (
              <div className="stage-row" key={key}>
                <span>{stageNames[key] ?? key.toUpperCase()}</span>
                <i
                  style={
                    { '--stage-width': `${Math.min(100, (value / stages.total) * 280)}%` } as React.CSSProperties
                  }
                />
                <strong>{value.toFixed(1)} ms</strong>
              </div>
            ))}
          <p>
            路由绕行、协议复用、服务器负载、拥塞与接入网都会显著改变实际延迟。
          </p>
        </aside>
        <section className="browser-timing">
          <div className="garden-heading">
            <span className="panel-label">当前页面导航计时</span>
            <span className="status-pill good">本浏览器实测</span>
          </div>
          <div className="timing-grid">
            {(Object.entries(measured) as [keyof NavigationMetrics, number | null][]).map(
              ([key, value]) => (
                <div key={key}>
                  <span>{timingNames[key]}</span>
                  <strong>{format(value)}</strong>
                </div>
              ),
            )}
          </div>
          <p>
            这些数值只描述这一次页面加载。缓存的连接或浏览器隐私控制可能让部分阶段为零或不可用。
          </p>
        </section>
        <aside className="network-info">
          <span className="panel-label">可选网络信息</span>
          <strong>{ipInfo}</strong>
          <p>
            把 <code>VITE_IP_API_URL</code> 指向你自己控制的、允许跨域的接口即可启用。默认不请求任何接口。
          </p>
        </aside>
      </section>
    </>
  );
}
