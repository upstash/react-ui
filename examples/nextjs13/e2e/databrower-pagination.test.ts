import { test, expect } from "@playwright/test";

test("should add new string key-values and test pagination", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Flushes db
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("flushdb");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); // TODO: Consider using a more reliable wait condition

  // Inputting the MSET command to set 50 string keys
  const msetCommand = Array.from(
    { length: 50 },
    (_, i) => `string${i + 1} "This is string ${i + 1}"`
  ).join(" ");
  await page.getByRole("textbox").fill(`MSET ${msetCommand}`);
  await page.getByRole("textbox").press("Enter");

  await page.goto("http://localhost:3000/databrowser");

  await expect(page.locator('button:has-text("string1st")')).toBeVisible();
  await page.locator(".flex > button:nth-child(3)").click();
  await page.locator(".flex > button:nth-child(3)").click();
  await expect(page.locator('button:has-text("string30st")')).toBeVisible();

  await page.locator("div:nth-child(3) > .flex > button:nth-child(2)").click();
  await page.locator("div:nth-child(3) > .flex > button:nth-child(2)").click();
  await expect(page.locator('button:has-text("string1st")')).toBeVisible();
});
