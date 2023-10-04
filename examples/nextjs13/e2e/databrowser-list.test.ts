import { test, expect } from "@playwright/test";

test("should add data from cli then try to paginate on databrowser", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL really_long_list");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.

  await page
    .getByRole("textbox")
    .fill(
      "RPUSH really_long_list item1 item2 item3 item4 item5 item6 item7 item8 item9 item10 item11 item12 item13 item14 item15 item16 item17 item18 item19 item20 item21 item22 item23 item24 item25 item26 item27 item28 item29 item30 item31 item32 item33 item34 item35 item36 item37 item38 item39 item40 item41 item42 item43 item44 item45 item46 item47 item48 item49 item50",
    );
  await page.getByRole("textbox").press("Enter");
  await page.goto("http://localhost:3000/databrowser");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("really");
  await page.getByRole("button", { name: "really_long_list li" }).click();
  await expect(page.getByText('"item1"', { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText('"item50"', { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Previous" }).click();
  await page.getByRole("button", { name: "Previous" }).click();
  await page.getByRole("button", { name: "Previous" }).click();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.getByText('"item1"', { exact: true })).toBeVisible();
});
