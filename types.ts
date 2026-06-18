import type { LucideIcon } from 'lucide-react';

export type NavCategory = 'Site' | 'Tool' | 'Social';

export interface NavItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: LucideIcon | string;
  category: NavCategory;
  color: string;
  isNew?: boolean;
}

export interface Quote {
  id: number;
  category: string;
  content: string;
}
