import { Github, Globe, Server, Network, Terminal, Cloud, Container } from 'lucide-react';
import { LinkItem } from './types';

export const SITE_CONFIG = {
  name: '海棠 (Haitang)',
  domains: ['www.at9.net', 'at9.net'],
  motto: 'AI认知的马太效应：今天，人与人之间最大的差距，不再是努力程度，而是对AI的认知深度。在智能倍速下，无效的勤奋，只会加速你的落伍。',
  titles: ['DevOps Engineer', 'Cloud Native Explorer', 'AI Enthusiast', 'Vibe Coding'],
};

export const LINKS: LinkItem[] = [
  {
    id: 'blog',
    title: 'Tech Blog',
    url: 'https://blog.at9.net',
    description: '我的技术博客，记录运维与AI学习之路',
    icon: Globe,
    category: 'Social',
    color: 'text-cyan-400',
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com/htazq',
    description: '开源项目与代码仓库',
    icon: Github,
    category: 'Social',
    color: 'text-white',
  },
  {
    id: 'cnb',
    title: 'CNB Profile',
    url: 'https://cnb.cool/htazq',
    description: 'Cloud Native Build 账户',
    icon: Cloud,
    category: 'Social',
    color: 'text-orange-400',
  },
  {
    id: 'docker',
    title: 'Docker Mirror',
    url: 'https://docker.at9.net',
    description: 'Docker 镜像加速服务',
    icon: Container,
    category: 'Tool',
    color: 'text-blue-500',
  },
  {
    id: 'ip',
    title: 'IP Lookup',
    url: 'http://ip.at9.net',
    description: '快速获取本机公网IP信息',
    icon: Network,
    category: 'Tool',
    color: 'text-green-400',
  },
  {
    id: 'gh-proxy',
    title: 'GitHub Proxy',
    url: 'https://gh-proxy.at9.net/',
    description: 'GitHub 文件加速下载服务',
    icon: Server,
    category: 'Tool',
    color: 'text-purple-400',
  },
];

export const TERMINAL_WELCOME = [
  "Initializing connection to at9.net...",
  "Loading module: Vibe Coding...",
  "Loading module: Cloud Native...",
  "Access granted. Welcome, user.",
];