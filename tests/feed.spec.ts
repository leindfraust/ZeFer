import { test, expect } from "@playwright/test";

test("can load default to relevance feed", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.goto("http://localhost:3000/?feed=relevance");
    await expect(page).toHaveURL("http://localhost:3000/?feed=relevance");
});

test("can load relevance feed", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.goto("http://localhost:3000/?feed=latest");
    await page.getByRole("heading", { name: "Relevant" }).click();
    await expect(page).toHaveURL("http://localhost:3000/?feed=relevance");
});

test("can load latest feed", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.goto("http://localhost:3000/?feed=relevance");
    await page.getByRole("heading", { name: "Latest" }).click();
    await expect(page).toHaveURL("http://localhost:3000/?feed=latest");
});

test("can load most-popular feed", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.goto("http://localhost:3000/?feed=relevance");
    await page.getByRole("heading", { name: "Most Popular" }).click();
    await expect(page).toHaveURL("http://localhost:3000/?feed=most-popular");
});
