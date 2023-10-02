import { test, expect } from "@playwright/test";

test("should add String data from cli then try to navigate on databrowser", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Inputting the command to delete the key, to ensure the test starts clean
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL my_string");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.

  // Inputting the SET command to set a string
  const myString = "Hello, this is a string!";
  await page.getByRole("textbox").fill(`SET my_string "${myString}"`);
  await page.getByRole("textbox").press("Enter");

  await page.goto("http://localhost:3000/databrowser");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("my_string");
  await page.getByRole("button", { name: "my_string st" }).click();

  await expect(page.locator('pre > code:has-text("' + myString + '")')).toBeVisible();
});
