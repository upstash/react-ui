import { test, expect } from "@playwright/test";

test("should add JSON data from cli then try to navigate on databrowser", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Inputting the command to delete the key, to ensure the test starts clean
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL my_json_object");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.
  // Inputting the JSON.SET command to set a JSON object
  const jsonObject = {
    name: "John Doe",
    age: 30,
    cars: ["Ford", "BMW", "Fiat"],
  };
  await page.getByRole("textbox").fill(`JSON.SET my_json_object $ '${JSON.stringify(jsonObject)}'`);
  await page.getByRole("textbox").press("Enter");

  await page.goto("http://localhost:3000/databrowser");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("my_json_object");
  await page.getByRole("button", { name: "j my_json_object" }).click();

  // Expect some data from the JSON object to be visible on the screen
  await expect(page.locator(':text-matches("John Doe")')).toBeVisible();
  await expect(page.locator(':text-matches("30")')).toBeVisible();
  await expect(page.locator(':text-matches("Ford")')).toBeVisible();
});
