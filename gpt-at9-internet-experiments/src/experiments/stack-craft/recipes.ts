export interface Recipe {
  inputs: readonly [string, string];
  result: string;
  note: string;
}

export const initialElements = [
  'Linux',
  'Process',
  'Memory',
  'Disk',
  'Network',
  'Code',
  'Machine',
  'User',
] as const;

export const recipes: Recipe[] = [
  {
    inputs: ['Linux', 'Disk'],
    result: 'File System',
    note: 'A kernel turns block devices into named, durable data.',
  },
  {
    inputs: ['Machine', 'Machine'],
    result: 'Cluster',
    note: 'Multiple machines become one operational unit.',
  },
  {
    inputs: ['Network', 'Memory'],
    result: 'RDMA',
    note: 'The network reaches memory with minimal CPU involvement.',
  },
  {
    inputs: ['Disk', 'Disk'],
    result: 'Redundancy',
    note: 'Duplicate media can survive a single loss.',
  },
  {
    inputs: ['Disk', 'Redundancy'],
    result: 'RAID',
    note: 'Redundancy is organized across block devices.',
  },
  {
    inputs: ['File System', 'Network'],
    result: 'Network File System',
    note: 'Files cross a network boundary.',
  },
  {
    inputs: ['Network File System', 'Cluster'],
    result: 'Distributed Storage',
    note: 'Storage capacity and metadata span machines.',
  },
  {
    inputs: ['Process', 'Memory'],
    result: 'Queue',
    note: 'Work waits in memory for a process to consume it.',
  },
  {
    inputs: ['Network', 'Queue'],
    result: 'Congestion',
    note: 'Demand accumulates faster than the network drains it.',
  },
  {
    inputs: ['Process', 'Process'],
    result: 'Thread',
    note: 'Execution is divided into independently scheduled flows.',
  },
  {
    inputs: ['Thread', 'Process'],
    result: 'Parallelism',
    note: 'More than one flow advances at the same time.',
  },
  {
    inputs: ['Machine', 'Parallelism'],
    result: 'GPU',
    note: 'A machine gains a massively parallel accelerator.',
  },
  {
    inputs: ['GPU', 'Cluster'],
    result: 'GPU Cluster',
    note: 'Accelerators are pooled across nodes.',
  },
  {
    inputs: ['GPU Cluster', 'Distributed Storage'],
    result: 'AI Infrastructure',
    note: 'Compute and data become one training platform.',
  },
  {
    inputs: ['Machine', 'Disk'],
    result: 'Power',
    note: 'Hardware requires a stable electrical budget.',
  },
  {
    inputs: ['Machine', 'Memory'],
    result: 'Cooling',
    note: 'Dense compute requires heat removal.',
  },
  {
    inputs: ['AI Infrastructure', 'Power'],
    result: 'Compute Hall',
    note: 'AI infrastructure receives facility-grade power.',
  },
  {
    inputs: ['Compute Hall', 'Cooling'],
    result: 'AI Data Center',
    note: 'Compute, storage, power, and cooling form the final system.',
  },
  {
    inputs: ['User', 'Process'],
    result: 'Isolation',
    note: 'A user boundary limits what a process can affect.',
  },
  {
    inputs: ['Process', 'Isolation'],
    result: 'Container',
    note: 'A process receives an isolated runtime view.',
  },
  {
    inputs: ['Linux', 'Container'],
    result: 'Container Host',
    note: 'Linux runs isolated application environments.',
  },
  {
    inputs: ['Cluster', 'Queue'],
    result: 'Scheduler',
    note: 'Queued work is placed across available machines.',
  },
  {
    inputs: ['Container Host', 'Scheduler'],
    result: 'Kubernetes',
    note: 'Container placement and lifecycle become declarative.',
  },
  {
    inputs: ['Code', 'User'],
    result: 'Source Code',
    note: 'Human intent is expressed as text for machines.',
  },
  {
    inputs: ['Code', 'Process'],
    result: 'Compiler',
    note: 'A process translates source into executable form.',
  },
  {
    inputs: ['Compiler', 'Source Code'],
    result: 'Binary',
    note: 'Source becomes machine-executable output.',
  },
  {
    inputs: ['Binary', 'Process'],
    result: 'Service',
    note: 'A binary runs continuously to provide a capability.',
  },
  {
    inputs: ['Linux', 'Process'],
    result: 'Service Manager',
    note: 'Linux supervises process lifecycle.',
  },
  {
    inputs: ['Service Manager', 'Service'],
    result: 'Managed Service',
    note: 'A service gains restart and dependency policy.',
  },
  {
    inputs: ['Network', 'Service'],
    result: 'Load Balancer',
    note: 'Requests are distributed across service instances.',
  },
  {
    inputs: ['Cluster', 'Load Balancer'],
    result: 'Virtual IP',
    note: 'One address represents multiple possible owners.',
  },
  {
    inputs: ['Cluster', 'Virtual IP'],
    result: 'High Availability',
    note: 'Service identity can move when a node fails.',
  },
  {
    inputs: ['Service', 'Memory'],
    result: 'Metrics',
    note: 'A running service records operational measurements.',
  },
  {
    inputs: ['Service', 'Metrics'],
    result: 'Monitoring',
    note: 'Measurements become system observations.',
  },
  {
    inputs: ['Disk', 'Process'],
    result: 'Failure',
    note: 'A process encounters unavailable durable state.',
  },
  {
    inputs: ['Monitoring', 'Failure'],
    result: 'Broken Monitor',
    note: 'A failed observer reports the wrong health state.',
  },
  {
    inputs: ['High Availability', 'Broken Monitor'],
    result: 'Restart Loop',
    note: 'Bad health signals repeatedly trigger recovery.',
  },
  {
    inputs: ['Code', 'Disk'],
    result: 'Script',
    note: 'Instructions are stored for repeatable execution.',
  },
  {
    inputs: ['Script', 'Scheduler'],
    result: 'Automation',
    note: 'Scheduled scripts remove manual repetition.',
  },
  {
    inputs: ['Code', 'Automation'],
    result: 'CI/CD',
    note: 'Changes are built, tested, and delivered automatically.',
  },
  {
    inputs: ['Network', 'Process'],
    result: 'Socket',
    note: 'A process gains an endpoint for network communication.',
  },
  {
    inputs: ['Socket', 'Service'],
    result: 'API',
    note: 'A service exposes a structured network contract.',
  },
  {
    inputs: ['API', 'User'],
    result: 'Client',
    note: 'A user-facing program consumes a service contract.',
  },
  {
    inputs: ['Client', 'Network'],
    result: 'Internet Application',
    note: 'A client reaches remote services through the network.',
  },
  {
    inputs: ['Memory', 'Disk'],
    result: 'Virtual Memory',
    note: 'Disk extends the apparent address space.',
  },
  {
    inputs: ['Memory', 'Thread'],
    result: 'Cache',
    note: 'Frequently used data stays close to execution.',
  },
  {
    inputs: ['Cache', 'Network'],
    result: 'CDN',
    note: 'Cached content is distributed near users.',
  },
  {
    inputs: ['User', 'Linux'],
    result: 'Terminal',
    note: 'A user operates Linux through a text interface.',
  },
  {
    inputs: ['Terminal', 'Network'],
    result: 'Remote Shell',
    note: 'The terminal controls a remote machine.',
  },
  {
    inputs: ['Remote Shell', 'Automation'],
    result: 'Configuration Management',
    note: 'Remote changes become repeatable and declarative.',
  },
  {
    inputs: ['Configuration Management', 'Cluster'],
    result: 'Fleet',
    note: 'A cluster is managed as a consistent machine population.',
  },
  {
    inputs: ['Fleet', 'Monitoring'],
    result: 'Operations',
    note: 'Management and observation become an operating discipline.',
  },
  {
    inputs: ['File System', 'Redundancy'],
    result: 'Snapshot',
    note: 'Durable state gains recoverable points in time.',
  },
  {
    inputs: ['Snapshot', 'Network'],
    result: 'Backup',
    note: 'Recoverable state is copied beyond the local failure domain.',
  },
  {
    inputs: ['Backup', 'Cluster'],
    result: 'Disaster Recovery',
    note: 'A service can be rebuilt after site-level failure.',
  },
  {
    inputs: ['RDMA', 'Distributed Storage'],
    result: 'Low-Latency Storage',
    note: 'Remote data paths reduce protocol overhead.',
  },
  {
    inputs: ['Low-Latency Storage', 'GPU Cluster'],
    result: 'Training Fabric',
    note: 'Storage and accelerators share a high-throughput fabric.',
  },
  {
    inputs: ['Kubernetes', 'GPU'],
    result: 'GPU Operator',
    note: 'Accelerator drivers and scheduling become cluster-managed.',
  },
  {
    inputs: ['GPU Operator', 'Distributed Storage'],
    result: 'AI Platform',
    note: 'Accelerators and data services gain a common control plane.',
  },
  {
    inputs: ['AI Platform', 'CI/CD'],
    result: 'MLOps',
    note: 'Model delivery follows an automated lifecycle.',
  },
  {
    inputs: ['API', 'Load Balancer'],
    result: 'Gateway',
    note: 'Traffic policy is centralized at a network boundary.',
  },
  {
    inputs: ['Gateway', 'Monitoring'],
    result: 'Observability',
    note: 'Traffic, metrics, and failures can be correlated.',
  },
  {
    inputs: ['Observability', 'Automation'],
    result: 'Auto Remediation',
    note: 'Known failures trigger controlled corrective actions.',
  },
  {
    inputs: ['Auto Remediation', 'High Availability'],
    result: 'Self-Healing Cluster',
    note: 'Recovery policy responds without waiting for an operator.',
  },
  {
    inputs: ['RAID', 'File System'],
    result: 'Storage Pool',
    note: 'Redundant block capacity becomes a usable namespace.',
  },
  {
    inputs: ['Storage Pool', 'Snapshot'],
    result: 'Copy-on-Write',
    note: 'New versions share unchanged blocks.',
  },
  {
    inputs: ['Copy-on-Write', 'Container'],
    result: 'Container Image',
    note: 'Layered files package an application runtime.',
  },
  {
    inputs: ['Container Image', 'Network'],
    result: 'Registry',
    note: 'Images are distributed through a content service.',
  },
  {
    inputs: ['Registry', 'Kubernetes'],
    result: 'Deployment',
    note: 'A desired application version is rolled across the cluster.',
  },
  {
    inputs: ['Deployment', 'Load Balancer'],
    result: 'Rolling Service',
    note: 'Traffic continues while instances are replaced.',
  },
  {
    inputs: ['Queue', 'Service'],
    result: 'Worker Pool',
    note: 'Multiple service instances consume queued work.',
  },
  {
    inputs: ['Worker Pool', 'Scheduler'],
    result: 'Batch System',
    note: 'Large jobs are queued and placed across resources.',
  },
  {
    inputs: ['Batch System', 'GPU Cluster'],
    result: 'Training Queue',
    note: 'Accelerator jobs wait for distributed capacity.',
  },
  {
    inputs: ['Training Queue', 'AI Platform'],
    result: 'Model Factory',
    note: 'Datasets, jobs, and delivery form a repeatable pipeline.',
  },
];

export const elementDescriptions: Record<string, string> = Object.fromEntries(
  [...initialElements, ...recipes.map((recipe) => recipe.result)].map((name) => [
    name,
    recipes.find((recipe) => recipe.result === name)?.note ??
      `A foundational ${name.toLowerCase()} concept.`,
  ]),
);
