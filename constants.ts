import {
  Container,
  Github,
  Network,
  FlaskConical,
} from 'lucide-react';
import type { NavItem } from './types';

export const SITE_CONFIG = {
  name: 'at9.net',
  headline: '海棠的数字空间',
  domains: ['www.at9.net', 'at9.net'],
  tagline: '免费 · 公益 · 透明 —— 基于 Cloudflare 全球网络',
  bio: '为开发者与研究者提供免费的 Docker、GitHub 镜像加速与网络工具。数据仅用于加速，不存储、不追踪。',
  poweredBy: 'Cloudflare',
};

export const MIRROR_SITES: NavItem[] = [
  {
    id: 'experiments',
    title: 'AT9 实验室',
    url: 'https://www.at9.net/experiments/',
    description: '七个关于系统、网络、规模与计算机历史的浏览器交互实验。',
    icon: FlaskConical,
    category: 'Lab',
    color: '#e8452c',
    isNew: true,
  },
  {
    id: 'docker',
    title: 'Docker 镜像加速',
    url: 'https://docker.at9.net',
    description: '免费 Docker Hub 镜像代理，快速拉取常用镜像。',
    icon: Container,
    category: 'Mirror',
    color: '#4a6fd6',
  },
  {
    id: 'github',
    title: 'GitHub 镜像加速',
    url: 'https://github.at9.net',
    description: 'GitHub 文件、Release、Raw 内容加速下载。',
    icon: Github,
    category: 'Mirror',
    color: '#9a5fd0',
    isNew: true,
  },
  {
    id: 'ip',
    title: 'IP 查看工具',
    url: 'https://ip.at9.net',
    description: '快速查看当前公网 IP、地理位置与网络信息。',
    icon: Network,
    category: 'Tool',
    color: '#3fae8a',
  },
];
