import { File, Network, Container, Github } from 'lucide-react';
import type { NavItem } from './types';

export const SITE_CONFIG = {
  name: 'at9.net',
  headline: '海棠的数字空间',
  domains: ['www.at9.net', 'at9.net'],
  tagline: '基于 EdgeOne 全球网络',
};

export const MIRROR_SITES: NavItem[] = [
  {
    id: 'file',
    title: 'File',
    url: 'https://file.at9.net',
    description: '文件服务',
    icon: File,
    category: 'Service',
    color: '#f0a832',
  },
  {
    id: 'ip',
    title: 'IP',
    url: 'https://ip.at9.net',
    description: 'IP 查看工具',
    icon: Network,
    category: 'Tool',
    color: '#3fae8a',
  },
  {
    id: 'docker',
    title: 'Docker',
    url: 'https://docker.at9.net',
    description: 'Docker 镜像加速',
    icon: Container,
    category: 'Mirror',
    color: '#4a6fd6',
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.at9.net',
    description: 'GitHub 镜像加速',
    icon: Github,
    category: 'Mirror',
    color: '#9a5fd0',
  },
];
