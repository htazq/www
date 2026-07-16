import { useMemo, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { exhibits, type ExhibitCategory } from './exhibits';
import { InteractionDemo } from './InteractionDemo';
import './internet-archaeology.css';

export default function InternetArchaeologyPage() {
  usePageMetadata({
    title: 'Internet Archaeology',
    description: 'An interactive museum of reconstructed computing and internet artifacts.',
    path: '/experiments/internet-archaeology',
    themeColor: '#161512',
  });
  const [selectedId, setSelectedId] = useState('telnet');
  const [view, setView] = useState<'timeline' | 'list'>('timeline');
  const [category, setCategory] = useState<'all' | ExhibitCategory>('all');
  const filtered = useMemo(
    () => exhibits.filter((item) => category === 'all' || item.category === category),
    [category],
  );
  const selected = exhibits.find((item) => item.id === selectedId) ?? exhibits[0]!;
  const select = (id: string) => {
    setSelectedId(id);
    document
      .getElementById('artifact-detail')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <ExperimentHeader
        number="07"
        title="INTERNET ARCHAEOLOGY"
        description="A hands-on museum of era-inspired, original interface reconstructions—from clear-text terminals to agent control loops."
      />
      <div className="museum-notice">
        <strong>ORIGINAL RECONSTRUCTIONS</strong>
        <span>
          No original logos, skins, screenshots, startup sounds, or software assets are used.
        </span>
      </div>
      <section className="museum-controls">
        <div>
          <span className="panel-label">VIEW</span>
          <div className="mode-buttons">
            <button
              className={`control-button ${view === 'timeline' ? 'active' : ''}`}
              onClick={() => setView('timeline')}
            >
              TIMELINE VIEW
            </button>
            <button
              className={`control-button ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              LIST VIEW
            </button>
          </div>
        </div>
        <div className="field">
          <label htmlFor="category-filter">CATEGORY</label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
          >
            <option value="all">All categories</option>
            <option value="protocol">Protocol</option>
            <option value="community">Community</option>
            <option value="media">Media</option>
            <option value="virtualization">Virtualization</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="intelligence">Intelligence</option>
          </select>
        </div>
      </section>
      <section className={`museum-index ${view}`} aria-label="Artifact collection">
        {filtered.map((item) => (
          <button
            onClick={() => select(item.id)}
            className={selected.id === item.id ? 'selected' : ''}
            key={item.id}
          >
            <span>{item.year}</span>
            <strong>{item.name}</strong>
            <em>{item.category}</em>
            <p>{item.definition}</p>
          </button>
        ))}
      </section>
      <section
        id="artifact-detail"
        className={`artifact-detail era-${Math.floor(selected.year / 10) * 10}`}
      >
        <header>
          <div>
            <span className="panel-label">
              ARTIFACT {String(exhibits.indexOf(selected) + 1).padStart(2, '0')} / {exhibits.length}
            </span>
            <p>
              {selected.era} · {selected.category.toUpperCase()}
            </p>
          </div>
          <h2>{selected.name}</h2>
          <p>{selected.definition}</p>
        </header>
        <div className="artifact-grid">
          <dl>
            <div>
              <dt>TYPICAL INTERFACE</dt>
              <dd>{selected.interface}</dd>
            </div>
            <div>
              <dt>COMMON USE</dt>
              <dd>{selected.uses}</dd>
            </div>
            <div>
              <dt>PROBLEM IT SOLVED</dt>
              <dd>{selected.problem}</dd>
            </div>
            <div>
              <dt>TECHNICAL LIMITS</dt>
              <dd>{selected.limits}</dd>
            </div>
            <div>
              <dt>HOW THE FUTURE LOOKED</dt>
              <dd>{selected.future}</dd>
            </div>
            <div>
              <dt>WHAT REMAINS TODAY</dt>
              <dd>{selected.legacy}</dd>
            </div>
          </dl>
          <div className="artifact-demo">
            <div className="demo-label">
              <span className="panel-label">INTERACTIVE RECONSTRUCTION</span>
              <span>LOCAL ONLY</span>
            </div>
            <InteractionDemo key={selected.id} exhibit={selected} />
          </div>
        </div>
        <nav className="artifact-nav" aria-label="Artifact navigation">
          <button
            disabled={exhibits.indexOf(selected) === 0}
            onClick={() =>
              setSelectedId(
                exhibits[Math.max(0, exhibits.indexOf(selected) - 1)]?.id ?? selected.id,
              )
            }
          >
            ← PREVIOUS
          </button>
          <button
            disabled={exhibits.indexOf(selected) === exhibits.length - 1}
            onClick={() =>
              setSelectedId(
                exhibits[Math.min(exhibits.length - 1, exhibits.indexOf(selected) + 1)]?.id ??
                  selected.id,
              )
            }
          >
            NEXT →
          </button>
        </nav>
      </section>
    </>
  );
}
