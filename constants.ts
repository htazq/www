import {
  File,
  Network,
  Container,
  Github,
  GitBranch,
  Image,
  HardDrive,
  Monitor,
  Bot,
  Server,
  Cloud,
  Mail,
} from 'lucide-react';
import type { NavItem, FriendLink, InternalService } from './types';

export const SITE_CONFIG = {
  name: 'Brooks',
  sub: 'htazq · 数字花园',
  seal: 'B',
  domains: ['www.at9.net', 'at9.net'],
  tagline: '热爱可抵岁月漫长 —— 构建 · 部署 · 分享',
  marquee: [
    'BUILD WITH PASSION',
    'You are stardust ✦',
    'STAY CURIOUS',
    '486 亿红细胞为你打工',
    'LOVE WHAT YOU DO',
    '你也是宇宙的作品',
    'KEEP CREATING',
    '每个原子都曾属于星星',
  ],
};

/** 对外公开的服务（主网格展示） */
export const MIRROR_SITES: NavItem[] = [
  {
    id: 'github-mirror',
    title: 'GitHub',
    url: 'https://github.at9.net',
    description: 'GitHub 镜像加速，clone / release 提速',
    icon: Github,
    category: 'Mirror',
    color: '#8b3dff',
  },
  {
    id: 'docker',
    title: 'Docker',
    url: 'https://docker.at9.net',
    description: 'Docker Registry 镜像加速',
    icon: Container,
    category: 'Mirror',
    color: '#1e7dff',
  },
  {
    id: 'file',
    title: 'File',
    url: 'https://file.at9.net',
    description: '免费文件传输 · 阅后即焚 · 临时中转',
    icon: File,
    category: 'Service',
    color: '#ff8a00',
  },
  {
    id: 'img',
    title: 'ImgHub',
    url: 'https://img.at9.net',
    description: 'Sanyue ImgHub 公益图床',
    icon: Image,
    category: 'Service',
    color: '#ff4d3d',
  },
  {
    id: 'ip',
    title: 'IP',
    url: 'https://ip.at9.net',
    description: '极速 IP 查询，纯文本直出',
    icon: Network,
    category: 'Tool',
    color: '#00b876',
  },
  {
    id: 'openlist',
    title: 'OpenList',
    url: 'https://openlist.at9.net',
    description: '网盘聚合 · 文件管理',
    icon: HardDrive,
    category: 'Service',
    color: '#00a3b8',
  },
];

/** 私有 / 内部服务（折叠展示） */
export const INTERNAL_SERVICES: InternalService[] = [
  { title: 'VPS 监控', url: 'https://vps.at9.net', description: 'Komari 服务器监控面板', icon: Monitor },
  { title: 'Pod 管理', url: 'https://pod.at9.net', description: 'Komodo 容器部署平台', icon: Server },
  { title: 'AI Web', url: 'https://ai.at9.net', description: 'AI 应用入口', icon: Bot },
  { title: 'CLI Proxy', url: 'https://cliproxy.at9.net', description: '模型代理服务', icon: Cloud },
];

export const FRIEND_LINKS: FriendLink[] = [
  { id: 'github', title: 'GitHub', url: 'https://github.com/htazq', description: '@htazq', icon: Github },
  { id: 'cnb', title: 'CNB', url: 'https://cnb.cool/htazq', description: '@htazq', icon: GitBranch },
  { id: 'email', title: 'Email', url: 'mailto:at9net@gmail.com', description: 'at9net@gmail.com', icon: Mail },
];
