import {
  Server,
  Network,
  Container,
  Github,
  Cloud,
  Shield,
  Zap,
} from 'lucide-react';
import type { NavItem } from './types';

export const SITE_CONFIG = {
  name: 'at9.net',
  headline: '免费公益镜像加速',
  domains: ['www.at9.net', 'at9.net'],
  tagline: '基于 Cloudflare 全球网络 · 免费 · 稳定 · 透明',
  bio: '为开发者和研究者提供免费的 Docker、GitHub 与网络工具镜像服务。数据仅用于加速，不存储、不追踪。',
  poweredBy: 'Cloudflare',
};

export const MIRROR_SITES: NavItem[] = [
  {
    id: 'docker',
    title: 'Docker 镜像加速',
    url: 'https://docker.at9.net',
    description: '免费 Docker Hub 镜像代理，快速拉取常用镜像。',
    icon: Container,
    category: 'Mirror',
    color: 'text-blue-400',
  },
  {
    id: 'github',
    title: 'GitHub 镜像加速',
    url: 'https://github.at9.net',
    description: 'GitHub 文件、Release、Raw 内容加速下载。',
    icon: Github,
    category: 'Mirror',
    color: 'text-purple-400',
    isNew: true,
  },
  {
    id: 'ip',
    title: 'IP 查看工具',
    url: 'https://ip.at9.net',
    description: '快速查看当前公网 IP、地理位置与网络信息。',
    icon: Network,
    category: 'Tool',
    color: 'text-green-400',
  },
];

export const TRUST_BADGES = [
  { icon: Cloud, label: 'Cloudflare 全球加速', color: 'text-orange-400' },
  { icon: Shield, label: '无日志、不追踪', color: 'text-emerald-400' },
  { icon: Zap, label: '免费公益服务', color: 'text-yellow-400' },
  { icon: Server, label: '7×24 小时可用', color: 'text-cyan-400' },
];
