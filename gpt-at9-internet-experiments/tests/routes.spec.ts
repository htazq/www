import { expect, test } from '@playwright/test';

const routes = [
  '/experiments/',
  '/experiments/stack-craft',
  '/experiments/quorum',
  '/experiments/internet-garden',
  '/experiments/one-million-blocks',
  '/experiments/latency',
  '/experiments/data-scale',
  '/experiments/internet-archaeology',
  '/experiments/about',
  '/experiments/route-that-does-not-exist',
];

test.describe('route smoke tests', () => {
  test('all routes open directly without blank pages, console errors, or horizontal overflow', async ({
    page,
  }) => {
    for (const route of routes) {
      const errors: string[] = [];
      const listener = (message: { type(): string; text(): string }) => {
        if (message.type() === 'error') errors.push(message.text());
      };
      page.on('console', listener);
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('body')).not.toHaveText('Coming Soon');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
      expect(
        errors.filter((message) => !message.includes('favicon')),
        `console errors on ${route}`,
      ).toEqual([]);
      page.off('console', listener);
    }
  });

  test('home enters each experiment', async ({ page }) => {
    await page.goto('/experiments/');
    await expect(page.getByRole('link', { name: /ENTER EXPERIMENT/ })).toHaveCount(7);
    for (let index = 0; index < 7; index += 1) {
      await page.goto('/experiments/');
      await page
        .getByRole('link', { name: /ENTER EXPERIMENT/ })
        .nth(index)
        .click();
      await expect(page).toHaveURL(/\/experiments\//);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('deep route survives refresh', async ({ page }) => {
    await page.goto('/experiments/quorum');
    await page.reload();
    await expect(page.getByRole('heading', { name: 'QUORUM' })).toBeVisible();
  });

  test('descriptions follow the browser language', async ({ browser }) => {
    const cases = [
      { locale: 'zh-CN', expected: '将基础设施概念组合成一个可运行的 AI 数据中心。' },
      {
        locale: 'ja-JP',
        expected: 'Compose infrastructure concepts into a working AI data center.',
      },
    ];

    for (const item of cases) {
      const context = await browser.newContext({ locale: item.locale });
      const page = await context.newPage();
      await page.goto('/experiments/');
      await expect(page.locator('.exhibit-title p').first()).toHaveText(item.expected);
      await context.close();
    }
  });
});
