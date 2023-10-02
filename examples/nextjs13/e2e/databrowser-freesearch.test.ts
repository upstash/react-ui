import { test, expect } from "@playwright/test";

test("should add data, search, and validate the search functionality", async ({ page }) => {
  await page.goto("http://localhost:3000/databrowser");

  // Clicking on the "Add" button to open the form to add new data
  await page.getByRole("button", { name: "Add" }).click();

  // Filling the form with "foo" and "bar" and setting the time to "400" seconds
  await page.fill('[placeholder="Foo"]', "foo");
  await page.press('[placeholder="Foo"]', "Tab");
  await page.fill('[placeholder="Bar"]', "bar");
  await page.press('[placeholder="Bar"]', "Tab");
  await page.fill('[placeholder="1H is 3600 seconds"]', "400");

  // Saving the changes
  await page.getByRole("button", { name: "Save changes" }).click();

  // Searching for the newly added data "foo"
  await page.click('[placeholder="Search"]');
  await page.fill('[placeholder="Search"]', "foo");
  await page.getByRole("button", { name: "foo st" }).click();

  // Clicking on the first button inside the third div and the .flex class
  await page.locator("div:nth-child(3) > .flex > button").first().click();

  // Validating that the search input is empty after click
  await page.click('[placeholder="Search"]');
  const inputValue = await page.inputValue('[placeholder="Search"]');
  expect(inputValue).toBe("");
});
