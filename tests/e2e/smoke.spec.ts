import { expect, test } from "@playwright/test";

test("root route redirects to the English homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Wannes Portfolio" })).toBeVisible();
});

test("English locale renders English navigation", async ({ page }) => {
  await page.goto("/en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.locator("header").getByRole("link", { name: "Publications", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Wannes Portfolio" })).toBeVisible();
});

test("Dutch locale renders Dutch navigation", async ({ page }) => {
  await page.goto("/nl");

  await expect(page.locator("html")).toHaveAttribute("lang", "nl");
  await expect(
    page.locator("header").getByRole("link", { name: "Publicaties", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Wannes Portfolio" })).toBeVisible();
});

test("legacy dictionary route redirects to the localized dictionary page", async ({
  page,
}) => {
  await page.goto("/dictionary");

  await expect(page).toHaveURL(/\/en\/dictionary$/);
  await expect(page.getByRole("heading", { name: "Coptic Dictionary" })).toBeVisible();
  await expect(
    page.getByPlaceholder("Search in Coptic, English, or Greek..."),
  ).toBeVisible();
});

test("legacy grammar route redirects to the localized grammar page", async ({
  page,
}) => {
  await page.goto("/grammar");

  await expect(page).toHaveURL(/\/en\/grammar$/);
  await expect(page.getByRole("heading", { name: "Coptic Grammar" })).toBeVisible();
  await expect(page.getByText("Lesson 01")).toBeVisible();
});

test("dashboard redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?/);

  const url = new URL(page.url());
  expect(url.pathname).toBe("/login");
  expect(url.searchParams.get("redirect_to")).toBe("/dashboard");
});

test("grammar API index responds with the published dataset metadata", async ({
  request,
}) => {
  const response = await request.get("/api/v1/grammar");

  expect(response.ok()).toBeTruthy();

  const payload = await response.json();
  expect(payload.name).toBe("Kyrillos Wannes Grammar API");
  expect(payload.apiBasePath).toBe("/api/v1/grammar");
  expect(payload.lessonCounts.published).toBeGreaterThan(0);
});
