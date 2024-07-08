import { test, expect } from "@playwright/test";
const baseUrl = process.env.BASE_URL || "https://staging.zefer.blog/";

test("can load default to relevance feed", async ({ page }) => {
    await page.goto(baseUrl);
    await page.goto(`${baseUrl}?feed=relevance`);
    await expect(page).toHaveURL(`${baseUrl}?feed=relevance`);
});

test("can load relevance feed", async ({ page }) => {
    await page.goto(baseUrl);
    await page.goto(`${baseUrl}?feed=latest`);
    await page.getByRole("heading", { name: "Relevant" }).click();
    await expect(page).toHaveURL(`${baseUrl}?feed=relevance`);
});

test("can load latest feed", async ({ page }) => {
    await page.goto(baseUrl);
    await page.goto(`${baseUrl}?feed=relevance`);
    await page.getByRole("heading", { name: "Latest" }).click();
    await expect(page).toHaveURL(`${baseUrl}?feed=latest`);
});

test("can load most-popular feed", async ({ page }) => {
    await page.goto(baseUrl);
    await page.goto(`${baseUrl}?feed=relevance`);
    await page.getByRole("heading", { name: "Most Popular" }).click();
    await expect(page).toHaveURL(`${baseUrl}?feed=most-popular`);
});
