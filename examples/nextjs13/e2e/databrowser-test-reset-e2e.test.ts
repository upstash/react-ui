import { expect, test } from "@playwright/test";

test("should test reset button with pagination, search and data type selection", async ({ page }) => {
  //FLUSH DB
  await page.goto("http://localhost:3000/");

  // Flushes db
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("flushdb");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); // TODO: Consider using a more reliable wait condition
  //ADD HASH VALUE FIRST
  await page
    .getByRole("textbox")
    .fill(`HSET really_long_hash ${Array.from({ length: 2 }, (_, i) => `field${i + 1} item${i + 1}`).join(" ")}`);
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); // TODO: Consider using a more reliable wait condition

  //ADD STRING VALUE
  const myString = "my_string";
  await page.getByRole("textbox").fill(`SET my_string "${myString}"`);
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); // TODO: Consider using a more reliable wait condition
  //Add some more data
  const msetCommand = Array.from({ length: 50 }, (_, i) => `string${i + 1} "This is string ${i + 1}"`).join(" ");
  await page.getByRole("textbox").fill(`MSET ${msetCommand}`);
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); // TODO: Consider using a more reliable wait condition

  await page.goto("http://localhost:5173/");
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("*long");
  await page.getByText("Data on a break").click();
  await page.getByPlaceholder("Search").click();
  await page.getByPlaceholder("Search").fill("*long*");
  await page.getByRole("button", { name: "h really_long_hash" }).click();
  await page.getByTestId("reset").click();
  await page.getByRole("button", { name: `s ${myString}` }).click();
  await page.getByTestId("sidebar-next").click({
    clickCount: 3,
  });
  await page.getByTestId("reset").click();
  await page.getByRole("button", { name: `s ${myString}` }).click();
  await page.getByRole("combobox").click();
  await page.getByLabel("Hash").click();
  await page.getByRole("button", { name: "h really_long_hash" }).click();
  await page.getByTestId("reset").click();
  await expect(page.getByRole("button", { name: `s ${myString}` })).toBeVisible();
});
