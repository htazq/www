import { LucideIcon } from 'lucide-react';

export type NavCategory = 'Mirror' | 'Tool' | 'Service' | 'Blog';

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

export interface FriendLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: LucideIcon | string;
}

export interface InternalService {
  title: string;
  url: string;
  description: string;
  icon: LucideIcon | string;
}
