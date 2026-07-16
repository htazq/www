import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/experiments',
  '/experiments/stack-craft',
  '/experiments/quorum',
  '/experiments/internet-garden',
  '/experiments/one-million-blocks',
  '/experiments/latency',
  '/experiments/data-scale',
  '/experiments/internet-archaeology',
  '/about',
  '/route-that-does-not-exist',
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
    await page.goto('/');
    await expect(page.getByRole('link', { name: /ENTER EXPERIMENT/ })).toHaveCount(7);
    for (let index = 0; index < 7; index += 1) {
      await page.goto('/');
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
});
