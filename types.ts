import { LucideIcon } from 'lucide-react';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: LucideIcon;
  category: 'Project' | 'Social' | 'Tool';
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TechSkill {
  name: string;
  level: number; // 1-100
  icon?: string;
}
