import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5174/");
  await page.getByRole("button", { name: "s string1", exact: true }).click();
  await page.getByTestId("sidebar-next").dblclick();
  await page.getByRole("button", { name: "s string30" }).click();
  await page.getByTestId("sidebar-prev").click();
  await page.getByTestId("sidebar-prev").click();
  await page.getByRole("button", { name: "s string1", exact: true }).click();
});
