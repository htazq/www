import { useEffect, useRef, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import {
  BLOCK_COUNT,
  BLOCK_SIDE,
  DISK_COUNT,
  blockCoordinates,
  blockIndex,
  type BlockStatus,
} from './model';
import { loadLocalBlocks, saveLocalBlocks } from './storage';
import './one-million-blocks.css';

interface Metrics {
  used: number;
  hot: number;
  lost: number;
  fragmentation: number;
  safety: 'HEALTHY' | 'DEGRADED' | 'DATA LOST';
}
const emptyMetrics: Metrics = { used: 0, hot: 0, lost: 0, fragmentation: 0, safety: 'HEALTHY' };

const safetyText: Record<Metrics['safety'], string> = {
  HEALTHY: '健康',
  DEGRADED: '降级',
  'DATA LOST': '数据丢失',
};

function encodeBlocks(blocks: Uint8Array) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < blocks.length; i += chunk)
    binary += String.fromCharCode(...blocks.subarray(i, i + chunk));
  return btoa(binary);
}

function decodeBlocks(value: string) {
  const binary = atob(value);
  const result = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) result[i] = binary.charCodeAt(i);
  return result;
}

export default function OneMillionBlocksPage() {
  usePageMetadata({
    title: 'One Million Blocks',
    description:
      'A local million-block storage simulator using Canvas, TypedArray, Worker, and IndexedDB.',
    path: '/experiments/one-million-blocks',
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef(new Uint8Array(BLOCK_COUNT));
  const workerRef = useRef<Worker | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const [tool, setTool] = useState<BlockStatus>(1);
  const [replication, setReplication] = useState(1);
  const [failedDisks, setFailedDisks] = useState<Set<number>>(new Set());
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [view, setView] = useState({ scale: 3, panX: 12, panY: 12 });
  const [pointer, setPointer] = useState<{
    x: number;
    y: number;
    mode: 'paint' | 'pan';
    panX: number;
    panY: number;
  } | null>(null);
  const [jumpX, setJumpX] = useState('0');
  const [jumpY, setJumpY] = useState('0');
  const [searchIndex, setSearchIndex] = useState('0');
  const [notice, setNotice] = useState('就绪。本地状态只保存在这个浏览器里。');
  const [, forceRender] = useState(0);

  const syncWorker = (blocks = blocksRef.current) => {
    const copy = blocks.slice();
    workerRef.current?.postMessage({ type: 'sync', buffer: copy.buffer }, [copy.buffer]);
  };
  const scheduleSave = () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(
      () => void saveLocalBlocks(blocksRef.current.slice()),
      700,
    );
  };

  useEffect(() => {
    const worker = new Worker(new URL('./blocks.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    worker.onmessage = (
      event: MessageEvent<{ type: string; metrics?: Metrics; buffer?: ArrayBuffer }>,
    ) => {
      if (event.data.type === 'metrics' && event.data.metrics) setMetrics(event.data.metrics);
      if (event.data.type === 'defrag-result' && event.data.buffer) {
        blocksRef.current = new Uint8Array(event.data.buffer);
        forceRender((value) => value + 1);
        scheduleSave();
        setNotice('Worker 已把碎片化的已用区块压实。');
      }
    };
    void loadLocalBlocks().then((stored) => {
      if (stored?.length === BLOCK_COUNT) {
        blocksRef.current = new Uint8Array(stored);
        setNotice('已从 IndexedDB 恢复本地区块状态。');
      }
      syncWorker(blocksRef.current);
      forceRender((value) => value + 1);
    });
    return () => {
      worker.terminate();
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = '#0d0a08';
      context.fillRect(0, 0, rect.width, rect.height);
      const stride = view.scale < 1.4 ? 4 : view.scale < 2 ? 2 : 1;
      const startX = Math.max(0, Math.floor(-view.panX / view.scale));
      const startY = Math.max(0, Math.floor(-view.panY / view.scale));
      const endX = Math.min(BLOCK_SIDE, Math.ceil((rect.width - view.panX) / view.scale));
      const endY = Math.min(BLOCK_SIDE, Math.ceil((rect.height - view.panY) / view.scale));
      for (let y = startY; y < endY; y += stride) {
        for (let x = startX; x < endX; x += stride) {
          const index = blockIndex(x, y);
          const value = blocksRef.current[index];
          if (value === 0) context.fillStyle = '#1c1712';
          else if (value === 1) context.fillStyle = '#4a6fd6';
          else context.fillStyle = '#f0a832';
          context.fillRect(
            view.panX + x * view.scale,
            view.panY + y * view.scale,
            Math.max(1, view.scale * stride - 0.35),
            Math.max(1, view.scale * stride - 0.35),
          );
        }
      }
      context.strokeStyle = 'rgba(242,234,217,.3)';
      context.strokeRect(view.panX, view.panY, BLOCK_SIDE * view.scale, BLOCK_SIDE * view.scale);
    };
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [view, metrics.used]);

  const canvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.floor((event.clientX - rect.left - view.panX) / view.scale),
      y: Math.floor((event.clientY - rect.top - view.panY) / view.scale),
    };
  };
  const paintAt = (x: number, y: number) => {
    const radius = view.scale < 1.5 ? 4 : 1;
    const indices: number[] = [];
    for (let yy = y - radius; yy <= y + radius; yy += 1)
      for (let xx = x - radius; xx <= x + radius; xx += 1) {
        const index = blockIndex(xx, yy);
        if (index >= 0) {
          blocksRef.current[index] = tool;
          indices.push(index);
        }
      }
    workerRef.current?.postMessage({ type: 'paint', indices, status: tool });
    scheduleSave();
    forceRender((value) => value + 1);
  };
  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = canvasPoint(event);
    const mode = event.shiftKey || event.button === 1 ? 'pan' : 'paint';
    setPointer({ x: event.clientX, y: event.clientY, mode, panX: view.panX, panY: view.panY });
    if (mode === 'paint') paintAt(point.x, point.y);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointer) return;
    if (pointer.mode === 'pan')
      setView((current) => ({
        ...current,
        panX: pointer.panX + event.clientX - pointer.x,
        panY: pointer.panY + event.clientY - pointer.y,
      }));
    else {
      const point = canvasPoint(event);
      paintAt(point.x, point.y);
    }
  };
  const jump = () => {
    const x = Math.max(0, Math.min(999, Number(jumpX) || 0));
    const y = Math.max(0, Math.min(999, Number(jumpY) || 0));
    const canvas = canvasRef.current;
    const width = canvas?.getBoundingClientRect().width ?? 700;
    const height = canvas?.getBoundingClientRect().height ?? 500;
    setView((current) => ({
      ...current,
      scale: Math.max(current.scale, 5),
      panX: width / 2 - x * Math.max(current.scale, 5),
      panY: height / 2 - y * Math.max(current.scale, 5),
    }));
    setNotice(`已定位到区块 (${x}, ${y})，索引 ${blockIndex(x, y).toLocaleString()}。`);
  };
  const searchBlock = () => {
    const index = Math.max(0, Math.min(BLOCK_COUNT - 1, Number(searchIndex) || 0));
    const coordinates = blockCoordinates(index);
    if (!coordinates) return;
    setJumpX(String(coordinates.x));
    setJumpY(String(coordinates.y));
    const canvas = canvasRef.current;
    const width = canvas?.getBoundingClientRect().width ?? 700;
    const height = canvas?.getBoundingClientRect().height ?? 500;
    const scale = Math.max(view.scale, 5);
    setView((current) => ({
      ...current,
      scale,
      panX: width / 2 - coordinates.x * scale,
      panY: height / 2 - coordinates.y * scale,
    }));
    setNotice(`已定位索引 ${index.toLocaleString()}，坐标 (${coordinates.x}, ${coordinates.y})。`);
  };
  const toggleDisk = (disk: number) => {
    const failed = new Set(failedDisks);
    if (failed.has(disk)) failed.delete(disk);
    else failed.add(disk);
    setFailedDisks(failed);
    workerRef.current?.postMessage({ type: 'disk', disk, failed: failed.has(disk) });
  };
  const hotWrite = () => {
    const indices = Array.from({ length: 2500 }, (_, i) => (i * 7919) % BLOCK_COUNT);
    for (const index of indices) blocksRef.current[index] = 2;
    workerRef.current?.postMessage({ type: 'paint', indices, status: 2 });
    scheduleSave();
    forceRender((value) => value + 1);
    setNotice('已模拟 2,500 次确定性的热点写入。');
  };
  const reset = () => {
    blocksRef.current = new Uint8Array(BLOCK_COUNT);
    setReplication(1);
    setFailedDisks(new Set());
    setMetrics(emptyMetrics);
    workerRef.current?.postMessage({ type: 'reset' });
    scheduleSave();
    forceRender((value) => value + 1);
    setNotice('所有本地区块与故障已重置。');
  };
  const exportSnapshot = () => {
    const payload = JSON.stringify({
      version: 1,
      side: BLOCK_SIDE,
      replication,
      blocks: encodeBlocks(blocksRef.current),
    });
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'at9-one-million-blocks.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const importSnapshot = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          blocks: string;
          replication?: number;
        };
        const decoded = decodeBlocks(parsed.blocks);
        if (decoded.length !== BLOCK_COUNT) throw new Error('Unexpected block count');
        blocksRef.current = decoded;
        const factor = Math.max(1, Math.min(3, parsed.replication ?? 1));
        setReplication(factor);
        syncWorker(decoded);
        workerRef.current?.postMessage({ type: 'replication', factor });
        scheduleSave();
        forceRender((value) => value + 1);
        setNotice('已导入本地快照。');
      } catch {
        setNotice('导入失败：快照文件无效。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <ExperimentHeader number="04" title="百万区块" label="本地模拟" />
      <div className="local-banner">
        <strong>本地模拟</strong>
        <span>状态只保存在这个浏览器里，这不是一个全球共享的画布。</span>
      </div>
      <section className="blocks-metrics">
        {[
          ['总容量', BLOCK_COUNT.toLocaleString()],
          ['已用区块', metrics.used.toLocaleString()],
          ['副本数', `${replication}×`],
          ['碎片率', `${metrics.fragmentation.toFixed(2)}%`],
          ['热点区块', metrics.hot.toLocaleString()],
          ['丢失区块', metrics.lost.toLocaleString()],
          ['数据安全', safetyText[metrics.safety]],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong
              className={
                label === '数据安全' ? metrics.safety.toLowerCase().replace(' ', '-') : ''
              }
            >
              {value}
            </strong>
          </div>
        ))}
      </section>
      <section className="blocks-layout">
        <aside className="blocks-tools">
          <span className="panel-label">区块工具</span>
          <div className="tool-row">
            <button
              className={`control-button ${tool === 1 ? 'active' : ''}`}
              onClick={() => setTool(1)}
            >
              已用
            </button>
            <button
              className={`control-button ${tool === 2 ? 'active' : ''}`}
              onClick={() => setTool(2)}
            >
              热点
            </button>
            <button
              className={`control-button ${tool === 0 ? 'active' : ''}`}
              onClick={() => setTool(0)}
            >
              擦除
            </button>
          </div>
          <span className="panel-label">视图</span>
          <div className="tool-row">
            <button
              className="control-button"
              onClick={() =>
                setView((current) => ({ ...current, scale: Math.min(16, current.scale * 1.35) }))
              }
            >
              放大 +
            </button>
            <button
              className="control-button"
              onClick={() =>
                setView((current) => ({ ...current, scale: Math.max(0.6, current.scale / 1.35) }))
              }
            >
              缩小 −
            </button>
            <button
              className="control-button"
              onClick={() => setView({ scale: 3, panX: 12, panY: 12 })}
            >
              复位视图
            </button>
          </div>
          <div className="jump-grid">
            <div className="field">
              <label htmlFor="jump-x">X（0–999）</label>
              <input
                id="jump-x"
                value={jumpX}
                onChange={(event) => setJumpX(event.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="field">
              <label htmlFor="jump-y">Y（0–999）</label>
              <input
                id="jump-y"
                value={jumpY}
                onChange={(event) => setJumpY(event.target.value)}
                inputMode="numeric"
              />
            </div>
            <button className="control-button" onClick={jump}>
              跳转
            </button>
          </div>
          <span className="panel-label">查找区块</span>
          <div className="field">
            <label htmlFor="block-index">区块索引 · 0–999999</label>
            <input
              id="block-index"
              value={searchIndex}
              onChange={(event) => setSearchIndex(event.target.value)}
              inputMode="numeric"
            />
          </div>
          <button className="control-button" onClick={searchBlock}>
            定位索引
          </button>
          <span className="panel-label">副本</span>
          <div className="field">
            <label htmlFor="replication">副本因子</label>
            <select
              id="replication"
              value={replication}
              onChange={(event) => {
                const factor = Number(event.target.value);
                setReplication(factor);
                workerRef.current?.postMessage({ type: 'replication', factor });
              }}
            >
              <option value="1">1× — 无副本</option>
              <option value="2">2× — 一份副本</option>
              <option value="3">3× — 两份副本</option>
            </select>
          </div>
          <span className="panel-label">虚拟磁盘</span>
          <div className="disk-grid">
            {Array.from({ length: DISK_COUNT }, (_, disk) => (
              <button
                key={disk}
                className={`control-button ${failedDisks.has(disk) ? 'danger active' : ''}`}
                onClick={() => toggleDisk(disk)}
              >
                D{disk} {failedDisks.has(disk) ? '故障' : '正常'}
              </button>
            ))}
          </div>
          <span className="panel-label">模拟操作</span>
          <div className="tool-column">
            <button className="control-button" onClick={hotWrite}>
              热点写入
            </button>
            <button
              className="control-button"
              onClick={() => workerRef.current?.postMessage({ type: 'defrag' })}
            >
              整理碎片
            </button>
            <button className="control-button danger" onClick={reset}>
              重置阵列
            </button>
          </div>
          <span className="panel-label">快照</span>
          <div className="tool-row">
            <button className="control-button" onClick={exportSnapshot}>
              导出
            </button>
            <label className="control-button import-label">
              导入
              <input
                type="file"
                accept="application/json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) importSnapshot(file);
                  event.currentTarget.value = '';
                }}
              />
            </label>
          </div>
        </aside>
        <div className="canvas-panel">
          <div className="canvas-heading">
            <span className="panel-label">阵列视口</span>
            <span>SHIFT + 拖动平移 · 直接拖动绘制</span>
          </div>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setPointer(null)}
            onPointerCancel={() => setPointer(null)}
            aria-label="可交互的百万区块阵列。也可以使用文本控件代替画布操作。"
          />
          <p className="canvas-notice" role="status">
            {notice}
          </p>
        </div>
        <aside className="block-inspector">
          <span className="panel-label">模型说明</span>
          <p>
            每个区块按 <code>index mod 8</code> 映射到一块主虚拟磁盘，副本轮转分布在不同的磁盘上。
          </p>
          <p>
            当持有某个区块副本的所有磁盘都故障时，这个已用区块就会丢失。Worker 会根据真实阵列重新计算安全性。
          </p>
          <p>
            空区块是暗色，已用区块是靛蓝，热点区块是琥珀。故障状态通过指标呈现，而不是覆盖你的数据。
          </p>
          <p>
            这个渲染器不依赖 OffscreenCanvas；普通 Canvas 路径就是兼容性回退，并且只绘制可见区块。
          </p>
          <div className="coordinate-note">
            <strong>索引公式</strong>
            <code>index = y × 1000 + x</code>
            <span>
              {blockCoordinates(metrics.used % BLOCK_COUNT)?.x},{' '}
              {blockCoordinates(metrics.used % BLOCK_COUNT)?.y}
            </span>
          </div>
        </aside>
      </section>
    </>
  );
}
