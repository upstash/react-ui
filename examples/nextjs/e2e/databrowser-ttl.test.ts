import { test, expect } from "@playwright/test";

test("should add new data and set ttl", async ({ page }) => {
  await page.goto("http://localhost:3000/databrowser");

  await page.getByTestId("add-new-data").click({ delay: 100 });

  await page.getByPlaceholder("Foo").fill("foo");
  await page.getByPlaceholder("Foo").press("Tab");
  await page.getByPlaceholder("Bar").fill("bar");

  await page.getByRole("combobox").click();
  await page.getByLabel("Second(s)").click();
  await page.getByPlaceholder("1H is 3600 seconds").click();
  await page.getByPlaceholder("1H is 3600 seconds").fill("");

  await page.getByRole("button", { name: "Save changes" }).click();

  const ttlButton = page.locator(':text-matches("^TTL:")');
  await ttlButton.click();

  // Adjust TTL to 600s
  await page.getByLabel("Seconds").dblclick();
  await page.getByLabel("Seconds").press("Meta+a");
  await page.getByLabel("Seconds").fill("600");

  // Click outside to apply the TTL and then persist the key
  await page.getByText("foo").nth(1).click();
  await page.getByText("TTL: 600s").click();
  await page.getByRole("button", { name: "Persist Key" }).click();
  // Verify that the TTL is now None
  await expect(page.getByText("TTL: Forever")).toBeVisible();
});
