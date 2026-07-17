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
    title: 'Data Scale',
    description: 'Explore data magnitude from one byte to one exabyte using SI and IEC units.',
    path: '/experiments/data-scale',
    themeColor: '#171511',
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
        label: 'TEXT CHARACTERS',
        value: `${formatNumber(bytes / Math.max(textBpc, 0.000001), 0)} chars`,
        detail: `${textBpc} byte(s) per selected character assumption`,
      },
      {
        label: 'COMPRESSED PHOTOS',
        value: `${formatNumber(storageDeviceCount(bytes, photoBytes), 2)} photos`,
        detail: `${photoMb} MB per photo`,
      },
      {
        label: '1080P VIDEO',
        value: `${formatNumber(bytes / Math.max(videoBytes, 1), 3)} hours`,
        detail: `${videoMbps} Mb/s for ${videoMinutes} minutes`,
      },
      {
        label: 'SSDS',
        value: `${formatNumber(storageDeviceCount(bytes, ssdBytes), 3)} drives`,
        detail: `${ssdTb} TB decimal capacity each`,
      },
      {
        label: 'RACKS',
        value: `${formatNumber(storageDeviceCount(bytes, rackBytes), 4)} racks`,
        detail: `${drivesPerRack} × ${ssdTb} TB SSDs per rack`,
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
  const resultText = `${bytes.toLocaleString()} bytes = ${formatNumber(selected.value, 6)} ${selected.unit} (${system})`;
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
      <ExperimentHeader number="06" title="DATA SCALE" />
      <section className="scale-controls">
        <div>
          <span className="panel-label">UNIT SYSTEM</span>
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
          <label htmlFor="byte-input">ARBITRARY BYTE COUNT</label>
          <input
            id="byte-input"
            inputMode="decimal"
            value={bytesInput}
            onChange={(event) => setBytesInput(event.target.value)}
          />
        </div>
        <div className="scale-result">
          <span>AUTO UNIT</span>
          <strong>
            {formatNumber(selected.value, 6)} {selected.unit}
          </strong>
          <button className="control-button" onClick={() => void copyResult()}>
            {copied ? 'COPIED' : 'COPY RESULT'}
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
                  <strong>{unitBytes.toLocaleString()} bytes</strong>
                  <p>{level.example}</p>
                  <details>
                    <summary>FULL CONVERSION</summary>
                    <code>
                      {system === 'SI' ? '1000' : '1024'}^{level.power} ={' '}
                      {unitBytes.toLocaleString()} bytes
                    </code>
                  </details>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="scale-calculator">
          <span className="panel-label">ASSUMPTION LAB</span>
          <section>
            <h3>TEXT</h3>
            <div className="field">
              <label htmlFor="text-count">CHARACTERS</label>
              <input
                id="text-count"
                value={textCharacters}
                onChange={(event) => setTextCharacters(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="text-type">TEXT TYPE</label>
              <select
                id="text-type"
                value={textType}
                onChange={(event) => setTextType(event.target.value as typeof textType)}
              >
                <option value="ascii">UTF-8 ASCII · 1 byte</option>
                <option value="chinese">UTF-8 Chinese typical · 3 bytes</option>
                <option value="custom">Custom average</option>
              </select>
            </div>
            {textType === 'custom' && (
              <div className="field">
                <label htmlFor="custom-bpc">BYTES / CHARACTER</label>
                <input
                  id="custom-bpc"
                  value={customBytes}
                  onChange={(event) => setCustomBytes(event.target.value)}
                />
              </div>
            )}
            <output>{formatNumber(textBytes, 0)} bytes estimated</output>
            <p>
              UTF-8 is variable-length. ASCII characters use one byte; many Chinese characters
              commonly use three bytes, while emoji may use four or more.
            </p>
          </section>
          <section>
            <h3>MEDIA</h3>
            <div className="field">
              <label htmlFor="photo-size">PHOTO SIZE · MB</label>
              <input
                id="photo-size"
                value={photoMb}
                onChange={(event) => setPhotoMb(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="video-rate">VIDEO BITRATE · Mb/s</label>
              <input
                id="video-rate"
                value={videoMbps}
                onChange={(event) => setVideoMbps(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="video-length">VIDEO LENGTH · MIN</label>
              <input
                id="video-length"
                value={videoMinutes}
                onChange={(event) => setVideoMinutes(event.target.value)}
              />
            </div>
          </section>
          <section>
            <h3>STORAGE</h3>
            <div className="field">
              <label htmlFor="ssd-size">SSD CAPACITY · TB</label>
              <input
                id="ssd-size"
                value={ssdTb}
                onChange={(event) => setSsdTb(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="rack-drives">DRIVES / RACK</label>
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
            <span className="panel-label">WHAT {bytes.toLocaleString()} BYTES COULD REPRESENT</span>
            <span className="status-pill warn">ASSUMPTION-BASED</span>
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
              {bytes.toLocaleString()} bytes ÷{' '}
              {bytesForUnit(selected.power, system).toLocaleString()} bytes/{selected.unit} ={' '}
              {formatNumber(selected.value, 6)} {selected.unit}
            </code>
          </div>
        </section>
      </section>
    </>
  );
}
