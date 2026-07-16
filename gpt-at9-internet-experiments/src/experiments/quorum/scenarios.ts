export const quorumScenarios = [
  {
    id: 'node-failure',
    title: 'Single node failure',
    goal: 'Keep the service available after Node A is shut down.',
    steps: ['Shut down Node A', 'Confirm Node B has quorum', 'Inspect the automatic VIP move'],
    success: 'One surviving data node plus the witness forms a majority.',
  },
  {
    id: 'partition',
    title: 'Network partition',
    goal: 'Separate A and B without allowing two writers.',
    steps: ['Disconnect A—B', 'Keep fencing enabled', 'Observe the single service owner'],
    success: 'Fencing preserves exclusive ownership during the partition.',
  },
  {
    id: 'witness',
    title: 'Witness lost',
    goal: 'Understand why two connected data nodes still have quorum.',
    steps: ['Disconnect A—W and B—W', 'Keep A—B connected', 'Inspect the vote count'],
    success: 'A and B can still reach two of three votes.',
  },
  {
    id: 'unsafe',
    title: 'Dangerous failover',
    goal: 'Create and then resolve a split-brain risk.',
    steps: [
      'Disable fencing',
      'Disconnect A—B',
      'Move the VIP to Node B',
      'Re-enable fencing and clear faults',
    ],
    success: 'Without fencing, an isolated previous owner cannot be proven stopped.',
  },
] as const;
