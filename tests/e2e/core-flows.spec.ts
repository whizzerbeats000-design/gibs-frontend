import { test, expect } from '@playwright/test';

/**
 * The Reveal component's guaranteed-resolve fallback delay, in milliseconds.
 * Kept in step with `REVEAL_FALLBACK_MS` in src/components/motion.tsx; the
 * reveal test below suppresses exactly this timer so that it can observe a
 * section while it is still pending. If the constant there changes, the
 * suppression stops matching and that test fails on its own "still hidden"
 * assertion rather than passing for the wrong reason.
 */
const REVEAL_FALLBACK_MS = 1200;

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

  test('Privacy Policy is directly reachable and keyboard-accessible from the footer', async ({ page }) => {
    await page.goto('/');
    const policyLink = page.getByRole('link', { name: 'Privacy Policy' });
    await policyLink.focus();
    await expect(policyLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible();
    await expect(page).toHaveTitle('Privacy Policy | Goshen International Business School');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://gibs.com.ng/privacy-policy'
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/privacy-policy');
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
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

    /* Hold the section in its pending state.
       `Reveal` resolves a section when it scrolls into view, or after a
       guaranteed-resolve fallback timer (REVEAL_FALLBACK_MS in
       src/components/motion.tsx), whichever comes first. The behaviour under
       test — that keyboard focus reveals a section which has not resolved yet
       — is only observable while the section is still pending, so the test
       has to hold it there.

       Left on the wall clock, the fallback wins that race whenever the machine
       is loaded enough, and flips the container to "shown" before the test
       reaches it. That is how this test failed intermittently under parallel
       load. Freezing Playwright's clock is not a fix: that fake clock
       advances with real time, so the pause target can land in the past and
       the call throws "Cannot fast-forward to the past" — it moves the race
       rather than removing it.

       Suppressing the single fallback timer is exact and has no window. The
       assertion below that the container is still "hidden" keeps the test
       honest: if the suppression ever stops working — because the fallback
       delay changes, or the mechanism moves elsewhere — the test fails loudly
       instead of quietly passing for the wrong reason. */
    await page.addInitScript((fallbackMs) => {
      const nativeSetTimeout = window.setTimeout.bind(window);
      window.setTimeout = ((
        handler: TimerHandler,
        timeout?: number,
        ...args: unknown[]
      ) => {
        if (timeout === fallbackMs) return 0;
        return nativeSetTimeout(handler, timeout, ...args);
      }) as typeof window.setTimeout;
    }, REVEAL_FALLBACK_MS);

    await page.goto('/contact');

    /* The locator must not depend on `data-reveal="hidden"`, because the
       component mutates that attribute to "shown" as soon as the reveal
       resolves. A locator keyed on the mutating attribute stops matching the
       very element the assertion is about, so the poll can never observe a
       settled value. Key on the stable structural signature instead — a
       reveal container holding a mailto link — and read the attribute and the
       computed opacity off a captured element handle. */
    const reveal = page
      .locator('[data-reveal]')
      .filter({ has: page.locator('a[href^="mailto:"]') })
      .first();
    await expect(reveal).toHaveCount(1);

    /* Capture the element before focusing. `elementHandle` stays bound to
       this exact node for the life of the test, so it survives the attribute
       flip and any re-render that replaces the locator's match. */
    const handle = await reveal.elementHandle();
    expect(handle).not.toBeNull();

    /* The reveal animates with a 900ms CSS transition. Suppressing transitions
       makes the CSS rule's effect observable synchronously, so the assertion
       below measures the `:focus-within` mechanism itself rather than
       "eventually visible". */
    await page.addStyleTag({
      content: '*, *::before, *::after { transition-duration: 0s !important; transition-delay: 0s !important; }',
    });

    const state = await handle!.evaluate((element) => {
      const link = element.querySelector('a[href^="mailto:"]');
      const before = {
        revealState: element.getAttribute('data-reveal'),
        opacity: getComputedStyle(element).opacity,
      };
      /* preventScroll keeps the container below the fold, so the
         IntersectionObserver cannot be what reveals it. */
      link?.focus({ preventScroll: true });
      const after = {
        revealState: element.getAttribute('data-reveal'),
        opacity: getComputedStyle(element).opacity,
        focusWithin: element.matches(':focus-within'),
      };
      return { before, after };
    });

    /* The container starts in the pre-trigger state and is genuinely
       transparent. */
    expect(state.before.revealState).toBe('hidden');
    expect(state.before.opacity).toBe('0');

    /* Focus landed inside the container, so `:focus-within` applies. */
    expect(state.after.focusWithin).toBe(true);

    /* The :focus-within rule must be what reveals it. The attribute is still
       "hidden" here — the component has not resolved the reveal — so the only
       thing that can have made the container opaque is the CSS rule keyed on
       `[data-reveal="hidden"]:focus-within`. If that rule is removed or
       broken, opacity stays 0 and this assertion fails. */
    expect(state.after.revealState).toBe('hidden');
    expect(state.after.opacity).toBe('1');

    /* And the settled state must persist, not flicker back. */
    await expect
      .poll(
        async () => handle!.evaluate((element) => getComputedStyle(element).opacity),
        { message: 'focus-within should keep the element revealed', timeout: 5000 },
      )
      .toBe('1');

    /* Final state: once the section resolves for real — here by scrolling it
       into view, which is the mechanism the app itself uses — the content
       must still be visible. Revealing it on focus must not have been a
       transient effect that the settled state undoes. */
    await handle!.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect
      .poll(
        async () => handle!.evaluate((element) => element.getAttribute('data-reveal')),
        { message: 'scrolling into view should resolve the reveal', timeout: 5000 },
      )
      .toBe('shown');
    expect(await handle!.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
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

  test('Mobile contact form keeps the floating concierge launcher clear of its fields', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/contact');

    await expect(page.locator('#phone')).toBeVisible();
    await expect(page.locator('button.fixed[aria-label="Open GIBS AI"]')).toHaveCount(0);

    const contactConcierge = page.getByRole('button', { name: 'Open GIBS AI', exact: true });
    await expect(contactConcierge).toBeVisible();
    await contactConcierge.click();
    await expect(page.getByRole('dialog', { name: 'GIBS AI' })).toBeVisible();
  });

  test('retired phone numbers never reach the rendered page', async ({ page }) => {
    /* The two retired desk numbers are still present in the byte-locked data
       file, so the render layer has to filter them out. This asserts on what
       the browser actually shows, across the pages that publish contact
       details, the enquiry FAQs and a programme detail page. Because the
       check reads the whole body, it also covers the shared footer and any
       other chrome that might publish a contact number. */
    const RETIRED = ['08033429427', '08032296041'];

    for (const route of [
      '/contact',
      '/admissions',
      '/programmes',
      '/programmes/course-1-public-sector-accounting-procedure-and-standards',
    ]) {
      await page.goto(route);
      const text = await page.locator('body').innerText();
      for (const number of RETIRED) {
        expect(text, `${route} must not publish the retired number ${number}`).not.toContain(number);
      }
    }

    /* The approved current numbers must still be published, so the retired
       numbers cannot be "fixed" by removing the contact details entirely. */
    await page.goto('/contact');
    const telLinks = await page
      .locator('a[href^="tel:"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(telLinks.length).toBeGreaterThan(0);
    for (const href of telLinks) {
      expect(RETIRED).not.toContain(href?.replace('tel:', ''));
    }
    expect(telLinks).toContain('tel:08160010401');

    /* The shared footer must publish the same set of numbers as the Contact
       page. It used to be a hand-typed literal inside the footer markup,
       which is precisely how a duplicate contact list starts drifting away
       from the rest of the site. Deriving the assertion from the Contact
       page's own links keeps this test honest about the shared policy
       instead of restating a second hard-coded list. */
    const footerPhones = await page
      .locator('footer p', { hasText: 'Phones:' })
      .first()
      .innerText();
    for (const number of RETIRED) {
      expect(footerPhones).not.toContain(number);
    }
    for (const href of telLinks) {
      const number = href?.replace('tel:', '');
      if (number) {
        expect(footerPhones, 'the footer must publish every approved number').toContain(number);
      }
    }
  });

  test('the concierge contact reply publishes only current phone numbers', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Open GIBS AI' }).first().click();

    const dialog = page.getByRole('dialog', { name: 'GIBS AI' });
    await dialog.getByLabel('Ask GIBS AI').fill('How do I contact GIBS by phone?');
    await dialog.getByRole('button', { name: 'Send message' }).click();

    /* The reply is delivered after a typing delay, so wait for it to arrive
       before reading the transcript. Waiting for the approved number first
       also means the assertions below are made against a reply that has
       actually been rendered, rather than against an empty transcript. */
    await expect
      .poll(async () => dialog.innerText(), { timeout: 15000 })
      .toContain('08160010401');

    const reply = await dialog.innerText();
    expect(reply).not.toContain('08033429427');
    expect(reply).not.toContain('08032296041');
    expect(reply).toContain('08160010401');
  });

  test('the contact enquiry type is pre-selected by a link that arrives while the page is open', async ({ page }) => {
    await page.goto('/contact');
    const enquiryType = page.locator('#enquiry-type');
    await expect(enquiryType).toHaveValue('');

    /* This is the real user path: the concierge replies and the programme
       and admissions calls to action link to /contact?type=… . Arriving at
       the contact page with the parameter already in the URL is handled by
       the first render; the case that used to break was the parameter
       changing while the contact page was already mounted, because the form
       state was only ever initialised once. */
    await page.evaluate(() => {
      window.location.hash = '#/contact?type=Local+Open+Training+Registration';
    });

    await expect(enquiryType).toHaveValue('Local Open Training Registration');

    await page.getByLabel('Full name').fill('GIBS Test Applicant');
    await page.getByLabel('Email').fill('applicant@example.com');
    await page.getByLabel('Your message').fill('Please share details about this training programme.');
    await page.getByRole('button', { name: 'Make an Enquiry' }).click();
    await expect(page.getByText('Your enquiry is ready to send.')).toBeVisible();

    await page.evaluate(() => {
      window.location.hash = '#/contact?type=Campus+Facility+Booking+%26+Enquiries';
    });

    await expect(enquiryType).toHaveValue('Campus Facility Booking & Enquiries');
    await expect(page.getByText('Your enquiry is ready to send.')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Make an Enquiry' })).toBeVisible();

    await page.evaluate(() => {
      window.location.hash = '#/contact?type=Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)';
    });

    await expect(enquiryType).toHaveValue('Foreign Training Programmes (Kigali, Dubai, London, Houston)');
  });

  test('the programme scope filters expose their selected state', async ({ page }) => {
    await page.goto('/programmes');
    const all = page.getByRole('button', { name: /^All Programmes/ });
    const local = page.getByRole('button', { name: /^Local \/ Open/ });
    const categories = page.getByRole('group', { name: 'Filter programmes by sector' });

    await expect(all).toHaveAttribute('aria-pressed', 'true');
    await expect(local).toHaveAttribute('aria-pressed', 'false');

    await categories.getByRole('button').nth(1).click();
    await expect(all).toHaveAttribute('aria-pressed', 'false');
    await all.click();
    await expect(all).toHaveAttribute('aria-pressed', 'true');

    await local.click();
    await expect(local).toHaveAttribute('aria-pressed', 'true');
    await expect(all).toHaveAttribute('aria-pressed', 'false');
  });

  test('an alternative programme address still points at the canonical one', async ({ page }) => {
    /* A programme is reachable by slug, by id, by code and by slug suffix.
       The canonical address must always name the slug that the sitemap
       lists, so the same content is not published as the canonical page of
       several different addresses. The alternative address is reached
       through the hash router, which is how the client actually sees it. */
    await page.goto('/programmes');
    await page.evaluate(() => {
      window.location.hash = '#/programmes/loc-1';
    });

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://gibs.com.ng/programmes/course-1-public-sector-accounting-procedure-and-standards'
    );
  });

  test('the concierge page keeps its history when the floating dialog is opened', async ({ page }) => {
    /* The /concierge page mounts its own conversation panel, and the floating
       dialog mounts a second one. They must not share one storage key: the
       dialog's empty transcript used to clear the page panel's stored
       conversation out of localStorage, so a visitor lost their history just
       by opening the dialog. */
    await page.goto('/concierge');

    /* The transcript region and the composer are siblings, not nested, so
       the page panel is addressed by its own input id. */
    await expect(page.getByRole('region', { name: 'GIBS AI conversation on this page' })).toBeVisible();
    await page.locator('#concierge-input-page').fill('Which programmes run in Kigali?');
    await page.locator('#concierge-input-page').press('Enter');

    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('gibs-concierge-page-v2')))
      .toContain('Which programmes run in Kigali?');

    await page.getByRole('button', { name: 'Open GIBS AI' }).first().click();
    await expect(page.getByRole('dialog', { name: 'GIBS AI' })).toBeVisible();

    await page.getByRole('dialog', { name: 'GIBS AI' }).getByRole('button', { name: 'Clear history' }).click();

    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('gibs-concierge-page-v2')))
      .toContain('Which programmes run in Kigali?');
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
