import { test, expect } from "@playwright/test";

test("should add data from cli then try to navigate on databrowser", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Inputting the command to delete the hash, to ensure the test starts clean
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL really_long_hash");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.

  // Inputting the HSET command to add a hash with 50 fields
  await page
    .getByRole("textbox")
    .fill(`HSET really_long_hash ${Array.from({ length: 50 }, (_, i) => `field${i + 1} item${i + 1}`).join(" ")}`);
  await page.getByRole("textbox").press("Enter");

  await page.goto("http://localhost:3000/databrowser");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("really");
  await page.getByRole("button", { name: "really_long_hash ha" }).click();

  // Expect the first item of the hash to be visible
  await expect(page.getByText("item1", { exact: true })).toBeVisible();

  // Navigate through pages to find the last item
  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Next" }).click();
  }
  await expect(page.getByText("item50", { exact: true })).toBeVisible();

  // Navigate back to find the first item again
  for (let i = 0; i < 4; i++) {
    await page.getByRole("button", { name: "Previous" }).click();
  }
  await expect(page.getByText("item1", { exact: true })).toBeVisible();
});
