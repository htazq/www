import { LucideIcon } from 'lucide-react';

export type NavCategory = 'Official' | 'Project' | 'Social' | 'Tool' | 'Mirror' | 'Finance' | 'AI' | 'Dev' | 'Storage';

export interface NavItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: LucideIcon | string;
  category: NavCategory;
  color: string;
  badge?: string;
  tags?: string[];
  language?: string;
  stars?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface TechSkill {
  name: string;
  level: number; // 1-100
  icon?: string;
}

export interface Quote {
  id: number;
  category: string;
  content: string;
}
