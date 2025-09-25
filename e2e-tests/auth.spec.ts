import test, { expect } from "@playwright/test";

test("Test auth", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
  await expect(page).toHaveURL(process.env.E2E_BASE_URL!);
});
