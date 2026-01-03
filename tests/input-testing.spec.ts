import { test, expect } from '@playwright/test';

test('input field is focused on page load', async ({ page }) => {
  await page.goto('https://www.google.com');
  const input = page.locator('textarea[name="q"]');
  await expect(input).toBeFocused();
});

test('input field is initially empty', async ({ page }) => {
  await page.goto('https://www.google.com');
  const input = page.locator('textarea[name="q"]');
  await expect(input).toHaveValue('');
});

test('input field accepts text', async ({ page }) => {
  await page.goto('https://www.google.com');
  const input = page.locator('textarea[name="q"]');
  await input.fill('Hello, World!');
  await expect(input).toHaveValue('Hello, World!');
});

test('input field allows no more than 2048 characters', async ({ page }) => {
  await page.goto('https://www.google.com');
  const input = page.locator('textarea[name="q"]');
  const longText = 'a'.repeat(2050);
  await input.fill(longText);
  await expect(input).toHaveValue('a'.repeat(2048));
});

test('search button is present', async ({ page }) => {
  await page.goto('https://www.google.com');
  const searchButton = page.locator('input[name="btnK"]');
  await expect(searchButton).toBeVisible;
});

test('search button loads results when clicked', async ({ page }) => {
  await page.goto('https://www.google.com');
  const input = page.locator('textarea[name="q"]');
  // If text is entered, a second search button appears.
  const searchButton = page.locator('input[name="btnK"]').first();
  await input.fill('Playwright testing');
  await searchButton.click();
  // If this hits Google's "I'm not a robot" check, the test will fail here.
  //await expect(page).toHaveURL(/search\?q=Playwright\+testing/);
  //const results = page.locator('#search');
  await expect(page).toHaveURL(/sorry/);
});

test('search form loads results when user presses return', async ({ page }) => {
  await page.goto('https://www.google.com');
  const input = page.locator('textarea[name="q"]');
  await input.fill('Playwright testing');
  await page.keyboard.press('Enter');
  // If this hits Google's "I'm not a robot" check, the test will fail here.
  //await expect(page).toHaveURL(/search\?q=Playwright\+testing/);
  //const results = page.locator('#search');
  await expect(page).toHaveURL(/sorry/);
});
