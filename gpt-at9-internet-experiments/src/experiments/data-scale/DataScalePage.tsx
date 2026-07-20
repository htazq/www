import { useMemo, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { scaleLevels } from './scaleData';
import {
  autoUnit,
  bytesForUnit,
  estimateTextBytes,
  formatNumber,
  storageDeviceCount,
  type UnitSystem,
} from './scaleMath';
import './data-scale.css';

export default function DataScalePage() {
  usePageMetadata({
    title: '数据量级',
    description: '用 SI 与 IEC 单位，从 1 字节探索到 1 艾字节。',
    path: '/experiments/data-scale',
  });
  const [system, setSystem] = useState<UnitSystem>('SI');
  const [bytesInput, setBytesInput] = useState('1000000000');
  const [textCharacters, setTextCharacters] = useState('1000');
  const [textType, setTextType] = useState<'ascii' | 'chinese' | 'custom'>('ascii');
  const [customBytes, setCustomBytes] = useState('2');
  const [photoMb, setPhotoMb] = useState('4');
  const [videoMbps, setVideoMbps] = useState('8');
  const [videoMinutes, setVideoMinutes] = useState('60');
  const [ssdTb, setSsdTb] = useState('3.84');
  const [drivesPerRack, setDrivesPerRack] = useState('48');
  const [copied, setCopied] = useState(false);
  const bytes = Math.max(0, Number(bytesInput) || 0);
  const selected = autoUnit(bytes, system);
  const textBpc =
    textType === 'ascii' ? 1 : textType === 'chinese' ? 3 : Math.max(0, Number(customBytes) || 0);
  const textBytes = estimateTextBytes(Number(textCharacters) || 0, textBpc);
  const photoBytes = (Number(photoMb) || 0) * 1_000_000;
  const videoBytes =
    (((Number(videoMbps) || 0) * 1_000_000) / 8) * (Number(videoMinutes) || 0) * 60;
  const ssdBytes = (Number(ssdTb) || 0) * 1_000_000_000_000;
  const rackBytes = ssdBytes * (Number(drivesPerRack) || 0);
  const assumptions = useMemo(
    () => [
      {
        label: '文本字符',
        value: `${formatNumber(bytes / Math.max(textBpc, 0.000001), 0)} 个字符`,
        detail: `按当前假设每字符 ${textBpc} 字节`,
      },
      {
        label: '压缩照片',
        value: `${formatNumber(storageDeviceCount(bytes, photoBytes), 2)} 张`,
        detail: `每张 ${photoMb} MB`,
      },
      {
        label: '1080P 视频',
        value: `${formatNumber(bytes / Math.max(videoBytes, 1), 3)} 小时`,
        detail: `${videoMbps} Mb/s，每段 ${videoMinutes} 分钟`,
      },
      {
        label: '固态盘',
        value: `${formatNumber(storageDeviceCount(bytes, ssdBytes), 3)} 块`,
        detail: `每块 ${ssdTb} TB（十进制）`,
      },
      {
        label: '机架',
        value: `${formatNumber(storageDeviceCount(bytes, rackBytes), 4)} 个`,
        detail: `每机架 ${drivesPerRack} × ${ssdTb} TB SSD`,
      },
    ],
    [
      bytes,
      drivesPerRack,
      photoBytes,
      photoMb,
      rackBytes,
      ssdBytes,
      ssdTb,
      textBpc,
      videoBytes,
      videoMbps,
      videoMinutes,
    ],
  );
  const resultText = `${bytes.toLocaleString()} 字节 = ${formatNumber(selected.value, 6)} ${selected.unit}（${system}）`;
  const copyResult = async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(resultText);
    else {
      const area = document.createElement('textarea');
      area.value = resultText;
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      <ExperimentHeader number="06" title="数据量级" />
      <section className="scale-controls">
        <div>
          <span className="panel-label">单位制</span>
          <div className="mode-buttons">
            <button
              className={`control-button ${system === 'SI' ? 'active' : ''}`}
              onClick={() => setSystem('SI')}
            >
              SI · 1000
            </button>
            <button
              className={`control-button ${system === 'IEC' ? 'active' : ''}`}
              onClick={() => setSystem('IEC')}
            >
              IEC · 1024
            </button>
          </div>
        </div>
        <div className="field">
          <label htmlFor="byte-input">任意字节数</label>
          <input
            id="byte-input"
            inputMode="decimal"
            value={bytesInput}
            onChange={(event) => setBytesInput(event.target.value)}
          />
        </div>
        <div className="scale-result">
          <span>自动单位</span>
          <strong>
            {formatNumber(selected.value, 6)} {selected.unit}
          </strong>
          <button className="control-button" onClick={() => void copyResult()}>
            {copied ? '已复制' : '复制结果'}
          </button>
        </div>
      </section>
      <section className="scale-layout">
        <div className="scale-journey">
          {scaleLevels.map((level) => {
            const unitBytes = bytesForUnit(level.power, system);
            const unit = autoUnit(unitBytes, system).unit;
            return (
              <article className={`scale-level level-${level.power}`} key={level.power}>
                <div className="scale-marker">
                  <span>{String(level.power).padStart(2, '0')}</span>
                  <i
                    style={{ '--scale-size': `${40 + level.power * 42}px` } as React.CSSProperties}
                  />
                </div>
                <div>
                  <p>{level.realm}</p>
                  <h2>{level.power === 0 ? '1 B' : `1 ${unit}`}</h2>
                  <strong>{unitBytes.toLocaleString()} 字节</strong>
                  <p>{level.example}</p>
                  <details>
                    <summary>完整换算</summary>
                    <code>
                      {system === 'SI' ? '1000' : '1024'}^{level.power} ={' '}
                      {unitBytes.toLocaleString()} 字节
                    </code>
                  </details>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="scale-calculator">
          <span className="panel-label">假设实验室</span>
          <section>
            <h3>文本</h3>
            <div className="field">
              <label htmlFor="text-count">字符数</label>
              <input
                id="text-count"
                value={textCharacters}
                onChange={(event) => setTextCharacters(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="text-type">文本类型</label>
              <select
                id="text-type"
                value={textType}
                onChange={(event) => setTextType(event.target.value as typeof textType)}
              >
                <option value="ascii">UTF-8 ASCII · 1 字节</option>
                <option value="chinese">UTF-8 中文常见 · 3 字节</option>
                <option value="custom">自定义平均值</option>
              </select>
            </div>
            {textType === 'custom' && (
              <div className="field">
                <label htmlFor="custom-bpc">字节 / 字符</label>
                <input
                  id="custom-bpc"
                  value={customBytes}
                  onChange={(event) => setCustomBytes(event.target.value)}
                />
              </div>
            )}
            <output>估算 {formatNumber(textBytes, 0)} 字节</output>
            <p>
              UTF-8 是变长编码：ASCII 字符占 1 字节，许多中文字符通常占 3 字节，emoji 可能占 4 字节或更多。
            </p>
          </section>
          <section>
            <h3>媒体</h3>
            <div className="field">
              <label htmlFor="photo-size">照片大小 · MB</label>
              <input
                id="photo-size"
                value={photoMb}
                onChange={(event) => setPhotoMb(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="video-rate">视频码率 · Mb/s</label>
              <input
                id="video-rate"
                value={videoMbps}
                onChange={(event) => setVideoMbps(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="video-length">视频时长 · 分钟</label>
              <input
                id="video-length"
                value={videoMinutes}
                onChange={(event) => setVideoMinutes(event.target.value)}
              />
            </div>
          </section>
          <section>
            <h3>存储</h3>
            <div className="field">
              <label htmlFor="ssd-size">SSD 容量 · TB</label>
              <input
                id="ssd-size"
                value={ssdTb}
                onChange={(event) => setSsdTb(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="rack-drives">每机架盘数</label>
              <input
                id="rack-drives"
                value={drivesPerRack}
                onChange={(event) => setDrivesPerRack(event.target.value)}
              />
            </div>
          </section>
        </aside>
        <section className="analogy-panel">
          <div className="scale-panel-heading">
            <span className="panel-label">{bytes.toLocaleString()} 字节可以代表什么</span>
            <span className="status-pill warn">基于假设</span>
          </div>
          <div className="analogy-grid">
            {assumptions.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="calculation-strip">
            <code>
              {bytes.toLocaleString()} 字节 ÷{' '}
              {bytesForUnit(selected.power, system).toLocaleString()} 字节/{selected.unit} ={' '}
              {formatNumber(selected.value, 6)} {selected.unit}
            </code>
          </div>
        </section>
      </section>
    </>
  );
}
