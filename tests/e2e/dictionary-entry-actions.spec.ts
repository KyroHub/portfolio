import { expect, test, type Page } from "@playwright/test";

const ENTRY_PATH = "/en/entry/cd_173";
const E2E_TEST_USER_EMAIL = process.env.E2E_TEST_USER_EMAIL;
const E2E_TEST_USER_PASSWORD = process.env.E2E_TEST_USER_PASSWORD;
const HAS_E2E_AUTH = Boolean(E2E_TEST_USER_EMAIL && E2E_TEST_USER_PASSWORD);

async function loginToEntryPage(page: Page) {
  await page.goto(`/login?redirect_to=${encodeURIComponent(ENTRY_PATH)}`);
  await page.getByLabel("Email").fill(E2E_TEST_USER_EMAIL!);
  await page.getByLabel("Password").fill(E2E_TEST_USER_PASSWORD!);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(new RegExp(`${ENTRY_PATH}$`));
}

test("signed-out users see disabled dictionary entry actions", async ({ page }) => {
  await page.goto(ENTRY_PATH);

  const saveButton = page.getByRole("button", { name: "Save entry" });
  const reportButton = page.getByRole("button", { name: "Report entry" });

  await expect(saveButton).toBeDisabled();
  await expect(reportButton).toBeDisabled();

  await saveButton.locator("xpath=..").hover();
  await expect(
    saveButton.locator("xpath=following-sibling::div[1]"),
  ).toBeVisible();
});

test.describe("signed-in dictionary entry actions", () => {
  test.skip(
    !HAS_E2E_AUTH,
    "Set E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD to run signed-in dictionary action coverage.",
  );

  test("signed-in users can open the report form and toggle saved state", async ({
    page,
  }) => {
    await loginToEntryPage(page);

    const saveButton = page.getByRole("button", { name: /Save entry|Saved entry/ });
    await expect(saveButton).toBeEnabled();
    const initialLabel = (await saveButton.textContent())?.trim() ?? "";

    await page.getByRole("button", { name: "Report entry" }).click();
    await expect(page.getByRole("heading", { name: "Report an issue" })).toBeVisible();
    await expect(page.getByLabel("Reason")).toBeVisible();
    await expect(page.getByLabel("Commentary")).toBeVisible();

    await saveButton.click();
    const toggledLabel =
      initialLabel === "Saved entry" ? "Save entry" : "Saved entry";
    await expect(page.getByRole("button", { name: toggledLabel })).toBeVisible();

    await page.getByRole("button", { name: toggledLabel }).click();
    await expect(page.getByRole("button", { name: initialLabel })).toBeVisible();
  });
});
