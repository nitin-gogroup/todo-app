import path from "node:path";
import { test as setup } from "@playwright/test";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_AUTH_EMAIL;
  const password = process.env.E2E_AUTH_PASSWORD;
  if (!email || !password) {
    throw Error("email/password missing from node env");
  }

  page.goto("/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
