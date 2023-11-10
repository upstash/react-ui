import { expect, test } from "@playwright/test";
import { generateRandomString } from "./utils";

test("should scroll to bottom and update the line at the bottom", async ({ page }) => {
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
    id: 11,
    title: "perfume Oil",
    description: "Mega Discount, Impression of A...",
    price: 13,
    discountPercentage: 8.4,
    rating: 4.26,
    stock: 65,
    brand: "Impression of Acqua Di Gio",
    category: "fragrances",
    thumbnail: "https://i.dummyjson.com/data/products/11/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/11/1.jpg",
      "https://i.dummyjson.com/data/products/11/2.jpg",
      "https://i.dummyjson.com/data/products/11/3.jpg",
      "https://i.dummyjson.com/data/products/11/thumbnail.jpg",
    ],
  };
  await page.getByRole("textbox").fill(`JSON.SET my_json_object $ '${JSON.stringify(jsonObject)}'`);
  await page.getByRole("textbox").press("Enter");

  const randomString = generateRandomString();
  await page.goto("http://localhost:3000/databrowser");

  await page.getByRole("button", { name: "j my_json_object" }).click();
  await page.getByTestId("edit-items-in-place").click();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await page
    .getByText('{ "age": 30, "brand": "Impression of Acqua Di Gio", "cars": [ "BMW", "Fiat", "Fo')
    .fill(
      `{\n  "age": 30,\n  "brand": "${randomString}",\n  "cars": [\n    "BMW",\n    "Fiat",\n    "Ford"\n  ],\n  "category": "fragrances",\n  "description": "Mega Discount, Impression of A...",\n  "discountPercentage": 8.4,\n  "id": 11,\n  "images": [\n    "https://i.dummyjson.com/data/products/11/1.jpg",\n    "https://i.dummyjson.com/data/products/11/2.jpg",\n    "https://i.dummyjson.com/data/products/11/3.jpg",\n    "https://i.dummyjson.com/data/products/11/thumbnail.jpg"\n  ],\n  "name": "John Doe",\n  "price": 13,\n  "rating": 4.26,\n  "stock": 65,\n  "thumbnail": "${randomString}",\n  "title": "perfume Oil"\n}`,
    );
  await page.getByTestId("save-items").click();
  await expect(page.getByText(randomString)).toHaveCount(2);
});
