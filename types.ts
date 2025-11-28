import { LucideIcon } from 'lucide-react';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: LucideIcon | string;
  category: 'Project' | 'Social' | 'Tool';
  color: string;
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
