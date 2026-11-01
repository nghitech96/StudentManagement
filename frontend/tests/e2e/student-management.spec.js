import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { TestPage } from "./pages/TestPage.js";
import { UsersPage } from "./pages/UsersPage.js";

test("register form submits and returns to login", async ({ page }) => {
  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-001",
        username: "nguyenvana",
        email: "ana@example.test",
      }),
    });
  });

  const register = new RegisterPage(page);
  await register.open();
  await register.createAccount({
    username: "nguyenvana",
    email: "ana@example.test",
    password: "Example123!",
  });

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("alert")).toContainText("Tài khoản đã được tạo");
});

test("login opens the user list", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-001",
        username: "nguyenvana",
        email: "ana@example.test",
      }),
    });
  });
  await page.route("**/api/users", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  const login = new LoginPage(page);
  await login.open();
  await login.signIn("ana@example.test", "Example123!");

  const users = new UsersPage(page);
  await expect(users.heading).toBeVisible();
  await expect(page.getByText("Chưa có tài khoản nào được đăng ký.")).toBeVisible();
});

test("users list can be filtered by email", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("student-management-user", JSON.stringify({
      id: "user-001",
      username: "admin",
      email: "admin@example.test",
    }));
  });
  await page.route("**/api/users", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "user-001", username: "an", email: "an@example.test" },
        { id: "user-002", username: "binh", email: "binh@example.test" },
      ]),
    });
  });

  const users = new UsersPage(page);
  await users.open();
  await expect(page.getByText("an@example.test")).toBeVisible();
  await users.searchFor("binh");
  await expect(page.getByText("binh@example.test")).toBeVisible();
  await expect(page.getByText("an@example.test")).toHaveCount(0);
});

test("test screen displays the backend health result", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("student-management-user", JSON.stringify({
      id: "user-001",
      username: "admin",
      email: "admin@example.test",
    }));
  });
  await page.route("**/api/health", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: "UP", service: "student-management-api" }),
    });
  });

  const testPage = new TestPage(page);
  await testPage.open();
  await testPage.runHealthCheck();

  await expect(page.getByRole("alert")).toContainText("Kết nối backend thành công");
  await expect(page.locator("pre")).toContainText('"status": "UP"');
});

test("home-loan Save Draft displays the request and API response", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("student-management-user", JSON.stringify({
      id: "user-001",
      username: "admin",
      email: "admin@example.test",
    }));
  });
  let postedApplication;
  await page.route("**/api/drafts", async (route) => {
    postedApplication = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Draft saved successfully.",
        data: { applicationId: "HL202610310001", status: "DRAFT" },
      }),
    });
  });

  await page.goto("/home-loan");
  await page.getByLabel("Họ và tên").fill("NGUYEN VAN AN TEST");
  await expect(page.locator("#request-preview")).toContainText("NGUYEN VAN AN TEST");
  await page.getByRole("button", { name: "Gửi Save Draft" }).click();

  await expect(page.getByRole("status")).toContainText("201 Created");
  await expect(page.getByLabel("Response body")).toContainText("Draft saved successfully");
  expect(postedApplication).toMatchObject({
    applicationId: "HL202610310001",
    productType: "HOME_LOAN",
    customer: { customerName: "NGUYEN VAN AN TEST" },
    loanInformation: { loanAmount: 2500000000, tenor: 240 },
    status: "DRAFT",
  });
});

test("home-loan form can send an invalid scenario and show the API error", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("student-management-user", JSON.stringify({
      id: "user-001",
      username: "admin",
      email: "admin@example.test",
    }));
  });
  let postedDraft;
  await page.route("**/api/drafts", async (route) => {
    postedDraft = route.request().postDataJSON();
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ message: "Loan amount must not be negative." }),
    });
  });

  await page.goto("/home-loan");
  await page.getByLabel("Mẫu dữ liệu kiểm thử").selectOption("TC003");
  await page.getByRole("button", { name: "Gửi Save Draft" }).click();

  await expect(page.getByRole("status")).toContainText("400 Bad Request");
  await expect(page.getByLabel("Response body")).toContainText("Loan amount must not be negative");
  expect(postedDraft.loanInformation.loanAmount).toBe(-100000000);
});

test("home-loan draft page is public without a saved login", async ({ page }) => {
  await page.goto("/home-loan");

  await expect(page.getByRole("heading", { name: "Đăng ký vay mua nhà" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Gửi Save Draft" })).toBeVisible();
});
