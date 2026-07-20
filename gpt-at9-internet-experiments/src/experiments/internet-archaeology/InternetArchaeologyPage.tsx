import { useMemo, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { categoryNames, exhibits, type ExhibitCategory } from './exhibits';
import { InteractionDemo } from './InteractionDemo';
import './internet-archaeology.css';

export default function InternetArchaeologyPage() {
  usePageMetadata({
    title: '互联网考古',
    description: '一座重构计算与互联网文物的交互博物馆。',
    path: '/experiments/internet-archaeology',
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
      <ExperimentHeader number="07" title="互联网考古" />
      <div className="museum-notice">
        <strong>原创重构</strong>
        <span>未使用任何原始的 Logo、皮肤、截图、开机音或软件资产。</span>
      </div>
      <section className="museum-controls">
        <div>
          <span className="panel-label">视图</span>
          <div className="mode-buttons">
            <button
              className={`control-button ${view === 'timeline' ? 'active' : ''}`}
              onClick={() => setView('timeline')}
            >
              时间线
            </button>
            <button
              className={`control-button ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              列表
            </button>
          </div>
        </div>
        <div className="field">
          <label htmlFor="category-filter">分类</label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
          >
            <option value="all">全部分类</option>
            {(Object.keys(categoryNames) as ExhibitCategory[]).map((key) => (
              <option value={key} key={key}>
                {categoryNames[key]}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className={`museum-index ${view}`} aria-label="馆藏列表">
        {filtered.map((item) => (
          <button
            onClick={() => select(item.id)}
            className={selected.id === item.id ? 'selected' : ''}
            key={item.id}
          >
            <span>{item.year}</span>
            <strong>{item.name}</strong>
            <em>{categoryNames[item.category]}</em>
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
              藏品 {String(exhibits.indexOf(selected) + 1).padStart(2, '0')} / {exhibits.length}
            </span>
            <p>
              {selected.era} · {categoryNames[selected.category]}
            </p>
          </div>
          <h2>{selected.name}</h2>
          <p>{selected.definition}</p>
        </header>
        <div className="artifact-grid">
          <dl>
            <div>
              <dt>典型界面</dt>
              <dd>{selected.interface}</dd>
            </div>
            <div>
              <dt>常见用途</dt>
              <dd>{selected.uses}</dd>
            </div>
            <div>
              <dt>解决的问题</dt>
              <dd>{selected.problem}</dd>
            </div>
            <div>
              <dt>技术局限</dt>
              <dd>{selected.limits}</dd>
            </div>
            <div>
              <dt>当时想象的未来</dt>
              <dd>{selected.future}</dd>
            </div>
            <div>
              <dt>今天留下的东西</dt>
              <dd>{selected.legacy}</dd>
            </div>
          </dl>
          <div className="artifact-demo">
            <div className="demo-label">
              <span className="panel-label">交互重构</span>
              <span>仅在本地</span>
            </div>
            <InteractionDemo key={selected.id} exhibit={selected} />
          </div>
        </div>
        <nav className="artifact-nav" aria-label="藏品导航">
          <button
            disabled={exhibits.indexOf(selected) === 0}
            onClick={() =>
              setSelectedId(exhibits[Math.max(0, exhibits.indexOf(selected) - 1)]?.id ?? selected.id)
            }
          >
            ← 上一件
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
            下一件 →
          </button>
        </nav>
      </section>
    </>
  );
}
