import { useEffect } from 'react';
import { siteConfig } from './siteConfig';

export interface PageMetadata {
  title: string;
  description: string;
  path: string;
  themeColor?: string;
}

function setMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    const [name, key] =
      attribute === 'property'
        ? ['property', selector.match(/"(.+)"/)?.[1]]
        : ['name', selector.match(/"(.+)"/)?.[1]];
    if (key) element.setAttribute(name, key);
    document.head.append(element);
  }
  element.setAttribute('content', value);
}

export function usePageMetadata({
  title,
  description,
  path,
  themeColor = '#111418',
}: PageMetadata) {
  useEffect(() => {
    document.title = `${title} — ${siteConfig.name}`;
    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[name="theme-color"]', 'name', themeColor);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = `${siteConfig.origin}${path}`;
  }, [description, path, themeColor, title]);
}
