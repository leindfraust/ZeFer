import { test, expect } from "@playwright/test";

test("able to search", async ({ page }) => {
    await page.goto("https://staging.zefer.blog/");
    await page.goto("https://staging.zefer.blog/?feed=relevance");
    await page.getByRole("textbox", { name: "Search…" }).click();
    await page.getByRole("textbox", { name: "Search…" }).fill("test");
    await page.getByRole("textbox", { name: "Search…" }).press("Enter");
    await page.goto(
        "https://staging.zefer.blog/search/posts?q=test&feed=relevance",
    );
    await expect(page.getByText("RelevantLatestMost Popular")).toBeVisible();
    await expect(page.getByRole("link", { name: "People" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tags" }).nth(1)).toBeVisible();
});
