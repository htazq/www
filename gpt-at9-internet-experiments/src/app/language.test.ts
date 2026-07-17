import { getSiteLanguage, localize } from './language';

const copy = { zh: '中文', en: 'English' };

it('uses Chinese for zh browser languages', () => {
  expect(getSiteLanguage('zh-CN')).toBe('zh');
  expect(getSiteLanguage('zh-TW')).toBe('zh');
  expect(localize(copy, 'zh-Hans')).toBe('中文');
});

it('uses English for every non-Chinese browser language', () => {
  expect(getSiteLanguage('en-US')).toBe('en');
  expect(getSiteLanguage('ja-JP')).toBe('en');
  expect(localize(copy, 'fr-FR')).toBe('English');
});
