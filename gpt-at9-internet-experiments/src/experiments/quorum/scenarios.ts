export const quorumScenarios = [
  {
    id: 'node-failure',
    title: '单节点故障',
    goal: '在节点 A 关机之后，保持服务可用。',
    steps: ['关闭节点 A', '确认节点 B 拥有仲裁', '观察虚拟 IP 的自动迁移'],
    success: '存活的一个数据节点加上见证者，构成多数派。',
  },
  {
    id: 'partition',
    title: '网络分区',
    goal: '把 A 与 B 隔开，同时不允许出现两个写入者。',
    steps: ['断开 A—B 链路', '保持隔离机制开启', '观察唯一的服务所有者'],
    success: '隔离机制在分区期间保住了独占所有权。',
  },
  {
    id: 'witness',
    title: '见证者丢失',
    goal: '理解为什么两个相连的数据节点仍然拥有仲裁。',
    steps: ['断开 A—W 与 B—W', '保持 A—B 相连', '查看投票数'],
    success: 'A 与 B 仍然能拿到三票中的两票。',
  },
  {
    id: 'unsafe',
    title: '危险的故障转移',
    goal: '制造一次脑裂风险，然后解除它。',
    steps: ['关闭隔离机制', '断开 A—B 链路', '把虚拟 IP 迁到节点 B', '重新开启隔离并清除故障'],
    success: '没有隔离机制时，无法证明被隔离的原所有者已经停止。',
  },
] as const;
