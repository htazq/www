export type ExhibitCategory =
  'protocol' | 'community' | 'media' | 'virtualization' | 'infrastructure' | 'intelligence';
export interface Exhibit {
  id: string;
  name: string;
  era: string;
  year: number;
  category: ExhibitCategory;
  definition: string;
  interface: string;
  uses: string;
  problem: string;
  limits: string;
  future: string;
  legacy: string;
  demo:
    | 'terminal'
    | 'ftp'
    | 'bbs'
    | 'player'
    | 'flash'
    | 'rss'
    | 'irc'
    | 'vm'
    | 'layers'
    | 'scheduler'
    | 'tokens'
    | 'agent';
}
export const exhibits: Exhibit[] = [
  {
    id: 'telnet',
    name: 'Telnet',
    era: '1970s–1980s',
    year: 1971,
    category: 'protocol',
    definition: 'A plain-text remote terminal protocol.',
    interface: 'Monochrome command lines and immediate character echo.',
    uses: 'Remote administration, network devices, university systems.',
    problem: 'Made distant computers feel locally operable.',
    limits: 'No encryption; credentials and content travel in clear text.',
    future: 'People imagined universal remote access to shared computing.',
    legacy: 'Its interaction model survives in SSH and web-based terminals.',
    demo: 'terminal',
  },
  {
    id: 'ftp',
    name: 'FTP',
    era: '1970s–1990s',
    year: 1973,
    category: 'protocol',
    definition: 'A protocol for listing and transferring files.',
    interface: 'Two panes, directory trees, transfer queues, status codes.',
    uses: 'Software distribution, website publishing, research datasets.',
    problem: 'Moved files across incompatible machines and networks.',
    limits: 'Separate control/data channels, awkward firewalls, weak security defaults.',
    future: 'Every archive could become remotely browsable.',
    legacy: 'Transfer semantics live on in SFTP, object storage, and sync tools.',
    demo: 'ftp',
  },
  {
    id: 'bbs',
    name: 'BBS',
    era: '1980s–1990s',
    year: 1978,
    category: 'community',
    definition: 'A dial-up or networked bulletin board community.',
    interface: 'Numbered text menus, topic lists, handles, and message threads.',
    uses: 'Local communities, file exchange, technical support, games.',
    problem: 'Connected people before the commercial web.',
    limits: 'Slow modems, one-line systems, local reach, fragmented identity.',
    future: 'A global public square assembled from local boards.',
    legacy: 'Forums, threaded comments, moderation roles, and online handles.',
    demo: 'bbs',
  },
  {
    id: 'winamp',
    name: 'Winamp-era player',
    era: 'late 1990s',
    year: 1997,
    category: 'media',
    definition: 'A compact desktop interface for personal digital music.',
    interface: 'Dense buttons, equalizer bars, playlist rows, custom visual language.',
    uses: 'MP3 libraries, playlists, desktop listening.',
    problem: 'Turned downloaded audio files into a personal broadcast station.',
    limits: 'Local files, inconsistent metadata, limited device sync.',
    future: 'Every listener would program their own always-available station.',
    legacy: 'Play queues, skins, visualizers, and personal media libraries.',
    demo: 'player',
  },
  {
    id: 'flash',
    name: 'Flash-era web',
    era: 'late 1990s–2000s',
    year: 1996,
    category: 'media',
    definition: 'A browser runtime for vector animation and interactive media.',
    interface: 'Animated navigation, vector scenes, embedded games and intros.',
    uses: 'Games, education, ads, experimental websites, video players.',
    problem: 'Delivered rich motion before browsers had mature native APIs.',
    limits: 'Plugin dependency, accessibility gaps, battery and security costs.',
    future: 'The browser would become a universal interactive cinema.',
    legacy: 'Canvas, SVG, Web Audio, WebGL, and richer CSS replaced much of it.',
    demo: 'flash',
  },
  {
    id: 'rss',
    name: 'RSS',
    era: '2000s',
    year: 1999,
    category: 'protocol',
    definition: 'A machine-readable feed of newly published items.',
    interface: 'Subscription lists, unread counters, chronological headlines.',
    uses: 'Blogs, podcasts, news aggregation, software releases.',
    problem: 'Let readers pull updates without visiting every site.',
    limits: 'Publisher inconsistency, feed discovery, business models favoring platforms.',
    future: 'Users would own a personalized stream assembled from the open web.',
    legacy: 'Podcast distribution, syndication, and renewed independent feed readers.',
    demo: 'rss',
  },
  {
    id: 'irc',
    name: 'IRC',
    era: '1990s–present',
    year: 1988,
    category: 'community',
    definition: 'A real-time text chat protocol organized around channels.',
    interface: 'Nicknames, channel lists, terse commands, timestamped text.',
    uses: 'Open-source coordination, communities, support, live events.',
    problem: 'Made lightweight group conversation possible on modest networks.',
    limits: 'Identity friction, spam, fragmented networks, limited rich media.',
    future: 'Persistent public rooms for every topic and project.',
    legacy: 'Slack, Discord, Matrix, and chatops retain channel-based interaction.',
    demo: 'irc',
  },
  {
    id: 'vmware',
    name: 'VMware-era virtualization',
    era: 'late 1990s–2000s',
    year: 1999,
    category: 'virtualization',
    definition: 'Software-defined computers running inside a host machine.',
    interface: 'A host console with isolated guest windows and virtual devices.',
    uses: 'Server consolidation, testing, legacy applications, disaster recovery.',
    problem: 'Separated operating systems from specific physical machines.',
    limits: 'Resource overhead, image sprawl, slower provisioning than containers.',
    future: 'Data centers would become pools of movable virtual machines.',
    legacy: 'Cloud infrastructure, snapshots, migration, and software-defined hardware.',
    demo: 'vm',
  },
  {
    id: 'docker',
    name: 'Docker',
    era: '2010s',
    year: 2013,
    category: 'infrastructure',
    definition: 'A developer-friendly model for packaging processes in layered images.',
    interface: 'Image layers, Dockerfiles, registries, short CLI commands.',
    uses: 'Reproducible development, deployment, CI, microservices.',
    problem: 'Reduced environment drift between laptops, CI, and servers.',
    limits: 'Kernel sharing, image supply-chain risk, networking and storage complexity.',
    future: 'Applications would ship as portable units everywhere.',
    legacy: 'OCI images and container workflows became infrastructure primitives.',
    demo: 'layers',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    era: 'mid 2010s–present',
    year: 2014,
    category: 'infrastructure',
    definition: 'A declarative control plane for scheduling and operating containers.',
    interface: 'Desired state manifests, pods, nodes, controllers, events.',
    uses: 'Service deployment, scaling, resilience, platform engineering.',
    problem: 'Coordinated container placement and lifecycle across clusters.',
    limits: 'Operational complexity, abstraction leakage, steep debugging costs.',
    future: 'Infrastructure would continuously reconcile itself toward declared intent.',
    legacy: 'Reconciliation loops and platform APIs now shape modern operations.',
    demo: 'scheduler',
  },
  {
    id: 'llm',
    name: 'LLM',
    era: '2020s',
    year: 2020,
    category: 'intelligence',
    definition: 'A statistical model that generates token sequences from context.',
    interface: 'Prompt fields, streaming text, context windows, probability controls.',
    uses: 'Writing, coding, search assistance, summarization, analysis.',
    problem: 'Made broad language tasks accessible through a single interface.',
    limits: 'Hallucination, context limits, cost, latency, opaque reasoning.',
    future: 'Natural language could become a general interface to computation.',
    legacy: 'Still being formed: copilots, multimodal interfaces, and model-driven tools.',
    demo: 'tokens',
  },
  {
    id: 'agent',
    name: 'Agent',
    era: 'mid 2020s',
    year: 2024,
    category: 'intelligence',
    definition:
      'A model-guided loop that plans, invokes tools, observes results, and verifies progress.',
    interface: 'Goals, plans, tool calls, checkpoints, logs, and approval gates.',
    uses: 'Coding, research, operations, workflow execution.',
    problem: 'Extended language models from responses into multi-step action.',
    limits: 'Reliability, permissions, cost, compounding errors, verification burden.',
    future: 'Software may be operated through delegated goals rather than direct commands.',
    legacy: 'Too early to know; tool protocols and evaluation loops are emerging foundations.',
    demo: 'agent',
  },
];
