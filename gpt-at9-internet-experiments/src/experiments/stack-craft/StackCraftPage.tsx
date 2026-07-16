import { useMemo, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { combineElements, findDiscoveryPath } from './engine';
import { elementDescriptions, initialElements, recipes } from './recipes';
import './stack-craft.css';

const STORAGE_KEY = 'at9-stack-craft-v1';

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
    /* invalid local state falls back to the seed */
  }
  return { discovered: [...initialElements], pinned: [], history: [] };
}

export default function StackCraftPage() {
  usePageMetadata({
    title: 'Stack Craft',
    description: 'Combine infrastructure concepts into an AI data center.',
    path: '/experiments/stack-craft',
  });
  const [state, setState] = useState<SavedState>(loadState);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('Select or drag two elements into the workbench.');
  const [search, setSearch] = useState('');
  const [pathTarget, setPathTarget] = useState<string | null>(null);

  const discoveredSet = useMemo(() => new Set(state.discovered), [state.discovered]);
  const filtered = state.discovered
    .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    .sort(
      (a, b) =>
        Number(state.pinned.includes(b)) - Number(state.pinned.includes(a)) || a.localeCompare(b),
    );

  const persist = (next: SavedState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const choose = (name: string) => {
    if (selected.length === 0) {
      setSelected([name]);
      setMessage(`${name} selected. Choose a second element.`);
      return;
    }
    const first = selected[0];
    if (!first) return;
    const recipe = combineElements(first, name);
    if (!recipe) {
      setSelected([]);
      setMessage(`No deterministic recipe for ${first} + ${name}.`);
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
      isNew
        ? `DISCOVERED: ${recipe.result}. ${recipe.note}`
        : `${recipe.result} was already indexed.`,
    );
    if (recipe.result === 'AI Data Center') setPathTarget('AI Data Center');
  };

  const reset = () => {
    const seed = { discovered: [...initialElements], pinned: [], history: [] };
    persist(seed);
    setSelected([]);
    setPathTarget(null);
    setMessage('Progress reset to the eight foundational elements.');
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
      <ExperimentHeader
        number="01"
        title="STACK CRAFT"
        description="Begin with Linux, processes, memory, disks, and networks. Compose deterministic technology recipes until the system becomes an AI data center."
      />
      <section className="stack-layout">
        <aside className="stack-inventory">
          <div className="stack-panel-title">
            <span className="panel-label">DISCOVERY INDEX</span>
            <strong>
              {state.discovered.length}/
              {new Set([...initialElements, ...recipes.map((item) => item.result)]).size}
            </strong>
          </div>
          <div className="field">
            <label htmlFor="element-search">SEARCH DISCOVERED</label>
            <input
              id="element-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Linux, RAID, Kubernetes…"
            />
          </div>
          <div className="element-list" role="list" aria-label="Discovered elements">
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
                  aria-label={`View discovery path for ${name}`}
                  onClick={() => setPathTarget(name)}
                >
                  ↗
                </button>
                <button
                  className="pin-button"
                  type="button"
                  aria-label={`${state.pinned.includes(name) ? 'Unpin' : 'Pin'} ${name}`}
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
              COMBINATION WORKBENCH
            </span>
            <button className="control-button danger" type="button" onClick={reset}>
              RESET
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
            <div className="combine-slot">{selected[0] ?? 'DROP / SELECT A'}</div>
            <span>+</span>
            <div className="combine-slot">{selected[1] ?? 'DROP / SELECT B'}</div>
          </div>
          <p className="combine-message" role="status">
            {message}
          </p>
          <div className="goal-panel">
            <span className="panel-label">FINAL OBJECTIVE</span>
            <strong className={discoveredSet.has('AI Data Center') ? 'complete' : ''}>
              AI DATA CENTER
            </strong>
            <p>Build compute, storage, power, and cooling into one system.</p>
          </div>
          {pathTarget && (
            <div className="evolution-path">
              <div className="stack-panel-title">
                <span className="panel-label">TECHNOLOGY EVOLUTION PATH</span>
                <button
                  className="control-button"
                  onClick={() => setPathTarget(null)}
                  type="button"
                >
                  CLOSE
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
            <span className="panel-label">RECENT DISCOVERIES</span>
            <span>{state.history.length}</span>
          </div>
          {state.history.length === 0 ? (
            <p className="empty-note">Successful combinations appear here.</p>
          ) : (
            <ol>
              {state.history.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ol>
          )}
          <div className="known-recipes">
            <span className="panel-label">KNOWN RECIPE COVERAGE</span>
            <p>
              {recipes.filter((recipe) => discoveredSet.has(recipe.result)).length} of{' '}
              {recipes.length} recipes resolved.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
