import { test } from "@playwright/test";
import { generateRandomString } from "./utils";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Inputting the command to delete the key, to ensure the test starts clean
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("DEL my_string");
  await page.getByRole("textbox").press("Enter");
  await page.waitForTimeout(500); //TODO: Dirty hack to wait after delete. Should be fixed later.

  // Inputting the SET command to set a string
  const myString = "Hello, this is a string!";
  await page.getByRole("textbox").fill(`SET my_string "${myString}"`);
  await page.getByRole("textbox").press("Enter");

  const randomString = generateRandomString();

  await page.goto("http://localhost:3000/databrowser");
  await page.getByRole("button", { name: "s my_string" }).click();
  await page.getByTestId("edit-items-in-place").click();
  await page.getByText("Hello, this is a string!").fill(`"${randomString}"`);
  await page.getByTestId("save-items").click();

  await page.getByText(`${randomString}`).click();
});
