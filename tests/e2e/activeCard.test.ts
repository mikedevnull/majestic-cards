import { test, expect } from "@playwright/test";

test("Main page shows no active card if non present", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("No active card in reader")).toBeVisible();
});

test("Main page shows unknown active card if change has been triggered", async ({
  page,
  request,
}) => {
  const changeCard = await request.put("/api/activeCard", {
    data: { id: "some-id-123" },
  });
  expect(changeCard.ok()).toBeTruthy();
  await page.goto("/");

  await expect(page.getByText("Unknown card in reader")).toBeVisible();
});
