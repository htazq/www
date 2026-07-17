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
  const [notice, setNotice] = useState('Ready. Local state is stored only in this browser.');
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
        setNotice('Fragmented used blocks were compacted by the Worker.');
      }
    };
    void loadLocalBlocks().then((stored) => {
      if (stored?.length === BLOCK_COUNT) {
        blocksRef.current = new Uint8Array(stored);
        setNotice('Restored local block state from IndexedDB.');
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
      context.fillStyle = '#0c0f12';
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
          if (value === 0) context.fillStyle = '#171c21';
          else if (value === 1) context.fillStyle = '#4f79ff';
          else context.fillStyle = '#e8a94f';
          context.fillRect(
            view.panX + x * view.scale,
            view.panY + y * view.scale,
            Math.max(1, view.scale * stride - 0.35),
            Math.max(1, view.scale * stride - 0.35),
          );
        }
      }
      context.strokeStyle = 'rgba(232,228,220,.3)';
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
    setNotice(`Centered block (${x}, ${y}), index ${blockIndex(x, y).toLocaleString()}.`);
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
    setNotice(
      `Located block index ${index.toLocaleString()} at (${coordinates.x}, ${coordinates.y}).`,
    );
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
    setNotice('Simulated 2,500 deterministic hotspot writes.');
  };
  const reset = () => {
    blocksRef.current = new Uint8Array(BLOCK_COUNT);
    setReplication(1);
    setFailedDisks(new Set());
    setMetrics(emptyMetrics);
    workerRef.current?.postMessage({ type: 'reset' });
    scheduleSave();
    forceRender((value) => value + 1);
    setNotice('All local blocks and failures were reset.');
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
        setNotice('Imported local snapshot.');
      } catch {
        setNotice('Import failed: invalid snapshot file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <ExperimentHeader number="04" title="ONE MILLION BLOCKS" label="LOCAL SIMULATION" />
      <div className="local-banner">
        <strong>LOCAL SIMULATION</strong>
        <span>Stored only in this browser. This is not a global shared canvas.</span>
      </div>
      <section className="blocks-metrics">
        {[
          ['CAPACITY', BLOCK_COUNT.toLocaleString()],
          ['USED BLOCKS', metrics.used.toLocaleString()],
          ['REPLICATION', `${replication}×`],
          ['FRAGMENTATION', `${metrics.fragmentation.toFixed(2)}%`],
          ['HOT BLOCKS', metrics.hot.toLocaleString()],
          ['LOST BLOCKS', metrics.lost.toLocaleString()],
          ['DATA SAFETY', metrics.safety],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong
              className={
                label === 'DATA SAFETY' ? metrics.safety.toLowerCase().replace(' ', '-') : ''
              }
            >
              {value}
            </strong>
          </div>
        ))}
      </section>
      <section className="blocks-layout">
        <aside className="blocks-tools">
          <span className="panel-label">BLOCK TOOL</span>
          <div className="tool-row">
            <button
              className={`control-button ${tool === 1 ? 'active' : ''}`}
              onClick={() => setTool(1)}
            >
              USED
            </button>
            <button
              className={`control-button ${tool === 2 ? 'active' : ''}`}
              onClick={() => setTool(2)}
            >
              HOT
            </button>
            <button
              className={`control-button ${tool === 0 ? 'active' : ''}`}
              onClick={() => setTool(0)}
            >
              ERASE
            </button>
          </div>
          <span className="panel-label">VIEW</span>
          <div className="tool-row">
            <button
              className="control-button"
              onClick={() =>
                setView((current) => ({ ...current, scale: Math.min(16, current.scale * 1.35) }))
              }
            >
              ZOOM +
            </button>
            <button
              className="control-button"
              onClick={() =>
                setView((current) => ({ ...current, scale: Math.max(0.6, current.scale / 1.35) }))
              }
            >
              ZOOM −
            </button>
            <button
              className="control-button"
              onClick={() => setView({ scale: 3, panX: 12, panY: 12 })}
            >
              RESET VIEW
            </button>
          </div>
          <div className="jump-grid">
            <div className="field">
              <label htmlFor="jump-x">X (0–999)</label>
              <input
                id="jump-x"
                value={jumpX}
                onChange={(event) => setJumpX(event.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="field">
              <label htmlFor="jump-y">Y (0–999)</label>
              <input
                id="jump-y"
                value={jumpY}
                onChange={(event) => setJumpY(event.target.value)}
                inputMode="numeric"
              />
            </div>
            <button className="control-button" onClick={jump}>
              JUMP
            </button>
          </div>
          <span className="panel-label">SEARCH BLOCK</span>
          <div className="field">
            <label htmlFor="block-index">BLOCK INDEX · 0–999999</label>
            <input
              id="block-index"
              value={searchIndex}
              onChange={(event) => setSearchIndex(event.target.value)}
              inputMode="numeric"
            />
          </div>
          <button className="control-button" onClick={searchBlock}>
            LOCATE INDEX
          </button>
          <span className="panel-label">REPLICATION</span>
          <div className="field">
            <label htmlFor="replication">REPLICATION FACTOR</label>
            <select
              id="replication"
              value={replication}
              onChange={(event) => {
                const factor = Number(event.target.value);
                setReplication(factor);
                workerRef.current?.postMessage({ type: 'replication', factor });
              }}
            >
              <option value="1">1× — no replica</option>
              <option value="2">2× — one replica</option>
              <option value="3">3× — two replicas</option>
            </select>
          </div>
          <span className="panel-label">VIRTUAL DISKS</span>
          <div className="disk-grid">
            {Array.from({ length: DISK_COUNT }, (_, disk) => (
              <button
                key={disk}
                className={`control-button ${failedDisks.has(disk) ? 'danger active' : ''}`}
                onClick={() => toggleDisk(disk)}
              >
                D{disk} {failedDisks.has(disk) ? 'FAILED' : 'OK'}
              </button>
            ))}
          </div>
          <span className="panel-label">SIMULATION</span>
          <div className="tool-column">
            <button className="control-button" onClick={hotWrite}>
              HOTSPOT WRITES
            </button>
            <button
              className="control-button"
              onClick={() => workerRef.current?.postMessage({ type: 'defrag' })}
            >
              DEFRAGMENT
            </button>
            <button className="control-button danger" onClick={reset}>
              RESET ARRAY
            </button>
          </div>
          <span className="panel-label">SNAPSHOT</span>
          <div className="tool-row">
            <button className="control-button" onClick={exportSnapshot}>
              EXPORT
            </button>
            <label className="control-button import-label">
              IMPORT
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
            <span className="panel-label">ARRAY VIEWPORT</span>
            <span>SHIFT + DRAG TO PAN · DRAG TO PAINT</span>
          </div>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setPointer(null)}
            onPointerCancel={() => setPointer(null)}
            aria-label="Interactive one-million-block array. Use the text controls as an alternative to direct canvas input."
          />
          <p className="canvas-notice" role="status">
            {notice}
          </p>
        </div>
        <aside className="block-inspector">
          <span className="panel-label">MODEL NOTES</span>
          <p>
            Each block maps to a primary virtual disk by <code>index mod 8</code>. Replicas rotate
            across different disks.
          </p>
          <p>
            When every disk holding a block copy fails, that used block becomes lost. The Worker
            recalculates safety from the actual array.
          </p>
          <p>
            Empty blocks are dark, used blocks cobalt, hotspot blocks amber. Failed state is
            reported through metrics rather than overwriting user data.
          </p>
          <p>
            OffscreenCanvas is not required for this renderer; the normal Canvas path is the
            compatibility fallback and only visible blocks are drawn.
          </p>
          <div className="coordinate-note">
            <strong>INDEX FORMULA</strong>
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
