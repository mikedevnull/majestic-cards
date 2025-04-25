import { test, expect } from "@playwright/test";

test("Main page shows no active card if non present", async ({ page }) => {
  await page.goto("/");

  const firstResponse = await page.request.put("/api/activeCard", {
    data: {},
  });
  expect(firstResponse.ok()).toBeTruthy();

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

test("Main page changes when card is changed by api", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const firstResponse = await page.request.put("/api/activeCard", {
    data: {},
  });
  expect(firstResponse.ok()).toBeTruthy();

  await expect(page.getByText("No active card in reader")).toBeVisible();

  const secondsResponse = await request.put("/api/activeCard", {
    data: { id: "some-id-123" },
  });
  expect(secondsResponse.ok()).toBeTruthy();

  await expect(page.getByText("Unknown card in reader")).toBeVisible();

  const thirdResponse = await page.request.put("/api/activeCard", {
    data: {},
  });
  expect(thirdResponse.ok()).toBeTruthy();

  await expect(page.getByText("No active card in reader")).toBeVisible();
});
