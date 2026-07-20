import { useMemo, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { combineElements, findDiscoveryPath } from './engine';
import { elementDescriptions, initialElements, recipes } from './recipes';
import './stack-craft.css';

const STORAGE_KEY = 'at9-stack-craft-v2';

interface SavedState {
  discovered: string[];
  pinned: string[];
  history: string[];
}

function loadState(): SavedState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as SavedState;
    if (Array.isArray(parsed.discovered)) return parsed;
  } catch {
    /* 本地状态无效时回到初始元素 */
  }
  return { discovered: [...initialElements], pinned: [], history: [] };
}

export default function StackCraftPage() {
  usePageMetadata({
    title: '堆栈合成',
    description: '把基础设施概念组合成一座 AI 数据中心。',
    path: '/experiments/stack-craft',
  });
  const [state, setState] = useState<SavedState>(loadState);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('选择或拖拽两个元素到工作台。');
  const [search, setSearch] = useState('');
  const [pathTarget, setPathTarget] = useState<string | null>(null);

  const discoveredSet = useMemo(() => new Set(state.discovered), [state.discovered]);
  const filtered = state.discovered
    .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    .sort(
      (a, b) =>
        Number(state.pinned.includes(b)) - Number(state.pinned.includes(a)) ||
        a.localeCompare(b, 'zh'),
    );

  const persist = (next: SavedState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const choose = (name: string) => {
    if (selected.length === 0) {
      setSelected([name]);
      setMessage(`已选择「${name}」，再选一个元素。`);
      return;
    }
    const first = selected[0];
    if (!first) return;
    const recipe = combineElements(first, name);
    if (!recipe) {
      setSelected([]);
      setMessage(`「${first} + ${name}」没有确定的配方。`);
      return;
    }
    const isNew = !discoveredSet.has(recipe.result);
    const next = {
      ...state,
      discovered: isNew ? [...state.discovered, recipe.result] : state.discovered,
      history: [`${first} + ${name} → ${recipe.result}`, ...state.history].slice(0, 30),
    };
    persist(next);
    setSelected([]);
    setMessage(
      isNew ? `发现新元素：${recipe.result}。${recipe.note}` : `「${recipe.result}」已经在索引里了。`,
    );
    if (recipe.result === 'AI 数据中心') setPathTarget('AI 数据中心');
  };

  const reset = () => {
    const seed = { discovered: [...initialElements], pinned: [], history: [] };
    persist(seed);
    setSelected([]);
    setPathTarget(null);
    setMessage('进度已重置为八个基础元素。');
  };
  const togglePin = (name: string) =>
    persist({
      ...state,
      pinned: state.pinned.includes(name)
        ? state.pinned.filter((item) => item !== name)
        : [...state.pinned, name],
    });
  const path = pathTarget ? findDiscoveryPath(pathTarget, new Set(initialElements)) : [];

  return (
    <>
      <ExperimentHeader number="01" title="堆栈合成" />
      <section className="stack-layout">
        <aside className="stack-inventory">
          <div className="stack-panel-title">
            <span className="panel-label">发现索引</span>
            <strong>
              {state.discovered.length}/
              {new Set([...initialElements, ...recipes.map((item) => item.result)]).size}
            </strong>
          </div>
          <div className="field">
            <label htmlFor="element-search">搜索已发现元素</label>
            <input
              id="element-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Linux、RAID、Kubernetes…"
            />
          </div>
          <div className="element-list" role="list" aria-label="已发现元素">
            {filtered.map((name) => (
              <div className="element-row" key={name} role="listitem">
                <button
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', name)}
                  onClick={() => choose(name)}
                  className={selected.includes(name) ? 'element-token selected' : 'element-token'}
                  type="button"
                >
                  {name}
                </button>
                <button
                  className="path-button"
                  type="button"
                  aria-label={`查看 ${name} 的合成路径`}
                  onClick={() => setPathTarget(name)}
                >
                  ↗
                </button>
                <button
                  className="pin-button"
                  type="button"
                  aria-label={`${state.pinned.includes(name) ? '取消置顶' : '置顶'} ${name}`}
                  onClick={() => togglePin(name)}
                >
                  {state.pinned.includes(name) ? '●' : '○'}
                </button>
              </div>
            ))}
          </div>
        </aside>
        <section className="stack-workbench" aria-labelledby="workbench-title">
          <div className="stack-panel-title">
            <span id="workbench-title" className="panel-label">
              合成工作台
            </span>
            <button className="control-button danger" type="button" onClick={reset}>
              重置
            </button>
          </div>
          <div
            className="combine-zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const name = event.dataTransfer.getData('text/plain');
              if (name) choose(name);
            }}
          >
            <div className="combine-slot">{selected[0] ?? '拖入 / 选择 A'}</div>
            <span>+</span>
            <div className="combine-slot">{selected[1] ?? '拖入 / 选择 B'}</div>
          </div>
          <p className="combine-message" role="status">
            {message}
          </p>
          <div className="goal-panel">
            <span className="panel-label">最终目标</span>
            <strong className={discoveredSet.has('AI 数据中心') ? 'complete' : ''}>
              AI 数据中心
            </strong>
            <p>把算力、存储、供电与散热合成为一个系统。</p>
          </div>
          {pathTarget && (
            <div className="evolution-path">
              <div className="stack-panel-title">
                <span className="panel-label">技术演化路径</span>
                <button className="control-button" onClick={() => setPathTarget(null)} type="button">
                  关闭
                </button>
              </div>
              <ol>
                {path.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{item}</strong>
                    <p>{elementDescriptions[item]}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
        <aside className="stack-history">
          <div className="stack-panel-title">
            <span className="panel-label">最近发现</span>
            <span>{state.history.length}</span>
          </div>
          {state.history.length === 0 ? (
            <p className="empty-note">成功的合成会出现在这里。</p>
          ) : (
            <ol>
              {state.history.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ol>
          )}
          <div className="known-recipes">
            <span className="panel-label">配方覆盖率</span>
            <p>
              已解析 {recipes.filter((recipe) => discoveredSet.has(recipe.result)).length} /{' '}
              {recipes.length} 个配方。
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
