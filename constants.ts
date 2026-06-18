import {
  Globe,
  Github,
  Server,
  Network,
  Container,
  Mail,
  LayoutDashboard,
  Cloud,
  Terminal,
  Sparkles,
} from 'lucide-react';
import type { NavItem } from './types';

export const SITE_CONFIG = {
  name: 'at9.net',
  headline: 'Haitang · 个人数字门户',
  domains: ['www.at9.net', 'at9.net'],
  tagline: 'DevOps Engineer · Cloud Native · AI Vibe Coding',
  bio: '这里只保留我最常用、最值得记住的站点与工具。',
};

export const CORE_SITES: NavItem[] = [
  {
    id: 'blog',
    title: 'Tech Blog',
    url: 'https://blog.at9.net',
    description: '技术博客与思考笔记',
    icon: Terminal,
    category: 'Site',
    color: 'text-cyan-400',
  },
  {
    id: 'ip',
    title: 'IP Checker',
    url: 'https://ip.at9.net',
    description: '查看公网 IP 与网络信息',
    icon: Network,
    category: 'Tool',
    color: 'text-green-400',
  },
  {
    id: 'docker',
    title: 'Docker Mirror',
    url: 'https://docker.at9.net',
    description: 'Docker 镜像加速',
    icon: Container,
    category: 'Tool',
    color: 'text-blue-400',
  },
  {
    id: 'gh-proxy',
    title: 'GitHub Proxy',
    url: 'https://gh-proxy.at9.net/',
    description: 'GitHub 文件加速下载',
    icon: Server,
    category: 'Tool',
    color: 'text-purple-400',
  },
  {
    id: 'github-at9',
    title: 'GitHub.at9.net',
    url: 'https://github.at9.net',
    description: 'GitHub 聚合导航',
    icon: Github,
    category: 'Site',
    color: 'text-pink-400',
    isNew: true,
  },
  {
    id: '9deck',
    title: '9Deck',
    url: '/9deck/',
    description: '个人资产控制台',
    icon: LayoutDashboard,
    category: 'Tool',
    color: 'text-emerald-400',
  },
];

export const SOCIAL_LINKS: NavItem[] = [
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com/htazq',
    description: '开源项目',
    icon: Github,
    category: 'Social',
    color: 'text-white',
  },
  {
    id: 'cnb',
    title: 'CNB',
    url: 'https://cnb.cool/htazq',
    description: 'Cloud Native Build',
    icon: Cloud,
    category: 'Social',
    color: 'text-orange-400',
  },
  {
    id: 'email',
    title: 'Email',
    url: 'mailto:at9net@gmail.com',
    description: '联系',
    icon: Mail,
    category: 'Social',
    color: 'text-red-400',
  },
];

export const CATEGORIES = [
  { id: 'Site', label: '站点', color: 'bg-cyan-500/15 text-cyan-300' },
  { id: 'Tool', label: '工具', color: 'bg-emerald-500/15 text-emerald-300' },
  { id: 'Social', label: '联系', color: 'bg-slate-500/15 text-slate-300' },
] as const;
