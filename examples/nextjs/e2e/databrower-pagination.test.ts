import { test, expect } from "@playwright/test";

test("should add new string key-values and test pagination", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Flushes db
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("flushdb");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); // TODO: Consider using a more reliable wait condition

  const msetCommand = Array.from({ length: 50 }, (_, i) => `string${i + 1} "This is string ${i + 1}"`).join(" ");
  await page.getByRole("textbox").fill(`MSET ${msetCommand}`);
  await page.getByRole("textbox").press("Enter");

  await page.goto("http://localhost:3000/databrowser");

  await expect(page.getByRole("button", { name: "s string1", exact: true })).toBeVisible();
  await page.getByTestId("sidebar-next").click({ delay: 100 });
  await page.getByTestId("sidebar-next").click({ delay: 100 });

  await expect(page.locator('button:has-text("sstring30")').first()).toBeVisible();

  await page.getByTestId("sidebar-prev").click({ delay: 100 });
  await page.getByTestId("sidebar-prev").click({ delay: 100 });
  await expect(page.getByRole("button", { name: "s string1", exact: true })).toBeVisible();
});
