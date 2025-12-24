import { test, expect } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
});

test('has login heading', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('has learn more link', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.getByRole('link', { name: 'Learn more' })).toBeVisible();
});

test('learn more page links to RFC 2606', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'Learn more' }).click();
  await expect(page.getByRole('link', { name: 'RFC 2606' })).toBeVisible();
});

test('learn more page links to RFC 6761', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'Learn more' }).click();
  await expect(page.getByRole('link', { name: 'RFC 6761' })).toBeVisible();
});

test('learn more page links to RFC 9001', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'Learn more' }).click();
  await expect(page.getByRole('link', { name: 'RFC 9001' })).toBeVisible();
});

test('learn more page mentions example.com', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'Learn more' }).click();
  await expect(page.getByText('example.com')).toBeVisible();
});

test('learn more page mentions google.com', async ({ page }) => {
  await page.goto('https://example.com');
  await page.getByRole('link', { name: 'Learn more' }).click();
  await expect(page.getByText('google.com')).toBeVisible();
});

test('page has no broken links', async ({ page, request }) => {
  await page.goto('https://example.com');
  const hrefs = await page.locator('a').evaluateAll(els => els.map(a => a.getAttribute('href')).filter((href): href is string => Boolean(href)));
  if (!hrefs.length) return;
  const broken: { url: string; status?: number; error?: string }[] = [];
  for (const href of hrefs) {
    if (!href.startsWith('https://')) continue;

    try {
      const response = await request.get(href, { maxRedirects: 5 });
      const status = response.status();
      if (status >= 400) {
        broken.push({ url: href, status: response.status() });
      }
    } catch (error: any) {
      broken.push({ url: href, error: String(error?.message ?? error) });
    }
  }

  expect(broken, broken.length ? `Broken links:\n${broken.map(b=> `${b.url} - ${b.status ?? b.error}`).join('\n')}` : undefined).toEqual([]);
});
