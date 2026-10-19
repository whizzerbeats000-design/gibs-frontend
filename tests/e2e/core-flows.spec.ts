import { test, expect } from '@playwright/test';

/**
 * GIBS Core Regression Suite
 *
 * This suite focuses on high-impact, deterministic user journeys.
 * It complements the forensic sweep in scripts/qa/regression.mjs.
 */

test.describe('Core User Journeys', () => {

  test('Homepage loads and navigates to Programmes', async ({ page }) => {
    await page.goto('/');

    // Verify page is loaded
    await expect(page.locator('h1')).toBeVisible();

    // Navigate to Programmes
    await page.click('text=Explore programmes');
    await expect(page).toHaveURL(/\/programmes/);
    await expect(page.locator('h1')).toContainText('Programmes');
  });

  test('SPA navigation keeps canonical and social metadata in sync', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore programmes' }).first().click();
    await expect(page.locator('h1')).toContainText('Programmes');

    await expect(page).toHaveTitle('2026 Training Calendar (135 Programmes) — GIBS');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://gibs.com.ng/programmes');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://gibs.com.ng/programmes');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', '2026 Training Calendar (135 Programmes) — GIBS');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', '2026 Training Calendar (135 Programmes) — GIBS');
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Programmes in Kigali, Dubai, London, and Houston.');
  });

  test('keyboard focus reveals interactive content inside a pending scroll reveal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/contact');

    const reveal = page.locator('[data-reveal="hidden"]').filter({
      has: page.locator('a[href^="mailto:"]'),
    }).first();
    await expect(reveal).toHaveCount(1);
    const state = await reveal.evaluate((element) => {
      const link = element.querySelector('a[href^="mailto:"]');
      link?.focus();
      return {
        revealState: element.getAttribute('data-reveal'),
        opacity: getComputedStyle(element).opacity,
      };
    });
    expect(state.revealState).toBe('hidden');
    await expect.poll(async () => {
      const fresh = await reveal.evaluate((element) => getComputedStyle(element).opacity);
      return fresh;
    }, { message: 'focus-within should reveal hidden element', timeout: 5000 }).toBe('1');
  });

  test('Valid clean programme route and unknown hash route', async ({ page }) => {
    await page.goto('/programmes/course-1-public-sector-accounting-procedure-and-standards');
    await expect(page.locator('h1')).toContainText('Public Sector Accounting');

    await page.goto('/#/not-a-real-route');
    await expect(page.locator('h1')).toHaveText('Page not found');
  });

  test('Gallery lightbox flow', async ({ page }) => {
    await page.goto('/gallery');

    // Open first image
    const firstImage = page.locator('button[aria-label*="View"]').first();
    await firstImage.click();

    // Verify lightbox is open
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();

    // Close lightbox
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"][aria-modal="true"]')).not.toBeVisible();
  });

  test('Contact page links are valid', async ({ page }) => {
    await page.goto('/contact');

    const emailLinks = page.locator('a[href^="mailto:"]');
    await expect(emailLinks.first()).toBeVisible();

    const phoneLinks = page.locator('a[href^="tel:"]');
    await expect(phoneLinks.first()).toBeVisible();
  });

  test('Responsive behavior: no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12/13/14
    await page.goto('/');

    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('Concierge history expires when older than 24 hours', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('gibs-concierge-v2', JSON.stringify({
        savedAt: Date.now() - 25 * 60 * 60 * 1000,
        messages: [{ id: 1, role: 'user', text: 'expired conversation marker' }],
      }));
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open GIBS AI' }).first().click();

    const dialog = page.getByRole('dialog', { name: 'GIBS AI' });
    await expect(dialog.getByText('expired conversation marker')).toHaveCount(0);
    await expect(dialog.getByText(/stored locally in this browser/i)).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('gibs-concierge-v2'))).toBeNull();
  });

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900, route: '/programmes' },
    { name: 'mobile', width: 390, height: 844, route: '/' },
  ]) {
    test(`Concierge history can be cleared on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(viewport.route);
      await page.getByRole('button', { name: 'Open GIBS AI' }).first().click();

      const dialog = page.getByRole('dialog', { name: 'GIBS AI' });
      await dialog.getByLabel('Ask GIBS AI').fill('message for reset verification');
      await dialog.getByRole('button', { name: 'Send message' }).click();
      await expect(dialog.getByText('message for reset verification')).toBeVisible();
      await expect.poll(() => page.evaluate(() => localStorage.getItem('gibs-concierge-v2'))).not.toBeNull();

      await dialog.getByRole('button', { name: 'Clear history' }).click();
      await expect(dialog.getByText(/Welcome to GIBS AI/)).toBeVisible();
      await expect(dialog.getByText('message for reset verification')).toHaveCount(0);
      await page.waitForTimeout(750);
      await expect.poll(() => page.evaluate(() => localStorage.getItem('gibs-concierge-v2'))).toBeNull();
    });
  }
});
