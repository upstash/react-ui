import { test, expect } from "@playwright/test";

test("should add new data and delete it succesfully", async ({ page }) => {
  await page.goto("http://localhost:3000/databrowser");
  await page.getByTestId("add-new-data").click({ delay: 100 });

  await page.getByPlaceholder("Foo").fill("foo");
  await page.getByPlaceholder("Foo").press("Tab");
  await page.getByPlaceholder("Bar").fill("bar");

  await page.getByRole("combobox").click();
  await page.getByLabel("Second(s)").click();
  await page.getByPlaceholder("1H is 3600 seconds").click();
  await page.getByPlaceholder("1H is 3600 seconds").fill("500");

  await page.getByRole("button", { name: "Save changes" }).click();

  await page.getByTestId("delete").click({ delay: 100 });
  await page.getByRole("button", { name: "Delete" }).click();

  const missingDataElement = page.locator('[data-testid="missing-data"]');

  const missingDataText = await missingDataElement.textContent();
  expect(missingDataText).toBe("Select a record from the list");
});
