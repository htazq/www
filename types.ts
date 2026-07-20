import { LucideIcon } from 'lucide-react';

export type NavCategory = 'Mirror' | 'Tool' | 'Lab';

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
