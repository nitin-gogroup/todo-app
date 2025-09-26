import { APIRequest } from "@playwright/test";
import path from "path";

export default async function getPlaywrightRequestContextWithAuth(
  request: APIRequest
) {
  const BE_BASE_URL = process.env.E2E_BASE_URL + "/api";
  if (!BE_BASE_URL) {
    console.error("playwright Base URL is not defined");
  }

  //  Fetch some token for API auth
  //  const response = await context.post("some-url");
  //  const { accessToken } = await response.json();

  return request.newContext({
    storageState: path.join(__dirname, "../../playwright/.auth/user.json"),
    baseURL: BE_BASE_URL,
    extraHTTPHeaders: {
      Accept: "application/json",
      // Add authorization token to all requests.
      //   Authorization: `Bearer ${accessToken}`,
    },
  });
}
