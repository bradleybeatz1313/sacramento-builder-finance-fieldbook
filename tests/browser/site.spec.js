import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'short-desktop', width: 1258, height: 622 },
];

for (const viewport of viewports) {
  test(`${viewport.name} has usable geometry and no console failures`, async ({ page }) => {
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /build the second lane/i })).toBeVisible();
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      mainTop: document.querySelector('main').getBoundingClientRect().top,
      headerBottom: document.querySelector('header').getBoundingClientRect().bottom,
    }));
    expect(geometry.overflow).toBe(false);
    expect(geometry.mainTop).toBeGreaterThanOrEqual(geometry.headerBottom - 1);
    expect(errors).toEqual([]);
  });
}

test('filtering and script tabs are keyboard-accessible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Priority five' }).click();
  await expect(page.locator('.builder-card:visible')).toHaveCount(5);
  const onsite = page.getByRole('tab', { name: 'Model home' });
  await onsite.focus();
  await page.keyboard.press('Enter');
  await expect(onsite).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#script-copy')).toContainText('preferred lender');
});

test('reduced motion disables animation', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  const animation = await page.locator('.route-line').evaluate((node) => getComputedStyle(node).animationName);
  expect(animation).toBe('none');
  await context.close();
});

test('no-JavaScript fallback retains core content and links', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /build the second lane/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Regulation X §1024.14/i })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await context.close();
});

test('all rendered research links are secure and non-placeholder', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const links = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  expect(links.some((href) => href === '#' || href === '')).toBe(false);
  for (const href of links.filter((value) => value.startsWith('http'))) expect(href.startsWith('https://')).toBe(true);
});
