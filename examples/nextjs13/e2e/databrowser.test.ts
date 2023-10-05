import { expect, test } from "@playwright/test";

test("Check the missing data text", async ({ page }) => {
  await page.goto("http://localhost:3000/databrowser");
  // Wait for the element to be in the DOM.
  const missingDataElement = page.locator('[data-testid="missing-data"]');

  // Get the text content of the element and compare it to the expected value.
  const missingDataText = await missingDataElement.textContent();
  expect(missingDataText).toBe(
    "\"Oops! Data's playing hide and seek and it's winning! Try adding some data from CLI?\"",
  );
});
