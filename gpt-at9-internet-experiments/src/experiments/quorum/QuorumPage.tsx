import { useReducer, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { deriveQuorumState, initialQuorumState, quorumReducer } from './machine';
import { quorumScenarios } from './scenarios';
import './quorum.css';

export default function QuorumPage() {
  usePageMetadata({
    title: 'Quorum',
    description:
      'A deterministic educational model of quorum, VIP ownership, fencing, and split brain.',
    path: '/experiments/quorum',
  });
  const [state, dispatch] = useReducer(quorumReducer, initialQuorumState);
  const [scenarioId, setScenarioId] =
    useState<(typeof quorumScenarios)[number]['id']>('node-failure');
  const derived = deriveQuorumState(state);
  const scenario = quorumScenarios.find((item) => item.id === scenarioId) ?? quorumScenarios[0];

  const statusClass = (ok: boolean) => (ok ? 'good' : 'bad');
  return (
    <>
      <ExperimentHeader number="02" title="QUORUM" label="EDUCATIONAL MODEL" />
      <div className="education-banner">
        <strong>EDUCATIONAL MODEL</strong>
        <span>This is a simplified simulation, not an exact Pacemaker implementation.</span>
      </div>
      <section className="quorum-layout">
        <div className="quorum-topology">
          <div className="quorum-panel-heading">
            <span className="panel-label">LIVE TOPOLOGY</span>
            <span
              className={`status-pill ${derived.availability === 'AVAILABLE' ? 'good' : derived.availability === 'DEGRADED' ? 'warn' : 'bad'}`}
            >
              {derived.availability}
            </span>
          </div>
          <svg
            viewBox="0 0 760 430"
            role="img"
            aria-label="Two data nodes, one witness, service, and virtual IP"
          >
            <line
              className={state.links.AB ? 'link' : 'link failed'}
              x1="190"
              y1="165"
              x2="570"
              y2="165"
            />
            <line
              className={state.links.AW ? 'link' : 'link failed'}
              x1="190"
              y1="165"
              x2="380"
              y2="345"
            />
            <line
              className={state.links.BW ? 'link' : 'link failed'}
              x1="570"
              y1="165"
              x2="380"
              y2="345"
            />
            <g
              className={`node ${state.online.A ? '' : 'offline'} ${derived.activeNode === 'A' || derived.activeNode === 'both' ? 'active' : ''}`}
              transform="translate(110 105)"
            >
              <rect width="160" height="120" />
              <text x="80" y="42">
                NODE A
              </text>
              <text className="node-sub" x="80" y="72">
                {state.online.A ? 'ONLINE' : 'OFFLINE'}
              </text>
              <text className="node-sub" x="80" y="94">
                SERVICE {state.service.A ? 'RUNNING' : 'STOPPED'}
              </text>
            </g>
            <g
              className={`node ${state.online.B ? '' : 'offline'} ${derived.activeNode === 'B' || derived.activeNode === 'both' ? 'active' : ''}`}
              transform="translate(490 105)"
            >
              <rect width="160" height="120" />
              <text x="80" y="42">
                NODE B
              </text>
              <text className="node-sub" x="80" y="72">
                {state.online.B ? 'ONLINE' : 'OFFLINE'}
              </text>
              <text className="node-sub" x="80" y="94">
                SERVICE {state.service.B ? 'RUNNING' : 'STOPPED'}
              </text>
            </g>
            <g
              className={`witness ${state.online.W ? '' : 'offline'}`}
              transform="translate(315 310)"
            >
              <rect width="130" height="70" />
              <text x="65" y="31">
                WITNESS
              </text>
              <text className="node-sub" x="65" y="53">
                {state.online.W ? 'VOTING' : 'OFFLINE'}
              </text>
            </g>
            <g className={`vip vip-${state.vip}`} transform="translate(305 30)">
              <rect width="150" height="48" />
              <text x="75" y="30">
                VIP: {state.vip.toUpperCase()}
              </text>
            </g>
          </svg>
          <p className="topology-explanation">{derived.explanation}</p>
        </div>
        <aside className="quorum-status">
          <span className="panel-label">CALCULATED STATE</span>
          <dl>
            <div>
              <dt>Quorum</dt>
              <dd className={statusClass(derived.quorum)}>{derived.quorum ? 'YES' : 'NO'}</dd>
            </div>
            <div>
              <dt>Active node</dt>
              <dd>{derived.activeNode.toUpperCase()}</dd>
            </div>
            <div>
              <dt>VIP location</dt>
              <dd>{state.vip.toUpperCase()}</dd>
            </div>
            <div>
              <dt>Service</dt>
              <dd className={statusClass(derived.serviceAvailable)}>
                {derived.serviceAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
              </dd>
            </div>
            <div>
              <dt>Split brain</dt>
              <dd className={derived.splitBrainRisk ? 'bad' : 'good'}>
                {derived.splitBrainRisk ? 'POSSIBLE' : 'CONTROLLED'}
              </dd>
            </div>
            <div>
              <dt>Data risk</dt>
              <dd
                className={
                  derived.dataRisk === 'LOW'
                    ? 'good'
                    : derived.dataRisk === 'ELEVATED'
                      ? 'warn'
                      : 'bad'
                }
              >
                {derived.dataRisk}
              </dd>
            </div>
            <div>
              <dt>Writes</dt>
              <dd className={derived.refuseWrites ? 'bad' : 'good'}>
                {derived.refuseWrites ? 'REFUSE' : 'ALLOW'}
              </dd>
            </div>
            <div>
              <dt>Fencing</dt>
              <dd className={state.fencing ? 'good' : 'warn'}>
                {state.fencing ? 'ENABLED' : 'DISABLED'}
              </dd>
            </div>
          </dl>
        </aside>
        <section className="quorum-controls">
          <div className="quorum-panel-heading">
            <span className="panel-label">FAULT INJECTION</span>
            <button
              className="control-button"
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
            >
              RESET
            </button>
          </div>
          <div className="control-groups">
            <div>
              <strong>NODES</strong>
              <button
                className="control-button"
                onClick={() =>
                  dispatch({ type: state.online.A ? 'SHUTDOWN' : 'RECOVER', node: 'A' })
                }
              >
                {state.online.A ? 'SHUT DOWN A' : 'RECOVER A'}
              </button>
              <button
                className="control-button"
                onClick={() =>
                  dispatch({ type: state.online.B ? 'SHUTDOWN' : 'RECOVER', node: 'B' })
                }
              >
                {state.online.B ? 'SHUT DOWN B' : 'RECOVER B'}
              </button>
            </div>
            <div>
              <strong>LINKS</strong>
              <button
                className="control-button"
                onClick={() => {
                  dispatch({ type: state.links.AW ? 'DISCONNECT' : 'RESTORE_LINK', link: 'AW' });
                  dispatch({ type: state.links.BW ? 'DISCONNECT' : 'RESTORE_LINK', link: 'BW' });
                }}
              >
                {state.links.AW || state.links.BW ? 'DISCONNECT WITNESS' : 'RESTORE WITNESS'}
              </button>
              {(['AB', 'AW', 'BW'] as const).map((link) => (
                <button
                  key={link}
                  className="control-button"
                  onClick={() =>
                    dispatch({ type: state.links[link] ? 'DISCONNECT' : 'RESTORE_LINK', link })
                  }
                >
                  {state.links[link] ? `DISCONNECT ${link}` : `RESTORE ${link}`}
                </button>
              ))}
            </div>
            <div>
              <strong>OWNERSHIP</strong>
              <button
                className="control-button"
                onClick={() => dispatch({ type: 'CRASH_SERVICE' })}
              >
                CRASH SERVICE
              </button>
              <button
                className="control-button"
                onClick={() => dispatch({ type: 'MOVE_VIP', node: 'A' })}
              >
                MOVE VIP TO A
              </button>
              <button
                className="control-button"
                onClick={() => dispatch({ type: 'MOVE_VIP', node: 'B' })}
              >
                MOVE VIP TO B
              </button>
            </div>
            <div>
              <strong>SAFETY</strong>
              <button
                className={`control-button ${state.fencing ? 'active' : 'danger'}`}
                onClick={() => dispatch({ type: 'TOGGLE_FENCING' })}
              >
                FENCING {state.fencing ? 'ON' : 'OFF'}
              </button>
              <button className="control-button" onClick={() => dispatch({ type: 'CLEAR_FAULTS' })}>
                CLEAR FAULTS
              </button>
            </div>
          </div>
        </section>
        <section className="scenario-panel">
          <span className="panel-label">TASK SCENARIOS</span>
          <div className="scenario-tabs">
            {quorumScenarios.map((item) => (
              <button
                className={item.id === scenarioId ? 'active' : ''}
                key={item.id}
                onClick={() => setScenarioId(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
          <h2>{scenario.title}</h2>
          <p>{scenario.goal}</p>
          <ol>
            {scenario.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="scenario-success">
            <strong>WHY:</strong> {scenario.success}
          </p>
        </section>
        <aside className="event-log">
          <span className="panel-label">EVENT LOG</span>
          <ol>
            {state.log.map((item, index) => (
              <li key={`${item}-${index}`}>
                <span>{String(state.log.length - index).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </>
  );
}
