import { test, expect } from "@playwright/test";

import {
  checkNumberOfCompletedTodosInLocalStorage,
  checkNumberOfTodosInLocalStorage,
  createDefaultTodos,
  visitTestApp,
} from "./test-utils";

test.beforeEach(async ({ page }) => {
  await visitTestApp(page);
});

test.describe("Mark all as completed", () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should allow me to mark all items as completed", async ({ page }) => {
    await page.locator(".toggle-all").check();

    await expect(
      page.locator(".todo-list li"),
      "Ensure all todos have 'completed' class."
    ).toHaveClass(["completed", "completed", "completed"]);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  });

  test("should allow me to clear the complete state of all items", async ({
    page,
  }, testInfo) => {
    await page.locator(".toggle-all").check();
    await page.locator(".toggle-all").uncheck();

    await testInfo.attach("All-completed-unchecked", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await expect(
      page.locator(".todo-list li"),
      "Should be no completed classes."
    ).toHaveClass(["", "", ""]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    page,
  }, testInfo) => {
    const toggleAll = page.locator(".toggle-all");
    await toggleAll.check();

    await expect(toggleAll).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    const firstTodo = page.locator(".todo-list li").nth(0);
    await firstTodo.locator(".toggle").uncheck();

    await testInfo.attach("first-unchecked", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await expect(
      toggleAll,
      "Reuse toggleAll locator and make sure its not checked."
    ).not.toBeChecked();

    await firstTodo.locator(".toggle").check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    await expect(
      toggleAll,
      "Assert the toggle all is checked again."
    ).toBeChecked();
  });
});
