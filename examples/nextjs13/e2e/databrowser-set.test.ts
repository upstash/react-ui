import { test, expect } from "@playwright/test";

test("should add data from cli then try to navigate on databrowser", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Inputting the command to delete the set, to ensure the test starts clean
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL really_long_set");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.

  // Inputting the SADD command to add a set with 50 members
  await page
    .getByRole("textbox")
    .fill(`SADD really_long_set ${Array.from({ length: 50 }, (_, i) => `item${i + 1}`).join(" ")}`);
  await page.getByRole("textbox").press("Enter");

  await page.goto("http://localhost:3000/databrowser");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("really");
  await page.getByRole("button", { name: "S really_long_set" }).click();

  // Expect the first item of the set to be visible
  await expect(page.getByText("item1", { exact: true })).toBeVisible();

  // Navigate through pages to find the last item
  for (let i = 0; i < 4; i++) {
    await page.getByTestId("datatable-next").click({ delay: 100 });
  }
  await expect(page.getByText("item50", { exact: true })).toBeVisible();

  // Navigate back to find the first item again
  for (let i = 0; i < 4; i++) {
    await page.getByTestId("datatable-prev").click({ delay: 100 });
  }
  await expect(page.getByText("item1", { exact: true })).toBeVisible();
});
