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
  log: ['Simulation initialized. Node A owns the service and Virtual IP.'],
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
    ? 'Both sides may believe they are allowed to serve writes. Fencing is required before ownership can move safely.'
    : !quorum
      ? 'No data node can reach a majority of voting members. Writes should stop.'
      : serviceAvailable
        ? 'A majority exists and exactly one reachable service owner holds the Virtual IP.'
        : 'A majority exists, but the service or Virtual IP is not currently available.';
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
      `Failover completed. Node ${target} owns the service and VIP.`,
    );
  }
  return append(
    { ...candidate, vip: 'none' },
    'Failover refused because no safe majority owner exists.',
  );
}

export function quorumReducer(state: QuorumState, action: QuorumAction): QuorumState {
  if (action.type === 'RESET') return { ...initialQuorumState, log: [...initialQuorumState.log] };
  if (action.type === 'CLEAR_FAULTS')
    return {
      ...initialQuorumState,
      fencing: state.fencing,
      log: ['Faults cleared. Cluster returned to a single owner.'],
    };
  if (action.type === 'TOGGLE_FENCING')
    return append(
      { ...state, fencing: !state.fencing },
      `Fencing ${state.fencing ? 'disabled' : 'enabled'}.`,
    );
  if (action.type === 'SHUTDOWN') {
    const next = { ...state, online: { ...state.online, [action.node]: false } };
    return state.service[action.node] || state.vip === action.node
      ? failover(next, action.node)
      : append(next, `Node ${action.node} shut down.`);
  }
  if (action.type === 'RECOVER')
    return append(
      { ...state, online: { ...state.online, [action.node]: true } },
      `Node ${action.node} recovered as a passive member.`,
    );
  if (action.type === 'DISCONNECT')
    return append(
      { ...state, links: { ...state.links, [action.link]: false } },
      `Link ${action.link} disconnected.`,
    );
  if (action.type === 'RESTORE_LINK')
    return append(
      { ...state, links: { ...state.links, [action.link]: true } },
      `Link ${action.link} restored.`,
    );
  if (action.type === 'CRASH_SERVICE') {
    if (state.vip === 'A' || state.vip === 'B')
      return failover({ ...state, service: { ...state.service, [state.vip]: false } }, state.vip);
    return append(state, 'No single active service exists to crash.');
  }
  if (action.type === 'MOVE_VIP') {
    if (!state.online[action.node])
      return append(state, `VIP move refused: Node ${action.node} is offline.`);
    if (!nodeHasQuorum(state, action.node))
      return append(state, `VIP move refused: Node ${action.node} has no quorum.`);
    if (!state.fencing && !state.links.AB && (state.service.A || state.service.B)) {
      return append(
        { ...state, service: { ...state.service, [action.node]: true }, vip: 'both' },
        `Unsafe VIP move to Node ${action.node}: the previous owner was not fenced.`,
      );
    }
    return append(
      { ...state, service: { A: action.node === 'A', B: action.node === 'B' }, vip: action.node },
      `VIP moved safely to Node ${action.node}.`,
    );
  }
  return state;
}
