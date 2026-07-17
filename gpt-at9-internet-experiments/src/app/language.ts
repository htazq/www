export type SiteLanguage = 'zh' | 'en';

export interface LocalizedText {
  zh: string;
  en: string;
}

export function getSiteLanguage(language = globalThis.navigator?.language ?? 'en'): SiteLanguage {
  return /^zh(?:-|$)/i.test(language) ? 'zh' : 'en';
}

export function localize(text: LocalizedText, language?: string): string {
  return text[getSiteLanguage(language)];
}
