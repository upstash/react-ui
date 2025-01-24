import { test, expect } from "@playwright/test";

test("should add data from cli then try to paginate on databrowser", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL really_long_list");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.

  await page
    .getByRole("textbox")
    .fill(`RPUSH really_long_list ${Array.from({ length: 50 }, (_, i) => `item${i + 1}`).join(" ")}`);
  await page.getByRole("textbox").press("Enter");
  await page.goto("http://localhost:3000/databrowser");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("really");
  await page.getByRole("button", { name: "L really_long_list" }).click();
  await expect(page.getByText("item1", { exact: true })).toBeVisible();

  for (let i = 0; i < 4; i++) {
    await page.getByTestId("datatable-next").click({ delay: 100 });
  }
  await expect(page.getByText("item50", { exact: true })).toBeVisible();

  // Navigate back to find the first item again
  for (let i = 0; i < 4; i++) {
    await page.getByTestId("datatable-prev").click({ delay: 100 });
  }
});
