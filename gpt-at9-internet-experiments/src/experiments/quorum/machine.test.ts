import { deriveQuorumState, initialQuorumState, quorumReducer } from './machine';

describe('Quorum state machine', () => {
  it('fails over after a single node failure', () => {
    const state = quorumReducer(initialQuorumState, { type: 'SHUTDOWN', node: 'A' });
    expect(state.vip).toBe('B');
    expect(state.service.B).toBe(true);
    expect(deriveQuorumState(state).serviceAvailable).toBe(true);
  });

  it('loses quorum when only one isolated data node remains', () => {
    let state = quorumReducer(initialQuorumState, { type: 'DISCONNECT', link: 'AB' });
    state = quorumReducer(state, { type: 'DISCONNECT', link: 'AW' });
    state = quorumReducer(state, { type: 'DISCONNECT', link: 'BW' });
    expect(deriveQuorumState(state).quorum).toBe(false);
    expect(deriveQuorumState(state).refuseWrites).toBe(true);
  });

  it('flags split-brain risk without fencing', () => {
    let state = quorumReducer(initialQuorumState, { type: 'TOGGLE_FENCING' });
    state = quorumReducer(state, { type: 'DISCONNECT', link: 'AB' });
    expect(deriveQuorumState(state).splitBrainRisk).toBe(true);
  });

  it('creates dual ownership on an unsafe manual move', () => {
    let state = quorumReducer(initialQuorumState, { type: 'TOGGLE_FENCING' });
    state = quorumReducer(state, { type: 'DISCONNECT', link: 'AB' });
    state = quorumReducer(state, { type: 'MOVE_VIP', node: 'B' });
    expect(state.vip).toBe('both');
    expect(state.service.A && state.service.B).toBe(true);
    expect(deriveQuorumState(state).dataRisk).toBe('CRITICAL');
  });

  it('recovers to a safe single owner', () => {
    let state = quorumReducer(initialQuorumState, { type: 'SHUTDOWN', node: 'A' });
    state = quorumReducer(state, { type: 'RECOVER', node: 'A' });
    state = quorumReducer(state, { type: 'CLEAR_FAULTS' });
    expect(state.vip).toBe('A');
    expect(deriveQuorumState(state).dataRisk).toBe('LOW');
  });
});
