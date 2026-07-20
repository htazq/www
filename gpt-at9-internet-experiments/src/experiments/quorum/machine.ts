export type Member = 'A' | 'B' | 'W';
export type DataNode = 'A' | 'B';
export type VipHost = DataNode | 'both' | 'none';

export interface QuorumState {
  online: Record<Member, boolean>;
  links: { AB: boolean; AW: boolean; BW: boolean };
  fencing: boolean;
  service: Record<DataNode, boolean>;
  vip: VipHost;
  log: string[];
}

export type QuorumAction =
  | { type: 'SHUTDOWN'; node: DataNode }
  | { type: 'RECOVER'; node: DataNode }
  | { type: 'DISCONNECT'; link: keyof QuorumState['links'] }
  | { type: 'RESTORE_LINK'; link: keyof QuorumState['links'] }
  | { type: 'TOGGLE_FENCING' }
  | { type: 'CRASH_SERVICE' }
  | { type: 'MOVE_VIP'; node: DataNode }
  | { type: 'CLEAR_FAULTS' }
  | { type: 'RESET' };

export const initialQuorumState: QuorumState = {
  online: { A: true, B: true, W: true },
  links: { AB: true, AW: true, BW: true },
  fencing: true,
  service: { A: true, B: false },
  vip: 'A',
  log: ['模拟已初始化。节点 A 持有服务与虚拟 IP。'],
};

function neighbors(state: QuorumState, node: Member): Member[] {
  const result: Member[] = [];
  if (node === 'A' && state.links.AB) result.push('B');
  if (node === 'B' && state.links.AB) result.push('A');
  if (node === 'A' && state.links.AW) result.push('W');
  if (node === 'W' && state.links.AW) result.push('A');
  if (node === 'B' && state.links.BW) result.push('W');
  if (node === 'W' && state.links.BW) result.push('B');
  return result.filter((member) => state.online[member]);
}

export function reachableMembers(state: QuorumState, start: Member): Set<Member> {
  if (!state.online[start]) return new Set();
  const seen = new Set<Member>([start]);
  const queue: Member[] = [start];
  while (queue.length) {
    const current = queue.shift();
    if (!current) break;
    for (const next of neighbors(state, current)) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen;
}

export function nodeHasQuorum(state: QuorumState, node: DataNode) {
  return reachableMembers(state, node).size >= 2;
}

export interface DerivedQuorumState {
  quorum: boolean;
  activeNode: DataNode | 'none' | 'both';
  serviceAvailable: boolean;
  splitBrainRisk: boolean;
  dataRisk: 'LOW' | 'ELEVATED' | 'CRITICAL';
  availability: 'AVAILABLE' | 'DEGRADED' | 'UNAVAILABLE';
  refuseWrites: boolean;
  explanation: string;
}

export function deriveQuorumState(state: QuorumState): DerivedQuorumState {
  const active = (['A', 'B'] as const).filter((node) => state.online[node] && state.service[node]);
  const activeNode: DerivedQuorumState['activeNode'] =
    active.length === 2 ? 'both' : (active[0] ?? 'none');
  const quorum = nodeHasQuorum(state, 'A') || nodeHasQuorum(state, 'B');
  const partitioned = state.online.A && state.online.B && !state.links.AB;
  const dualMajority = nodeHasQuorum(state, 'A') && nodeHasQuorum(state, 'B');
  const splitBrainRisk =
    partitioned && !state.fencing && (dualMajority || active.length === 2 || state.vip === 'both');
  const vipServed =
    state.vip === 'both'
      ? active.length > 0
      : state.vip === 'none'
        ? false
        : state.online[state.vip] && state.service[state.vip];
  const serviceAvailable = quorum && vipServed && !splitBrainRisk;
  const availability = serviceAvailable
    ? active.length === 1 && state.online.A && state.online.B
      ? 'AVAILABLE'
      : 'DEGRADED'
    : 'UNAVAILABLE';
  const dataRisk = splitBrainRisk ? 'CRITICAL' : !quorum || !state.fencing ? 'ELEVATED' : 'LOW';
  const refuseWrites = !quorum || splitBrainRisk || !vipServed;
  const explanation = splitBrainRisk
    ? '两侧可能都认为自己可以受理写入。所有权安全转移前必须启用隔离机制。'
    : !quorum
      ? '没有数据节点能触达多数投票成员。写入应当停止。'
      : serviceAvailable
        ? '多数派存在，且恰好一个可达的服务所有者持有虚拟 IP。'
        : '多数派存在，但服务或虚拟 IP 当前不可用。';
  return {
    quorum,
    activeNode,
    serviceAvailable,
    splitBrainRisk,
    dataRisk,
    availability,
    refuseWrites,
    explanation,
  };
}

function append(state: QuorumState, message: string): QuorumState {
  return { ...state, log: [message, ...state.log].slice(0, 40) };
}

function failover(state: QuorumState, failed: DataNode): QuorumState {
  const target: DataNode = failed === 'A' ? 'B' : 'A';
  const candidate = { ...state, service: { ...state.service, [failed]: false } };
  if (candidate.online[target] && nodeHasQuorum(candidate, target)) {
    return append(
      { ...candidate, service: { A: target === 'A', B: target === 'B' }, vip: target },
      `故障转移完成。节点 ${target} 持有服务与虚拟 IP。`,
    );
  }
  return append(
    { ...candidate, vip: 'none' },
    '故障转移被拒绝：不存在安全的多数派所有者。',
  );
}

export function quorumReducer(state: QuorumState, action: QuorumAction): QuorumState {
  if (action.type === 'RESET') return { ...initialQuorumState, log: [...initialQuorumState.log] };
  if (action.type === 'CLEAR_FAULTS')
    return {
      ...initialQuorumState,
      fencing: state.fencing,
      log: ['故障已清除。集群恢复到单一所有者。'],
    };
  if (action.type === 'TOGGLE_FENCING')
    return append(
      { ...state, fencing: !state.fencing },
      `隔离机制已${state.fencing ? '关闭' : '开启'}。`,
    );
  if (action.type === 'SHUTDOWN') {
    const next = { ...state, online: { ...state.online, [action.node]: false } };
    return state.service[action.node] || state.vip === action.node
      ? failover(next, action.node)
      : append(next, `节点 ${action.node} 已关机。`);
  }
  if (action.type === 'RECOVER')
    return append(
      { ...state, online: { ...state.online, [action.node]: true } },
      `节点 ${action.node} 已恢复为被动成员。`,
    );
  if (action.type === 'DISCONNECT')
    return append(
      { ...state, links: { ...state.links, [action.link]: false } },
      `链路 ${action.link} 已断开。`,
    );
  if (action.type === 'RESTORE_LINK')
    return append(
      { ...state, links: { ...state.links, [action.link]: true } },
      `链路 ${action.link} 已恢复。`,
    );
  if (action.type === 'CRASH_SERVICE') {
    if (state.vip === 'A' || state.vip === 'B')
      return failover({ ...state, service: { ...state.service, [state.vip]: false } }, state.vip);
    return append(state, '当前没有可崩溃的活动服务。');
  }
  if (action.type === 'MOVE_VIP') {
    if (!state.online[action.node])
      return append(state, `虚拟 IP 迁移被拒绝：节点 ${action.node} 离线。`);
    if (!nodeHasQuorum(state, action.node))
      return append(state, `虚拟 IP 迁移被拒绝：节点 ${action.node} 没有仲裁。`);
    if (!state.fencing && !state.links.AB && (state.service.A || state.service.B)) {
      return append(
        { ...state, service: { ...state.service, [action.node]: true }, vip: 'both' },
        `危险的虚拟 IP 迁移到节点 ${action.node}：原所有者未被隔离。`,
      );
    }
    return append(
      { ...state, service: { A: action.node === 'A', B: action.node === 'B' }, vip: action.node },
      `虚拟 IP 已安全迁移到节点 ${action.node}。`,
    );
  }
  return state;
}
