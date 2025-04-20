import { test, expect } from "@playwright/test";

test("Main page shows no active card if non present", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("No active card in reader")).toBeVisible();
});
