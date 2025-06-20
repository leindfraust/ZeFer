import { test, expect } from "@playwright/test";

test("able to search", async ({ page }) => {
    const baseUrl = process.env.BASE_URL || "https://zefer.vercel.app/";
    await page.goto(`${baseUrl}search/posts?q=test&feed=relevance`);
    await expect(page.getByText("RelevantLatestMost Popular")).toBeVisible();
    await expect(page.getByRole("link", { name: "People" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tags" }).nth(1)).toBeVisible();
});
