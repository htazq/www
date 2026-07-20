import { useReducer, useState } from 'react';
import { usePageMetadata } from '../../app/metadata';
import { ExperimentHeader } from '../../components/experiment/ExperimentHeader';
import { deriveQuorumState, initialQuorumState, quorumReducer } from './machine';
import { quorumScenarios } from './scenarios';
import './quorum.css';

const availabilityText = { AVAILABLE: '可用', DEGRADED: '降级', UNAVAILABLE: '不可用' } as const;
const dataRiskText = { LOW: '低', ELEVATED: '偏高', CRITICAL: '危急' } as const;

export default function QuorumPage() {
  usePageMetadata({
    title: '仲裁集群',
    description: '一个关于仲裁、虚拟 IP 归属、隔离与脑裂的确定性教学模型。',
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
      <ExperimentHeader number="02" title="仲裁集群" label="教学模型" />
      <div className="education-banner">
        <strong>教学模型</strong>
        <span>这是一个简化的模拟，并非 Pacemaker 的精确实现。</span>
      </div>
      <section className="quorum-layout">
        <div className="quorum-topology">
          <div className="quorum-panel-heading">
            <span className="panel-label">实时拓扑</span>
            <span
              className={`status-pill ${derived.availability === 'AVAILABLE' ? 'good' : derived.availability === 'DEGRADED' ? 'warn' : 'bad'}`}
            >
              {availabilityText[derived.availability]}
            </span>
          </div>
          <svg viewBox="0 0 760 430" role="img" aria-label="两个数据节点、一个见证者、服务与虚拟 IP">
            <line
              className={state.links.AB ? 'link' : 'link failed'}
              x1="190" y1="165" x2="570" y2="165"
            />
            <line
              className={state.links.AW ? 'link' : 'link failed'}
              x1="190" y1="165" x2="380" y2="345"
            />
            <line
              className={state.links.BW ? 'link' : 'link failed'}
              x1="570" y1="165" x2="380" y2="345"
            />
            <g
              className={`node ${state.online.A ? '' : 'offline'} ${derived.activeNode === 'A' || derived.activeNode === 'both' ? 'active' : ''}`}
              transform="translate(110 105)"
            >
              <rect width="160" height="120" />
              <text x="80" y="42">节点 A</text>
              <text className="node-sub" x="80" y="72">
                {state.online.A ? '在线' : '离线'}
              </text>
              <text className="node-sub" x="80" y="94">
                服务{state.service.A ? '运行中' : '已停止'}
              </text>
            </g>
            <g
              className={`node ${state.online.B ? '' : 'offline'} ${derived.activeNode === 'B' || derived.activeNode === 'both' ? 'active' : ''}`}
              transform="translate(490 105)"
            >
              <rect width="160" height="120" />
              <text x="80" y="42">节点 B</text>
              <text className="node-sub" x="80" y="72">
                {state.online.B ? '在线' : '离线'}
              </text>
              <text className="node-sub" x="80" y="94">
                服务{state.service.B ? '运行中' : '已停止'}
              </text>
            </g>
            <g className={`witness ${state.online.W ? '' : 'offline'}`} transform="translate(315 310)">
              <rect width="130" height="70" />
              <text x="65" y="31">见证者</text>
              <text className="node-sub" x="65" y="53">
                {state.online.W ? '投票中' : '离线'}
              </text>
            </g>
            <g className={`vip vip-${state.vip}`} transform="translate(305 30)">
              <rect width="150" height="48" />
              <text x="75" y="30">
                虚拟 IP：{state.vip === 'both' ? '双侧' : state.vip === 'none' ? '无' : state.vip.toUpperCase()}
              </text>
            </g>
          </svg>
          <p className="topology-explanation">{derived.explanation}</p>
        </div>
        <aside className="quorum-status">
          <span className="panel-label">推演状态</span>
          <dl>
            <div>
              <dt>仲裁</dt>
              <dd className={statusClass(derived.quorum)}>{derived.quorum ? '达成' : '未达成'}</dd>
            </div>
            <div>
              <dt>活动节点</dt>
              <dd>
                {derived.activeNode === 'both' ? '双侧' : derived.activeNode === 'none' ? '无' : derived.activeNode.toUpperCase()}
              </dd>
            </div>
            <div>
              <dt>虚拟 IP 位置</dt>
              <dd>{state.vip === 'both' ? '双侧' : state.vip === 'none' ? '无' : state.vip.toUpperCase()}</dd>
            </div>
            <div>
              <dt>服务</dt>
              <dd className={statusClass(derived.serviceAvailable)}>
                {derived.serviceAvailable ? '可用' : '不可用'}
              </dd>
            </div>
            <div>
              <dt>脑裂</dt>
              <dd className={derived.splitBrainRisk ? 'bad' : 'good'}>
                {derived.splitBrainRisk ? '可能发生' : '受控'}
              </dd>
            </div>
            <div>
              <dt>数据风险</dt>
              <dd
                className={
                  derived.dataRisk === 'LOW' ? 'good' : derived.dataRisk === 'ELEVATED' ? 'warn' : 'bad'
                }
              >
                {dataRiskText[derived.dataRisk]}
              </dd>
            </div>
            <div>
              <dt>写入</dt>
              <dd className={derived.refuseWrites ? 'bad' : 'good'}>
                {derived.refuseWrites ? '拒绝' : '允许'}
              </dd>
            </div>
            <div>
              <dt>隔离机制</dt>
              <dd className={state.fencing ? 'good' : 'warn'}>
                {state.fencing ? '已启用' : '已关闭'}
              </dd>
            </div>
          </dl>
        </aside>
        <section className="quorum-controls">
          <div className="quorum-panel-heading">
            <span className="panel-label">故障注入</span>
            <button className="control-button" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              重置
            </button>
          </div>
          <div className="control-groups">
            <div>
              <strong>节点</strong>
              <button
                className="control-button"
                onClick={() => dispatch({ type: state.online.A ? 'SHUTDOWN' : 'RECOVER', node: 'A' })}
              >
                {state.online.A ? '关闭 A' : '恢复 A'}
              </button>
              <button
                className="control-button"
                onClick={() => dispatch({ type: state.online.B ? 'SHUTDOWN' : 'RECOVER', node: 'B' })}
              >
                {state.online.B ? '关闭 B' : '恢复 B'}
              </button>
            </div>
            <div>
              <strong>链路</strong>
              <button
                className="control-button"
                onClick={() => {
                  dispatch({ type: state.links.AW ? 'DISCONNECT' : 'RESTORE_LINK', link: 'AW' });
                  dispatch({ type: state.links.BW ? 'DISCONNECT' : 'RESTORE_LINK', link: 'BW' });
                }}
              >
                {state.links.AW || state.links.BW ? '断开见证者' : '恢复见证者'}
              </button>
              {(['AB', 'AW', 'BW'] as const).map((link) => (
                <button
                  key={link}
                  className="control-button"
                  onClick={() =>
                    dispatch({ type: state.links[link] ? 'DISCONNECT' : 'RESTORE_LINK', link })
                  }
                >
                  {state.links[link] ? `断开 ${link}` : `恢复 ${link}`}
                </button>
              ))}
            </div>
            <div>
              <strong>所有权</strong>
              <button className="control-button" onClick={() => dispatch({ type: 'CRASH_SERVICE' })}>
                崩溃服务
              </button>
              <button
                className="control-button"
                onClick={() => dispatch({ type: 'MOVE_VIP', node: 'A' })}
              >
                虚拟 IP 移到 A
              </button>
              <button
                className="control-button"
                onClick={() => dispatch({ type: 'MOVE_VIP', node: 'B' })}
              >
                虚拟 IP 移到 B
              </button>
            </div>
            <div>
              <strong>安全</strong>
              <button
                className={`control-button ${state.fencing ? 'active' : 'danger'}`}
                onClick={() => dispatch({ type: 'TOGGLE_FENCING' })}
              >
                隔离 {state.fencing ? '开' : '关'}
              </button>
              <button className="control-button" onClick={() => dispatch({ type: 'CLEAR_FAULTS' })}>
                清除故障
              </button>
            </div>
          </div>
        </section>
        <section className="scenario-panel">
          <span className="panel-label">任务场景</span>
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
            <strong>原理：</strong>{scenario.success}
          </p>
        </section>
        <aside className="event-log">
          <span className="panel-label">事件日志</span>
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
