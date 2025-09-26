import { test, expect, APIRequestContext } from "@playwright/test";
import getPlaywrightRequestContextWithAuth from "./setup/get-playwright-req-context-with-auth.util";

let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await getPlaywrightRequestContextWithAuth(playwright.request);
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test("Get all todos", async () => {
  const response = await apiContext.get("/api/todos");
  const data = await response.json();
  expect(data).toBeTruthy();
});
