import { test, expect } from "@playwright/test";

test("can load default to relevance feed", async ({ page }) => {
    await page.goto("https://staging.zefer.blog/");
    await page.goto("https://staging.zefer.blog/?feed=relevance");
    await expect(page).toHaveURL("https://staging.zefer.blog/?feed=relevance");
});

test("can load relevance feed", async ({ page }) => {
    await page.goto("https://staging.zefer.blog/");
    await page.goto("https://staging.zefer.blog/?feed=latest");
    await page.getByRole("heading", { name: "Relevant" }).click();
    await expect(page).toHaveURL("https://staging.zefer.blog/?feed=relevance");
});

test("can load latest feed", async ({ page }) => {
    await page.goto("https://staging.zefer.blog/");
    await page.goto("https://staging.zefer.blog/?feed=relevance");
    await page.getByRole("heading", { name: "Latest" }).click();
    await expect(page).toHaveURL("https://staging.zefer.blog/?feed=latest");
});

test("can load most-popular feed", async ({ page }) => {
    await page.goto("https://staging.zefer.blog/");
    await page.goto("https://staging.zefer.blog/?feed=relevance");
    await page.getByRole("heading", { name: "Most Popular" }).click();
    await expect(page).toHaveURL(
        "https://staging.zefer.blog/?feed=most-popular",
    );
});
