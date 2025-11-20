export enum AI_MODE {
  ANALYZE = 'ANALYZE',
  EDIT = 'EDIT'
}

export interface AnalysisResult {
  text: string;
  error?: string;
}

export interface EditResult {
  imageUrl: string;
  error?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'Core' | 'DevOps' | 'Quant' | 'Net';
}