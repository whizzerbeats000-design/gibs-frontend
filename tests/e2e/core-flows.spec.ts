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
});
