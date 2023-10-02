import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/databrowser');

  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByPlaceholder('Foo').fill('foo');
  await page.getByPlaceholder('Foo').press('Tab');
  await page.getByPlaceholder('Bar').fill('bar');

  await page.getByPlaceholder('1H is 3600 seconds').click();
  await page.getByPlaceholder('1H is 3600 seconds').fill('');

  await page.getByRole('button', { name: 'Save changes' }).click();

  const ttlButton = page.locator(':text-matches("^TTL:")');
  await ttlButton.click();

  // Adjust TTL to 600s
  await page.getByLabel('Seconds').dblclick();
  await page.getByLabel('Seconds').press('Meta+a');
  await page.getByLabel('Seconds').fill('600');

  // Click outside to apply the TTL and then persist the key
  await page.getByRole('heading', { name: 'foo' }).click();
  await ttlButton.click(); // Clicking the TTL button again after changing the value
  await page.getByRole('button', { name: 'Persist Key' }).click();

  // Verify that the TTL is now None
  await expect(page.getByRole('button', { name: 'TTL: None' })).toBeVisible();
});