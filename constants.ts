import { Github, Globe, Server, Network, Container, Mail } from 'lucide-react';
import { LinkItem } from './types';

export const SITE_CONFIG = {
  name: '海棠 (Haitang)',
  domains: ['www.at9.net', 'at9.net'],
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
    title: 'CNB 平台',
    url: 'https://cnb.cool/htazq',
    description: 'Cloud Native Build 超牛逼',
    icon: 'https://cnb.cool/images/favicon.png',
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
    url: 'https://ip.at9.net',
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